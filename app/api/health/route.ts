import { NextResponse } from "next/server";
import { getAppointmentRepo } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint - verifies database connectivity
 */
export async function GET() {
  try {
    // Simple query to test DB connection
    const slots = await getAppointmentRepo().getBookedSlotSet();
    return NextResponse.json({ 
      status: "ok", 
      database: "connected",
      bookedSlots: slots.size,
    });
  } catch (err: any) {
    console.error("[health] Database connection failed:", err);
    return NextResponse.json(
      { 
        status: "error", 
        database: "failed",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
