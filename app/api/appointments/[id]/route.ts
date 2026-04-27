import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  APPOINTMENT_STATUSES,
  type AppointmentStatus,
} from "@/lib/admin-constants";
import { getAppointmentRepo } from "@/lib/db";

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
  if (
    !status ||
    !APPOINTMENT_STATUSES.includes(status as AppointmentStatus)
  ) {
    return NextResponse.json(
      {
        error: `status must be one of: ${APPOINTMENT_STATUSES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const updated = await getAppointmentRepo().updateStatus(
    decodeURIComponent(id),
    status as AppointmentStatus,
  );
  if (!updated) {
    return NextResponse.json(
      { error: "appointment not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ appointment: updated });
}
