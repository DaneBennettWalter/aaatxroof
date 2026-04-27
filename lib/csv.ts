import type { Appointment, Lead } from "./admin-constants";

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s =
    typeof value === "string"
      ? value
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  // Stable column order: union of keys, preserving first-seen order.
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }
  const lines: string[] = [headers.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n");
}

export function leadsToCsvRows(leads: Lead[]): Array<Record<string, unknown>> {
  return leads.map((lead) => ({
    id: lead.id,
    createdAt: lead.createdAt,
    status: lead.status,
    name: lead.name ?? "",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    address: lead.address ?? "",
    propertyType: lead.propertyType ?? "",
    services: (lead.services ?? []).join("; "),
    timeline: lead.timeline ?? "",
    budget: lead.budget ?? "",
    source: lead.source ?? "",
    notes: lead.notes ?? "",
  }));
}

export function appointmentsToCsvRows(
  appointments: Appointment[],
): Array<Record<string, unknown>> {
  return appointments.map((a) => ({
    id: a.id,
    createdAt: a.createdAt,
    scheduledFor: a.scheduledFor ?? "",
    status: a.status,
    customerName: a.customerName ?? "",
    customerPhone: a.customerPhone ?? "",
    customerEmail: a.customerEmail ?? "",
    address: a.address ?? "",
    inspectionType: a.inspectionType ?? "",
    notes: a.notes ?? "",
  }));
}

export function downloadCsv(
  filename: string,
  rows: Array<Record<string, unknown>>,
): void {
  const csv = rowsToCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
