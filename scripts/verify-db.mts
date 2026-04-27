/**
 * Smoke test for the data-layer abstraction.
 *
 * Run with:  npx tsx scripts/verify-db.ts
 *
 * Spins up the JSONL adapter against a temp data dir, exercises:
 *   - LeadRepo.create / list / get / updateStatus / count
 *   - AppointmentRepo.create / isSlotBooked / getBookedSlotSet / updateStatus
 *   - 50 concurrent appends — verify no corruption
 *   - Concurrent updates + appends — race the old code lost on
 */

import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const tmp = mkdtempSync(path.join(tmpdir(), "aaatxroof-db-test-"));
process.chdir(tmp);
process.env.DB_ADAPTER = "jsonl";
delete process.env.DATABASE_URL;

const root = path.resolve(import.meta.dirname, "..");

const { getLeadRepo, getAppointmentRepo } = await import(
  path.join(root, "lib", "db", "index.ts")
);

const leadRepo = getLeadRepo();
const apptRepo = getAppointmentRepo();

let pass = 0;
let fail = 0;
function assert(label: string, cond: boolean, detail = "") {
  if (cond) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.error(`  ✗ ${label} ${detail}`);
  }
}

console.log("# Lead repo");
const lead = await leadRepo.create({
  name: "Smoke Test",
  phone: "5125550100",
  address: "1 Roof Way, Robstown, TX",
  propertyType: "residential",
  services: ["residential"],
  timeline: "flexible",
  source: "smoke-test",
});
assert("create returns id", typeof lead.id === "string" && lead.id.length > 0);
assert("create sets status=new", lead.status === "new");
assert("create sets createdAt", typeof lead.createdAt === "string");

const got = await leadRepo.get(lead.id);
assert("get returns the lead", got?.id === lead.id);

const list1 = await leadRepo.list();
assert(
  "list includes new lead",
  list1.some((l: { id: string }) => l.id === lead.id),
);

const updated = await leadRepo.updateStatus(lead.id, "contacted");
assert("updateStatus returns updated", updated?.status === "contacted");

const got2 = await leadRepo.get(lead.id);
assert("get reflects update", got2?.status === "contacted");

const ghost = await leadRepo.updateStatus("nope-not-real", "won");
assert("updateStatus returns null for missing", ghost === null);

const cAll = await leadRepo.count();
const cContacted = await leadRepo.count({ status: "contacted" });
assert("count() works", cAll >= 1);
assert("count({status}) filters", cContacted >= 1);

console.log("\n# Appointment repo");
const slot = new Date(Date.now() + 86_400_000).toISOString();
const appt = await apptRepo.create({
  scheduledFor: slot,
  customerName: "Smoke Test",
  customerPhone: "5125550100",
  customerEmail: "smoke@test.com",
  address: "1 Roof Way, Robstown, TX",
  inspectionType: "residential",
});
assert(
  "appointment created with status=scheduled",
  appt.status === "scheduled",
);
assert("isSlotBooked sees scheduled appt", await apptRepo.isSlotBooked(slot));
const booked = await apptRepo.getBookedSlotSet();
assert("getBookedSlotSet contains slot", booked.has(slot));

const updatedAppt = await apptRepo.updateStatus(appt.id, "cancelled");
assert("appt updateStatus returns row", updatedAppt?.status === "cancelled");
assert(
  "isSlotBooked false after cancel",
  !(await apptRepo.isSlotBooked(slot)),
);

console.log("\n# Concurrent appends (50 leads)");
const before = (await leadRepo.list()).length;
const promises: Promise<unknown>[] = [];
for (let i = 0; i < 50; i++) {
  promises.push(
    leadRepo.create({
      name: `Concurrent ${i}`,
      phone: "5125550100",
      address: "Concurrent St",
      propertyType: "residential",
      services: ["residential"],
      timeline: "flexible",
    }),
  );
}
const results = (await Promise.all(promises)) as { id: string }[];
const after = (await leadRepo.list()).length;
assert("all 50 leads created", results.length === 50);
assert(
  "list grew by exactly 50",
  after - before === 50,
  `got ${after - before}`,
);

const leadsFile = path.join(tmp, "data", "leads.jsonl");
const raw = readFileSync(leadsFile, "utf8");
const lines = raw.split("\n").filter((l) => l.trim());
let parseErrors = 0;
for (const l of lines) {
  try {
    JSON.parse(l);
  } catch {
    parseErrors++;
  }
}
assert(
  "no malformed JSONL lines after concurrent write",
  parseErrors === 0,
);

console.log("\n# Concurrent updates + appends (race condition)");
const targets = results.slice(0, 20);
const mixed: Promise<unknown>[] = [];
for (let i = 0; i < 20; i++) {
  mixed.push(leadRepo.updateStatus(targets[i].id, "won"));
  mixed.push(
    leadRepo.create({
      name: `Race ${i}`,
      phone: "5125550100",
      address: "Race St",
      propertyType: "residential",
      services: ["residential"],
      timeline: "flexible",
    }),
  );
}
await Promise.all(mixed);

const raceList = await leadRepo.list();
const wonCount = raceList.filter(
  (l: { status: string }) => l.status === "won",
).length;
assert("all 20 targets transitioned to won", wonCount >= 20);

const raw2 = readFileSync(leadsFile, "utf8");
const lines2 = raw2.split("\n").filter((l) => l.trim());
let parseErrors2 = 0;
for (const l of lines2) {
  try {
    JSON.parse(l);
  } catch {
    parseErrors2++;
  }
}
assert(
  "file still well-formed after race",
  parseErrors2 === 0,
  `${parseErrors2} bad lines`,
);

const lockDir = path.join(tmp, "data", "leads.jsonl.lock");
assert("lock released after operations", !existsSync(lockDir));

console.log(`\nResult: ${pass} passed, ${fail} failed`);

rmSync(tmp, { recursive: true, force: true });

if (fail > 0) process.exit(1);
