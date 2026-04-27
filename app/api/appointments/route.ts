import { NextResponse } from "next/server";
import { z } from "zod";

import { isValidSlotInstant } from "@/lib/availability";
import { getAppointmentRepo } from "@/lib/db";

export const dynamic = "force-dynamic";

const PHONE_RE = /^[\d\s().+\-]{7,}$/;

const createSchema = z.object({
  scheduledFor: z
    .string()
    .min(1, "Please choose a time slot.")
    .refine((s) => !Number.isNaN(new Date(s).getTime()), {
      message: "Invalid scheduled time.",
    }),
  customerName: z.string().trim().min(2, "Name is required."),
  customerPhone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Please enter a valid phone number."),
  customerEmail: z.string().trim().email("Please enter a valid email."),
  address: z.string().trim().min(5, "Address is required."),
  inspectionType: z.enum([
    "residential",
    "commercial",
    "storm-damage",
    "insurance",
  ]),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes are too long.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

/**
 * POST /api/appointments
 *
 * Creates a new inspection appointment. Validates that the requested slot is:
 *   1. A real business-hours slot (not past, not Sunday, etc.)
 *   2. Not already booked by someone else.
 *
 * Storage is abstracted behind AppointmentRepo (lib/db).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const now = new Date();

  if (!isValidSlotInstant(input.scheduledFor, now)) {
    return NextResponse.json(
      {
        error:
          "That time isn't available. Please pick another slot from the calendar.",
      },
      { status: 400 },
    );
  }

  // Normalize to canonical ISO string for comparison.
  const canonical = new Date(input.scheduledFor).toISOString();
  const repo = getAppointmentRepo();

  if (await repo.isSlotBooked(canonical)) {
    return NextResponse.json(
      {
        error:
          "That slot was just booked by someone else. Please pick another.",
      },
      { status: 409 },
    );
  }

  try {
    const appointment = await repo.create({
      ...input,
      scheduledFor: canonical,
    });
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err) {
    console.error("[appointments] create failed", err);
    return NextResponse.json(
      { error: "Failed to save appointment. Please try again." },
      { status: 500 },
    );
  }
}
