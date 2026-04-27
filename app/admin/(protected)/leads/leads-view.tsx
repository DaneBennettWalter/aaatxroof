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
  LEAD_STATUSES,
  type Lead,
  type LeadStatus,
} from "@/lib/admin-constants";
import { SERVICE_LABELS } from "@/lib/types";
import { downloadCsv, leadsToCsvRows } from "@/lib/csv";

type StatusFilter = "all" | LeadStatus;

export function LeadsView({ leads }: { leads: Lead[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const fromMs = from ? new Date(from + "T00:00:00").getTime() : -Infinity;
    const toMs = to ? new Date(to + "T23:59:59").getTime() : Infinity;
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      const t = Date.parse(lead.createdAt);
      if (!Number.isNaN(t)) {
        if (t < fromMs || t > toMs) return false;
      }
      if (q) {
        const haystack = [
          lead.name,
          lead.phone,
          lead.email,
          lead.address,
          lead.notes,
          (lead.services ?? []).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [leads, statusFilter, from, to, query]);

  const exportCsv = () => {
    const rows = leadsToCsvRows(filtered);
    downloadCsv(`leads-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {leads.length} shown
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
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
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
            placeholder="Name, phone, email, address…"
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
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Address</TableHead>
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
                  {leads.length === 0
                    ? "No leads captured yet."
                    : "No leads match these filters."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer"
                  onClick={() => {
                    window.location.href = `/admin/leads/${encodeURIComponent(lead.id)}`;
                  }}
                >
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/leads/${encodeURIComponent(lead.id)}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lead.name || "—"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {lead.phone || lead.email || "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {servicesSummary(lead.services)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {lead.address || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {lead.status}
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

function servicesSummary(services?: string[]): string {
  if (!services || services.length === 0) return "—";
  return services
    .map((s) => SERVICE_LABELS[s as keyof typeof SERVICE_LABELS] ?? s)
    .join(", ");
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
