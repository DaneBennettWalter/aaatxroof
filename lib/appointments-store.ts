/**
 * Backwards-compatible facade over the appointment repository.
 *
 * New code should use `getAppointmentRepo()` from `@/lib/db` directly. This
 * module keeps the original `createAppointment` / `getBookedSlotSet` /
 * `readAppointments` exports so existing routes stay untouched.
 */

import type { Appointment, CreateAppointmentInput } from "./types";
import { getAppointmentRepo } from "./db";

export async function readAppointments(): Promise<Appointment[]> {
  return getAppointmentRepo().list();
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<Appointment> {
  return getAppointmentRepo().create(input);
}

export async function getBookedSlotSet(): Promise<Set<string>> {
  return getAppointmentRepo().getBookedSlotSet();
}
