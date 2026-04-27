import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readAppointments } from "@/lib/admin-data";
import { INSPECTION_TYPES } from "@/lib/types";
import { AppointmentStatusControl } from "./status-control";

export const dynamic = "force-dynamic";

const inspectionLabel = Object.fromEntries(
  INSPECTION_TYPES.map((t) => [t.value, t.label]),
);

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointments = await readAppointments();
  const appt = appointments.find((a) => a.id === decodeURIComponent(id));
  if (!appt) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/appointments"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to appointments
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">
            {appt.customerName || appt.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            Scheduled for {formatDate(appt.scheduledFor)} · created{" "}
            {formatDate(appt.createdAt)}
          </p>
        </div>
        <AppointmentStatusControl id={appt.id} initialStatus={appt.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Name" value={appt.customerName} />
            <Row label="Phone" value={appt.customerPhone} />
            <Row label="Email" value={appt.customerEmail} />
            <Row label="Address" value={appt.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row
              label="Inspection"
              value={
                inspectionLabel[appt.inspectionType] ?? appt.inspectionType
              }
            />
            <Row label="Appointment ID" value={appt.id} />
            {appt.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap">{appt.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: unknown }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="col-span-2 break-words">
        {value ? String(value) : <span className="text-muted-foreground">—</span>}
      </dd>
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
