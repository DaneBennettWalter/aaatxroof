import { NextResponse } from "next/server";

import { generateAvailability } from "@/lib/availability";
import { getAppointmentRepo } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/appointments/availability
 *
 * Returns available 1-hour inspection slots for the next 14 days, grouped by
 * day. Already-booked slots and slots in the past are excluded.
 */
export async function GET() {
  try {
    const booked = await getAppointmentRepo().getBookedSlotSet();
    const days = generateAvailability(new Date(), booked);
    return NextResponse.json({ days });
  } catch (err) {
    console.error("[availability] failed", err);
    return NextResponse.json(
      { error: "Failed to load availability." },
      { status: 500 },
    );
  }
}
