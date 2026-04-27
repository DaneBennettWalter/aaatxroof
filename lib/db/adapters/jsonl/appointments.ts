/**
 * JSONL implementation of `AppointmentRepo`.
 *
 * Storage: data/appointments.jsonl, one JSON object per line.
 * Concurrency: status updates take an exclusive file lock and use atomic
 * tempfile-rename writes; appends serialize through the same lock.
 */

import path from "node:path";
import { randomUUID } from "node:crypto";

import type { Appointment, AppointmentStatus } from "../../../types";
import type {
  AppointmentFilter,
  AppointmentRepo,
  NewAppointment,
} from "../../types";
import {
  DATA_DIR,
  appendJsonl,
  atomicWriteJsonl,
  readJsonl,
  withFileLock,
} from "./shared";

const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.jsonl");

function statusMatches(
  appt: Appointment,
  status: AppointmentFilter["status"],
): boolean {
  if (!status) return true;
  if (Array.isArray(status)) return status.includes(appt.status);
  return appt.status === status;
}

function applyFilter(
  rows: Appointment[],
  filter?: AppointmentFilter,
): Appointment[] {
  if (!filter) return rows;
  return rows.filter((appt) => {
    if (!statusMatches(appt, filter.status)) return false;
    if (
      filter.scheduledAfter &&
      appt.scheduledFor < filter.scheduledAfter
    ) {
      return false;
    }
    if (
      filter.scheduledBefore &&
      appt.scheduledFor >= filter.scheduledBefore
    ) {
      return false;
    }
    return true;
  });
}

export class JsonlAppointmentRepo implements AppointmentRepo {
  async create(input: NewAppointment): Promise<Appointment> {
    const appointment: Appointment = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      scheduledFor: input.scheduledFor,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      address: input.address,
      inspectionType: input.inspectionType,
      notes: input.notes,
      status: "scheduled" satisfies AppointmentStatus,
    };

    await withFileLock(APPOINTMENTS_FILE, async () => {
      await appendJsonl(APPOINTMENTS_FILE, appointment);
    });

    return appointment;
  }

  async list(filter?: AppointmentFilter): Promise<Appointment[]> {
    const rows = await readJsonl<Appointment>(APPOINTMENTS_FILE);
    const filtered = applyFilter(rows, filter);
    return filtered.sort((a, b) =>
      (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
  }

  async get(id: string): Promise<Appointment | null> {
    const rows = await readJsonl<Appointment>(APPOINTMENTS_FILE);
    return rows.find((appt) => appt.id === id) ?? null;
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null> {
    return withFileLock(APPOINTMENTS_FILE, async () => {
      const rows = await readJsonl<Appointment>(APPOINTMENTS_FILE);
      let updated: Appointment | null = null;
      const next = rows.map((appt) => {
        if (appt.id === id) {
          const merged: Appointment = { ...appt, status };
          updated = merged;
          return merged;
        }
        return appt;
      });
      if (!updated) return null;
      await atomicWriteJsonl(APPOINTMENTS_FILE, next);
      return updated;
    });
  }

  async isSlotBooked(scheduledFor: string): Promise<boolean> {
    const rows = await readJsonl<Appointment>(APPOINTMENTS_FILE);
    const canonical = new Date(scheduledFor).toISOString();
    return rows.some(
      (a) => a.status === "scheduled" && a.scheduledFor === canonical,
    );
  }

  async getBookedSlotSet(): Promise<Set<string>> {
    const rows = await readJsonl<Appointment>(APPOINTMENTS_FILE);
    return new Set(
      rows
        .filter((a) => a.status === "scheduled")
        .map((a) => a.scheduledFor),
    );
  }
}
