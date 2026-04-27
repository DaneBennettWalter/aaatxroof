import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/admin-constants";
import { getLeadRepo } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const status = (body as { status?: string } | null)?.status;
  if (!status || !LEAD_STATUSES.includes(status as LeadStatus)) {
    return NextResponse.json(
      {
        error: `status must be one of: ${LEAD_STATUSES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const updated = await getLeadRepo().updateStatus(
    decodeURIComponent(id),
    status as LeadStatus,
  );
  if (!updated) {
    return NextResponse.json({ error: "lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead: updated });
}
