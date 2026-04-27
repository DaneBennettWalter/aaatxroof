/**
 * Postgres implementation of `AppointmentRepo`.
 */

import { randomUUID } from "node:crypto";
import { eq, and, gte, lte, desc, inArray } from "drizzle-orm";
import type { Appointment, AppointmentStatus } from "@/lib/types/appointments";
import type {
  AppointmentFilter,
  AppointmentRepo,
  NewAppointment,
} from "../../types";
import { getDb } from "./client";
import { appointments } from "../../schema";

export class PostgresAppointmentRepo implements AppointmentRepo {
  async create(input: NewAppointment): Promise<Appointment> {
    const db = getDb();
    const id = randomUUID();
    const [row] = await db
      .insert(appointments)
      .values({
        id,
        status: "scheduled",
        ...input,
        scheduledFor: new Date(input.scheduledFor),
        createdAt: new Date(),
      })
      .returning();
    return rowToAppointment(row);
  }

  async list(filter?: AppointmentFilter): Promise<Appointment[]> {
    const db = getDb();
    const conditions = [];

    if (filter?.status) {
      if (Array.isArray(filter.status)) {
        conditions.push(inArray(appointments.status, filter.status));
      } else {
        conditions.push(eq(appointments.status, filter.status));
      }
    }
    if (filter?.scheduledAfter) {
      conditions.push(
        gte(appointments.scheduledFor, new Date(filter.scheduledAfter)),
      );
    }
    if (filter?.scheduledBefore) {
      conditions.push(
        lte(appointments.scheduledFor, new Date(filter.scheduledBefore)),
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const rows = await db
      .select()
      .from(appointments)
      .where(where)
      .orderBy(desc(appointments.scheduledFor))
      .limit(100);

    return rows.map(rowToAppointment);
  }

  async get(id: string): Promise<Appointment | null> {
    const db = getDb();
    const [row] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return row ? rowToAppointment(row) : null;
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null> {
    const db = getDb();
    const [row] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return row ? rowToAppointment(row) : null;
  }

  async isSlotBooked(scheduledFor: string): Promise<boolean> {
    const db = getDb();
    const [row] = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.scheduledFor, new Date(scheduledFor)),
          eq(appointments.status, "scheduled"),
        ),
      )
      .limit(1);

    return !!row;
  }

  async getBookedSlotSet(): Promise<Set<string>> {
    const db = getDb();
    const rows = await db
      .select({ scheduledFor: appointments.scheduledFor })
      .from(appointments)
      .where(eq(appointments.status, "scheduled"));

    return new Set(rows.map((row) => row.scheduledFor.toISOString()));
  }
}

function rowToAppointment(
  row: typeof appointments.$inferSelect,
): Appointment {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    scheduledFor: row.scheduledFor.toISOString(),
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail,
    address: row.address,
    inspectionType: row.inspectionType,
    notes: row.notes ?? undefined,
    status: row.status,
  };
}
