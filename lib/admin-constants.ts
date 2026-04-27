/**
 * Client-safe constants for the admin dashboard.
 *
 * Kept separate from `admin-data.ts` so client components can import the
 * status enums without dragging `node:fs` into the browser bundle.
 */

import type { AppointmentStatus, LeadStatus } from "./types";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
];

export type { Lead, LeadStatus, Appointment, AppointmentStatus } from "./types";
