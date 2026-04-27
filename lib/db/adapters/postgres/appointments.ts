/**
 * Postgres implementation of `AppointmentRepo`.
 */

import { randomUUID } from "node:crypto";
import { eq, and, gte, lte, desc } from "drizzle-orm";
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
      conditions.push(eq(appointments.status, filter.status));
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
      .limit(filter?.limit ?? 100);

    return rows.map(rowToAppointment);
  }

  async getById(id: string): Promise<Appointment | null> {
    const db = getDb();
    const [row] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return row ? rowToAppointment(row) : null;
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    const db = getDb();
    await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id));
  }

  async isSlotAvailable(
    scheduledFor: string,
    excludeId?: string,
  ): Promise<boolean> {
    const db = getDb();
    const conditions = [
      eq(appointments.scheduledFor, new Date(scheduledFor)),
      eq(appointments.status, "scheduled"),
    ];

    if (excludeId) {
      conditions.push(eq(appointments.id, excludeId));
    }

    const [row] = await db
      .select()
      .from(appointments)
      .where(and(...conditions));

    return !row;
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
