/**
 * Postgres implementation of `AppointmentRepo` (stub).
 *
 * All methods throw until `DATABASE_URL` is configured and migrations have
 * been applied. The slot-uniqueness contract should be enforced at the DB
 * level via a partial unique index:
 *
 *   CREATE UNIQUE INDEX appointments_active_slot_uq
 *     ON appointments (scheduled_for)
 *     WHERE status = 'scheduled';
 *
 * That index is documented in `docs/DATABASE.md` because drizzle-kit
 * doesn't model partial-unique indexes natively yet.
 */

import type { Appointment, AppointmentStatus } from "../../../types";
import type {
  AppointmentFilter,
  AppointmentRepo,
  NewAppointment,
} from "../../types";

const NOT_CONFIGURED =
  "Postgres adapter not configured. Set DATABASE_URL and follow docs/DATABASE.md.";

export class PostgresAppointmentRepo implements AppointmentRepo {
  async create(_input: NewAppointment): Promise<Appointment> {
    // const db = getDb();
    // const id = randomUUID();
    // const [row] = await db
    //   .insert(schema.appointments)
    //   .values({ id, status: "scheduled", ...input,
    //     scheduledFor: new Date(input.scheduledFor) })
    //   .returning();
    // return rowToAppointment(row);
    throw new Error(NOT_CONFIGURED);
  }

  async list(_filter?: AppointmentFilter): Promise<Appointment[]> {
    throw new Error(NOT_CONFIGURED);
  }

  async get(_id: string): Promise<Appointment | null> {
    throw new Error(NOT_CONFIGURED);
  }

  async updateStatus(
    _id: string,
    _status: AppointmentStatus,
  ): Promise<Appointment | null> {
    throw new Error(NOT_CONFIGURED);
  }

  async isSlotBooked(_scheduledFor: string): Promise<boolean> {
    // const db = getDb();
    // const rows = await db
    //   .select({ id: schema.appointments.id })
    //   .from(schema.appointments)
    //   .where(and(
    //     eq(schema.appointments.status, "scheduled"),
    //     eq(schema.appointments.scheduledFor, new Date(scheduledFor)),
    //   ))
    //   .limit(1);
    // return rows.length > 0;
    throw new Error(NOT_CONFIGURED);
  }

  async getBookedSlotSet(): Promise<Set<string>> {
    // const db = getDb();
    // const rows = await db
    //   .select({ scheduledFor: schema.appointments.scheduledFor })
    //   .from(schema.appointments)
    //   .where(eq(schema.appointments.status, "scheduled"));
    // return new Set(rows.map((r) => r.scheduledFor.toISOString()));
    throw new Error(NOT_CONFIGURED);
  }
}
