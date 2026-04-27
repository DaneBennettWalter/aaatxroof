/**
 * Shared application types.
 */

export type PropertyType = "residential" | "commercial";

export type ServiceType =
  | "residential"
  | "commercial"
  | "storm-damage"
  | "inspection"
  | "insurance-claim"
  | "maintenance";

export type Timeline =
  | "emergency"        // ASAP / emergency
  | "1-2-weeks"
  | "1-3-months"
  | "flexible";

export type BudgetRange =
  | "under-5k"
  | "5k-15k"
  | "15k-30k"
  | "30k-plus"
  | "unsure";

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

/**
 * The canonical Lead record persisted by the intake form API.
 * Optional fields stay optional so the form stays Uber-fast at step 1.
 */
export interface Lead {
  id: string;
  createdAt: string; // ISO timestamp

  // Step 1 — required, immediate value
  name: string;
  phone: string;
  address: string;
  email?: string;

  // Step 2 — property
  propertyType: PropertyType;
  propertyAge?: string;   // e.g. "0-5", "5-15", "15-30", "30+"
  propertySize?: string;  // approx sqft, freeform
  stories?: string;       // "1", "2", "3+"

  // Step 3 — scope
  services: ServiceType[];

  // Step 4 — timeline / budget / notes
  timeline: Timeline;
  budget?: BudgetRange;
  notes?: string;

  status: LeadStatus;

  // Light meta for triage (not PII)
  source?: string;        // e.g. "web-quote-form"
  userAgent?: string;
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  residential: "Residential Roofing",
  commercial: "Commercial Roofing",
  "storm-damage": "Storm Damage Repair",
  inspection: "Roof Inspection",
  "insurance-claim": "Insurance Claim",
  maintenance: "Maintenance",
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  emergency: "Emergency / ASAP",
  "1-2-weeks": "Within 1–2 weeks",
  "1-3-months": "1–3 months",
  flexible: "Flexible / planning ahead",
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  "under-5k": "Under $5,000",
  "5k-15k": "$5,000 – $15,000",
  "15k-30k": "$15,000 – $30,000",
  "30k-plus": "$30,000+",
  unsure: "Not sure yet",
};

// ============================================================================
// Appointments / inspection scheduling
// (See lib/types/appointments.ts for the source of truth.)
// ============================================================================
export type {
  InspectionType,
  AppointmentStatus,
  Appointment,
  CreateAppointmentInput,
  AvailableSlot,
  AvailableDay,
} from "./types/appointments";
export { INSPECTION_TYPES } from "./types/appointments";
