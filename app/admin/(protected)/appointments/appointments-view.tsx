"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  APPOINTMENT_STATUSES,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/admin-constants";
import { INSPECTION_TYPES } from "@/lib/types";
import { appointmentsToCsvRows, downloadCsv } from "@/lib/csv";

type StatusFilter = "all" | AppointmentStatus;
type DateField = "scheduledFor" | "createdAt";

const inspectionLabel = Object.fromEntries(
  INSPECTION_TYPES.map((t) => [t.value, t.label]),
);

export function AppointmentsView({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateField, setDateField] = useState<DateField>("scheduledFor");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const fromMs = from ? new Date(from + "T00:00:00").getTime() : -Infinity;
    const toMs = to ? new Date(to + "T23:59:59").getTime() : Infinity;
    const q = query.trim().toLowerCase();

    const items = appointments.filter((appt) => {
      if (statusFilter !== "all" && appt.status !== statusFilter) return false;
      const target = dateField === "scheduledFor" ? appt.scheduledFor : appt.createdAt;
      if (target) {
        const t = Date.parse(target);
        if (!Number.isNaN(t)) {
          if (t < fromMs || t > toMs) return false;
        }
      } else if (from || to) {
        return false;
      }
      if (q) {
        const haystack = [
          appt.customerName,
          appt.customerPhone,
          appt.customerEmail,
          appt.address,
          appt.inspectionType,
          appt.notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...items].sort((a, b) => {
      const av = (dateField === "scheduledFor" ? a.scheduledFor : a.createdAt) ?? "";
      const bv = (dateField === "scheduledFor" ? b.scheduledFor : b.createdAt) ?? "";
      // Soonest first when sorting by scheduledFor; newest first by createdAt.
      return dateField === "scheduledFor" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [appointments, statusFilter, dateField, from, to, query]);

  const exportCsv = () => {
    const rows = appointmentsToCsvRows(filtered);
    downloadCsv(`appointments-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {appointments.length} shown
          </p>
        </div>
        <Button onClick={exportCsv} variant="outline">
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-background p-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(v) => v && setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPOINTMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Date field</label>
          <Select
            value={dateField}
            onValueChange={(v) => v && setDateField(v as DateField)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduledFor">Scheduled for</SelectItem>
              <SelectItem value="createdAt">Created at</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">From</label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">To</label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-[160px]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Search</label>
          <Input
            placeholder="Name, phone, email, notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {(statusFilter !== "all" || from || to || query) && (
          <Button
            variant="ghost"
            onClick={() => {
              setStatusFilter("all");
              setFrom("");
              setTo("");
              setQuery("");
            }}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scheduled</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Inspection</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  {appointments.length === 0
                    ? "No appointments captured yet."
                    : "No appointments match these filters."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((appt) => (
                <TableRow
                  key={appt.id}
                  className="cursor-pointer"
                  onClick={() => {
                    window.location.href = `/admin/appointments/${encodeURIComponent(appt.id)}`;
                  }}
                >
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDate(appt.scheduledFor)}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/appointments/${encodeURIComponent(appt.id)}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {appt.customerName || "—"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {appt.customerPhone || appt.customerEmail || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {inspectionLabel[appt.inspectionType] ??
                      appt.inspectionType ??
                      "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(appt.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {appt.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
