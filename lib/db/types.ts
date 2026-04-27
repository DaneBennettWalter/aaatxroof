/**
 * Repository interfaces for the data layer.
 *
 * The application code depends ONLY on these interfaces, not on a specific
 * storage backend. Adapters (JSONL, Postgres) implement them.
 *
 * To swap storage:
 *   - JSONL (default): no env vars
 *   - Postgres: set DATABASE_URL
 *
 * See `lib/db/index.ts` for adapter selection.
 */

import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  Lead,
  LeadStatus,
} from "../types";

// ---------- Leads ----------

/** Input accepted by LeadRepo.create. Persistence layer fills id/createdAt/status. */
export interface NewLead {
  name: string;
  phone: string;
  email?: string;
  address: string;

  propertyType: Lead["propertyType"];
  propertyAge?: string;
  propertySize?: string;
  stories?: string;

  services: Lead["services"];

  timeline: Lead["timeline"];
  budget?: Lead["budget"];
  notes?: string;

  source?: string;
  userAgent?: string;
}

/** Optional filter for list/count operations. */
export interface LeadFilter {
  status?: LeadStatus | LeadStatus[];
  /** ISO timestamp lower bound, inclusive. */
  createdAfter?: string;
  /** ISO timestamp upper bound, exclusive. */
  createdBefore?: string;
}

export interface LeadRepo {
  create(input: NewLead): Promise<Lead>;
  list(filter?: LeadFilter): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead | null>;
  count(filter?: LeadFilter): Promise<number>;
}

// ---------- Appointments ----------

/** Input accepted by AppointmentRepo.create. */
export type NewAppointment = CreateAppointmentInput;

export interface AppointmentFilter {
  status?: AppointmentStatus | AppointmentStatus[];
  /** Only include appointments scheduled at or after this ISO timestamp. */
  scheduledAfter?: string;
  /** Only include appointments scheduled before this ISO timestamp. */
  scheduledBefore?: string;
}

export interface AppointmentRepo {
  create(input: NewAppointment): Promise<Appointment>;
  list(filter?: AppointmentFilter): Promise<Appointment[]>;
  get(id: string): Promise<Appointment | null>;
  updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null>;
  /**
   * True if a `scheduled` (active) appointment already exists at the given
   * ISO timestamp. Used to enforce single-booking-per-slot.
   */
  isSlotBooked(scheduledFor: string): Promise<boolean>;
  /** Set of ISO timestamps that are currently booked (status=scheduled). */
  getBookedSlotSet(): Promise<Set<string>>;
}
