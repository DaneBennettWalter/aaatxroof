import type {
  Appointment,
  AppointmentStatus,
  Lead,
  LeadStatus,
} from "./types";
import { getAppointmentRepo, getLeadRepo } from "./db";

export { LEAD_STATUSES, APPOINTMENT_STATUSES } from "./admin-constants";
export type { Lead, LeadStatus, Appointment, AppointmentStatus };

/**
 * Server-side data access for the /admin dashboard.
 *
 * This module is a thin compatibility shim over the repository layer in
 * `lib/db`. Admin pages keep importing `readLeads`, `updateLeadStatus`,
 * etc.; they don't need to know whether the bytes live in JSONL or
 * Postgres. Re-reads happen on every request — no caching — so newly
 * captured records appear immediately.
 */

export async function readLeads(): Promise<Lead[]> {
  // Repos return newest-first.
  return getLeadRepo().list();
}

export async function readAppointments(): Promise<Appointment[]> {
  return getAppointmentRepo().list();
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  return getLeadRepo().updateStatus(id, status);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment | null> {
  return getAppointmentRepo().updateStatus(id, status);
}

// ---------- Stats ----------

export interface DashboardStats {
  totalLeads: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  wonLeads: number;
  conversionRate: number; // 0..1
  upcomingAppointments: number;
  totalAppointments: number;
}

function startOfWeek(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  // Treat Monday as start of week.
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ...
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(now: Date): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(1);
  return d;
}

export function computeStats(
  leads: Lead[],
  appointments: Appointment[],
  now: Date = new Date(),
): DashboardStats {
  const weekStart = startOfWeek(now).getTime();
  const monthStart = startOfMonth(now).getTime();
  const nowMs = now.getTime();

  let leadsThisWeek = 0;
  let leadsThisMonth = 0;
  let wonLeads = 0;

  for (const lead of leads) {
    const t = Date.parse(lead.createdAt);
    if (!Number.isNaN(t)) {
      if (t >= weekStart) leadsThisWeek++;
      if (t >= monthStart) leadsThisMonth++;
    }
    if (lead.status === "won") wonLeads++;
  }

  let upcomingAppointments = 0;
  for (const appt of appointments) {
    if (appt.status !== "scheduled") continue;
    const t = Date.parse(appt.scheduledFor);
    if (!Number.isNaN(t) && t >= nowMs) {
      upcomingAppointments++;
    }
  }

  const conversionRate = leads.length > 0 ? wonLeads / leads.length : 0;

  return {
    totalLeads: leads.length,
    leadsThisWeek,
    leadsThisMonth,
    wonLeads,
    conversionRate,
    upcomingAppointments,
    totalAppointments: appointments.length,
  };
}
