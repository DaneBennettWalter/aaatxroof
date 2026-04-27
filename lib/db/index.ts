/**
 * Public data-access API.
 *
 * Application code imports `leadRepo` / `appointmentRepo` from here and
 * uses the abstract interfaces in `./types`. The concrete adapter is
 * chosen once at process start based on env:
 *
 *   - `DATABASE_URL` set → Postgres adapter (Drizzle + node-postgres)
 *   - otherwise          → JSONL adapter (data/*.jsonl, file-locked)
 *
 * Override for tests by setting `DB_ADAPTER=jsonl|postgres`.
 *
 * See `docs/DATABASE.md` for migration playbook.
 */

import type { AppointmentRepo, LeadRepo } from "./types";
import { JsonlAppointmentRepo } from "./adapters/jsonl/appointments";
import { JsonlLeadRepo } from "./adapters/jsonl/leads";
import { PostgresAppointmentRepo } from "./adapters/postgres/appointments";
import { PostgresLeadRepo } from "./adapters/postgres/leads";

export type Adapter = "jsonl" | "postgres";

export function selectedAdapter(): Adapter {
  const explicit = process.env.DB_ADAPTER?.toLowerCase();
  if (explicit === "jsonl" || explicit === "postgres") return explicit;
  return process.env.DATABASE_URL ? "postgres" : "jsonl";
}

function buildLeadRepo(): LeadRepo {
  return selectedAdapter() === "postgres"
    ? new PostgresLeadRepo()
    : new JsonlLeadRepo();
}

function buildAppointmentRepo(): AppointmentRepo {
  return selectedAdapter() === "postgres"
    ? new PostgresAppointmentRepo()
    : new JsonlAppointmentRepo();
}

// Cache repo instances per Node.js process. Next.js may HMR-reload this
// module in dev; the cache is fine — repos are stateless.
let leadRepoSingleton: LeadRepo | null = null;
let appointmentRepoSingleton: AppointmentRepo | null = null;

export function getLeadRepo(): LeadRepo {
  if (!leadRepoSingleton) leadRepoSingleton = buildLeadRepo();
  return leadRepoSingleton;
}

export function getAppointmentRepo(): AppointmentRepo {
  if (!appointmentRepoSingleton) {
    appointmentRepoSingleton = buildAppointmentRepo();
  }
  return appointmentRepoSingleton;
}

/** Convenient named exports so consumers can `import { leadRepo } ...`. */
export const leadRepo: LeadRepo = new Proxy({} as LeadRepo, {
  get(_t, prop) {
    return Reflect.get(getLeadRepo() as object, prop);
  },
});

export const appointmentRepo: AppointmentRepo = new Proxy(
  {} as AppointmentRepo,
  {
    get(_t, prop) {
      return Reflect.get(getAppointmentRepo() as object, prop);
    },
  },
);

export type { LeadRepo, AppointmentRepo } from "./types";
export type {
  NewLead,
  NewAppointment,
  LeadFilter,
  AppointmentFilter,
} from "./types";
