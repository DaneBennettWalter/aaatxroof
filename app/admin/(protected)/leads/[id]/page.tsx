import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readLeads } from "@/lib/admin-data";
import {
  BUDGET_LABELS,
  SERVICE_LABELS,
  TIMELINE_LABELS,
  type BudgetRange,
  type ServiceType,
  type Timeline,
} from "@/lib/types";
import { LeadStatusControl } from "./status-control";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leads = await readLeads();
  const lead = leads.find((l) => l.id === decodeURIComponent(id));
  if (!lead) notFound();

  const services = (lead.services ?? [])
    .map((s) => SERVICE_LABELS[s as ServiceType] ?? s)
    .join(", ");
  const timeline = lead.timeline
    ? (TIMELINE_LABELS[lead.timeline as Timeline] ?? lead.timeline)
    : "—";
  const budget = lead.budget
    ? (BUDGET_LABELS[lead.budget as BudgetRange] ?? lead.budget)
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/leads"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to leads
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">
            {lead.name || lead.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            Captured {formatDate(lead.createdAt)} · {lead.source || "no source"}
          </p>
        </div>
        <LeadStatusControl id={lead.id} initialStatus={lead.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Name" value={lead.name} />
            <Row label="Phone" value={lead.phone} />
            <Row label="Email" value={lead.email} />
            <Row label="Address" value={lead.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Type" value={lead.propertyType} capitalize />
            <Row label="Age" value={lead.propertyAge} />
            <Row label="Size" value={lead.propertySize} />
            <Row label="Stories" value={lead.stories} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Services" value={services || "—"} />
            <Row label="Timeline" value={timeline} />
            <Row label="Budget" value={budget} />
            <Row label="Source" value={lead.source} />
            <Row label="Lead ID" value={lead.id} />
            {lead.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  capitalize,
}: {
  label: string;
  value?: unknown;
  capitalize?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={`col-span-2 break-words${capitalize ? " capitalize" : ""}`}
      >
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
