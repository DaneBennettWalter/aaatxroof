/**
 * Drizzle schema definitions for the (future) Postgres backend.
 *
 * These types mirror the application-level `Lead` and `Appointment`
 * interfaces in `lib/types.ts`. They're not used by the JSONL adapter; the
 * Postgres adapter will use them once `DATABASE_URL` is configured and
 * migrations have been applied via `drizzle-kit`.
 *
 * To generate/apply migrations:
 *   npx drizzle-kit generate
 *   npx drizzle-kit migrate
 *
 * See `docs/DATABASE.md` for the full migration playbook.
 */

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "completed",
  "cancelled",
]);

export const propertyTypeEnum = pgEnum("property_type", [
  "residential",
  "commercial",
]);

export const timelineEnum = pgEnum("timeline", [
  "emergency",
  "1-2-weeks",
  "1-3-months",
  "flexible",
]);

export const budgetEnum = pgEnum("budget_range", [
  "under-5k",
  "5k-15k",
  "15k-30k",
  "30k-plus",
  "unsure",
]);

export const inspectionTypeEnum = pgEnum("inspection_type", [
  "residential",
  "commercial",
  "storm-damage",
  "insurance",
]);

// ---------- Tables ----------

export const leads = pgTable(
  "leads",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    name: varchar("name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    address: varchar("address", { length: 300 }).notNull(),
    email: varchar("email", { length: 200 }),
    propertyType: propertyTypeEnum("property_type").notNull(),
    propertyAge: varchar("property_age", { length: 40 }),
    propertySize: varchar("property_size", { length: 40 }),
    stories: varchar("stories", { length: 10 }),
    /** Multiple ServiceType values; serialized as JSON array. */
    services: jsonb("services").$type<string[]>().notNull(),
    timeline: timelineEnum("timeline").notNull(),
    budget: budgetEnum("budget"),
    notes: text("notes"),
    status: leadStatusEnum("status").notNull().default("new"),
    source: varchar("source", { length: 80 }),
    userAgent: text("user_agent"),
  },
  (table) => ({
    statusIdx: index("leads_status_idx").on(table.status),
    createdAtIdx: index("leads_created_at_idx").on(table.createdAt),
  }),
);

export const appointments = pgTable(
  "appointments",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** 1-hour slot start. Canonical ISO string in app code. */
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
    customerName: varchar("customer_name", { length: 120 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
    customerEmail: varchar("customer_email", { length: 200 }).notNull(),
    address: varchar("address", { length: 300 }).notNull(),
    inspectionType: inspectionTypeEnum("inspection_type").notNull(),
    notes: text("notes"),
    status: appointmentStatusEnum("status").notNull().default("scheduled"),
  },
  (table) => ({
    /**
     * One ACTIVE appointment per slot — enforced by partial unique index.
     * `drizzle-kit` doesn't model partial-unique directly yet; declare it in
     * a manual migration (see docs/DATABASE.md). Index below speeds up
     * availability lookups.
     */
    scheduledForIdx: index("appointments_scheduled_for_idx").on(
      table.scheduledFor,
    ),
    statusIdx: index("appointments_status_idx").on(table.status),
  }),
);

export type LeadRow = typeof leads.$inferSelect;
export type NewLeadRow = typeof leads.$inferInsert;
export type AppointmentRow = typeof appointments.$inferSelect;
export type NewAppointmentRow = typeof appointments.$inferInsert;
