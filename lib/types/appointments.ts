/**
 * Appointment / inspection scheduling types.
 *
 * Owned by the scheduling subsystem. Imported via `@/lib/types`.
 */

export type InspectionType =
  | "residential"
  | "commercial"
  | "storm-damage"
  | "insurance";

export const INSPECTION_TYPES: { value: InspectionType; label: string }[] = [
  { value: "residential", label: "Residential Roof Inspection" },
  { value: "commercial", label: "Commercial Roof Inspection" },
  { value: "storm-damage", label: "Storm Damage Assessment" },
  { value: "insurance", label: "Insurance Claim Inspection" },
];

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  createdAt: string; // ISO timestamp
  scheduledFor: string; // ISO timestamp (slot start, 1-hour appointment)
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  inspectionType: InspectionType;
  notes?: string;
  status: AppointmentStatus;
}

/** Payload accepted by POST /api/appointments. */
export interface CreateAppointmentInput {
  scheduledFor: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  inspectionType: InspectionType;
  notes?: string;
}

/** Single available slot returned by the availability API. */
export interface AvailableSlot {
  /** ISO timestamp of slot start. */
  start: string;
  /** Display label e.g. "8:00 AM". */
  label: string;
}

/** Day grouping returned by availability API. */
export interface AvailableDay {
  /** ISO date (YYYY-MM-DD) in business timezone. */
  date: string;
  /** Human label e.g. "Mon, Apr 28". */
  label: string;
  slots: AvailableSlot[];
}
