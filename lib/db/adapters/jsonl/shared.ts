/**
 * Shared utilities for the JSONL adapter.
 *
 * Three concerns:
 *   1. File locking — wraps multi-step operations (read → mutate → write) so
 *      two concurrent requests can't trample each other.
 *   2. Atomic write — write to a sibling tempfile then `rename()` (POSIX
 *      atomic on the same filesystem). Eliminates the "half-written file"
 *      window that the old `writeFile` had during status updates.
 *   3. Append — single-syscall `appendFile` is already atomic for small
 *      writes on local disks, but we still acquire a lock so it serializes
 *      with status-update rewrites.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import lockfile from "proper-lockfile";

export const DATA_DIR = path.join(process.cwd(), "data");

export async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function ensureFile(file: string): Promise<void> {
  await ensureDataDir();
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, "", "utf8");
  }
}

/**
 * Run `fn` while holding an exclusive lock on `file`.
 *
 * proper-lockfile uses a `<file>.lock` directory as the mutex. We pass
 * `realpath: false` because the lockfile may be created before the target
 * file exists on disk; we ensure the file exists first to satisfy the
 * library either way.
 */
export async function withFileLock<T>(
  file: string,
  fn: () => Promise<T>,
): Promise<T> {
  await ensureFile(file);
  const release = await lockfile.lock(file, {
    // Generous retry budget so a burst of concurrent writes (lead intake +
    // status updates) doesn't fail loudly. With factor=1.2 / min=15ms the
    // total max wait is ~7s — well under any sane request timeout.
    retries: {
      retries: 50,
      factor: 1.2,
      minTimeout: 15,
      maxTimeout: 300,
    },
    stale: 10_000, // assume a lock older than 10s is dead (crashed process)
    realpath: false,
  });
  try {
    return await fn();
  } finally {
    await release();
  }
}

/** Read every JSON line in `file`. Skips malformed lines (logs a warning). */
export async function readJsonl<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    if (!raw.trim()) return [];
    const out: T[] = [];
    raw.split("\n").forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        out.push(JSON.parse(trimmed) as T);
      } catch (err) {
        console.warn(
          `[db/jsonl] Skipping malformed line ${idx + 1} in ${file}:`,
          err,
        );
      }
    });
    return out;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "ENOENT"
    ) {
      return [];
    }
    throw err;
  }
}

/**
 * Append a single JSON line to `file`. Caller is responsible for holding
 * the lock if it needs ordering relative to other reads/writes.
 */
export async function appendJsonl<T>(file: string, row: T): Promise<void> {
  await ensureDataDir();
  await fs.appendFile(file, JSON.stringify(row) + "\n", "utf8");
}

/**
 * Atomically replace `file` with the serialized contents of `rows`.
 *
 * Strategy: write to `<file>.tmp.<random>` then `rename()`. POSIX `rename`
 * is atomic on the same filesystem, so readers either see the old file or
 * the new file — never a half-written one.
 */
export async function atomicWriteJsonl<T>(
  file: string,
  rows: T[],
): Promise<void> {
  await ensureDataDir();
  const tmp = `${file}.tmp.${randomBytes(6).toString("hex")}`;
  const content = rows.map((row) => JSON.stringify(row)).join("\n");
  const payload = content ? content + "\n" : "";
  try {
    await fs.writeFile(tmp, payload, "utf8");
    await fs.rename(tmp, file);
  } catch (err) {
    // Best-effort cleanup of the temp file if rename failed.
    try {
      await fs.unlink(tmp);
    } catch {
      // ignore
    }
    throw err;
  }
}
