import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getLeadRepo } from "@/lib/db";

// Lead intake API.
// Storage is abstracted behind the LeadRepo interface (lib/db). Default
// adapter writes JSONL with file locking; setting DATABASE_URL switches
// to the Postgres adapter without touching this route.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const propertyTypeSchema = z.enum(["residential", "commercial"]);

const serviceSchema = z.enum([
  "residential",
  "commercial",
  "storm-damage",
  "inspection",
  "insurance-claim",
  "maintenance",
]);

const timelineSchema = z.enum([
  "emergency",
  "1-2-weeks",
  "1-3-months",
  "flexible",
]);

const budgetSchema = z.enum([
  "under-5k",
  "5k-15k",
  "15k-30k",
  "30k-plus",
  "unsure",
]);

// Strict server-side validation. Mirrors (and is stricter than) the client schema.
const leadInputSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Phone is required")
    .max(40)
    .regex(/^[0-9+()\-.\s]+$/, "Invalid phone number"),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  address: z.string().trim().min(5, "Address is required").max(300),

  propertyType: propertyTypeSchema,
  propertyAge: z.string().trim().max(40).optional(),
  propertySize: z.string().trim().max(40).optional(),
  stories: z.string().trim().max(10).optional(),

  services: z.array(serviceSchema).min(1, "Select at least one service"),

  timeline: timelineSchema,
  budget: budgetSchema.optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const lead = await getLeadRepo().create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      propertyType: data.propertyType,
      propertyAge: data.propertyAge || undefined,
      propertySize: data.propertySize || undefined,
      stories: data.stories || undefined,
      services: data.services,
      timeline: data.timeline,
      budget: data.budget,
      notes: data.notes || undefined,
      source: "web-quote-form",
      userAgent: req.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[leads] failed to persist lead", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save lead" },
      { status: 500 },
    );
  }
}
