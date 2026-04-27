import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Lightweight password gate for /admin.
 *
 * Not enterprise auth — just enough to keep the dashboard private until we
 * wire up real auth. The password lives in ADMIN_PASSWORD; we set an HMAC
 * cookie on success so we don't have to send the password back on every
 * request.
 */

export const ADMIN_COOKIE = "aaatx_admin";

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "aaatxroof-admin-dev-secret"
  );
}

export function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length > 0 ? pw : null;
}

export function signAdminToken(): string {
  const issuedAt = Date.now().toString();
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(issuedAt)
    .digest("hex");
  return `${issuedAt}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issuedAt, sig] = token.split(".");
  if (!issuedAt || !sig) return false;
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(issuedAt)
    .digest("hex");
  // constant-time compare
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}
