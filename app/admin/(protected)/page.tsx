import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  computeStats,
  readAppointments,
  readLeads,
} from "@/lib/admin-data";
import { INSPECTION_TYPES, SERVICE_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

const inspectionLabel = Object.fromEntries(
  INSPECTION_TYPES.map((t) => [t.value, t.label]),
);

export default async function AdminOverviewPage() {
  const [leads, appointments] = await Promise.all([
    readLeads(),
    readAppointments(),
  ]);
  const stats = computeStats(leads, appointments);

  const recentLeads = leads.slice(0, 5);
  const upcoming = appointments
    .filter((a) => a.status === "scheduled")
    .filter((a) => {
      const t = Date.parse(a.scheduledFor);
      return !Number.isNaN(t) && t >= Date.now();
    })
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Captured leads and appointments across the site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads this week" value={stats.leadsThisWeek} />
        <StatCard label="Leads this month" value={stats.leadsThisMonth} />
        <StatCard
          label="Conversion rate"
          value={`${(stats.conversionRate * 100).toFixed(1)}%`}
          hint={`${stats.wonLeads} won / ${stats.totalLeads} total`}
        />
        <StatCard
          label="Upcoming appointments"
          value={stats.upcomingAppointments}
          hint={`${stats.totalAppointments} all-time`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent leads</CardTitle>
            <Link
              href="/admin/leads"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <EmptyRow message="No leads yet. They'll appear here as the intake form captures them." />
            ) : (
              <ul className="divide-y">
                {recentLeads.map((lead) => (
                  <li
                    key={lead.id}
                    className="flex items-center justify-between gap-3 px-6 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/leads/${encodeURIComponent(lead.id)}`}
                        className="block truncate font-medium hover:underline"
                      >
                        {lead.name || lead.phone || lead.email || lead.id}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {leadServicesSummary(lead.services) || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {lead.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatShortDate(lead.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming appointments</CardTitle>
            <Link
              href="/admin/appointments"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {upcoming.length === 0 ? (
              <EmptyRow message="No upcoming appointments scheduled." />
            ) : (
              <ul className="divide-y">
                {upcoming.map((appt) => (
                  <li
                    key={appt.id}
                    className="flex items-center justify-between gap-3 px-6 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/appointments/${encodeURIComponent(appt.id)}`}
                        className="block truncate font-medium hover:underline"
                      >
                        {appt.customerName || appt.customerPhone || appt.id}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {inspectionLabel[appt.inspectionType] ??
                          appt.inspectionType ??
                          "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {formatLongDate(appt.scheduledFor)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {appt.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function leadServicesSummary(services?: string[]): string {
  if (!services || services.length === 0) return "";
  return services
    .map((s) => SERVICE_LABELS[s as keyof typeof SERVICE_LABELS] ?? s)
    .join(", ");
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
        {hint && (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <p className="px-6 py-8 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

function formatShortDate(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatLongDate(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
