/**
 * Postgres implementation of `LeadRepo`.
 */

import { randomUUID } from "node:crypto";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import type { Lead, LeadStatus } from "../../../types";
import type { LeadFilter, LeadRepo, NewLead } from "../../types";
import { getDb } from "./client";
import { leads } from "../../schema";

export class PostgresLeadRepo implements LeadRepo {
  async create(input: NewLead): Promise<Lead> {
    const db = getDb();
    const id = randomUUID();
    const [row] = await db
      .insert(leads)
      .values({
        id,
        status: "new",
        ...input,
        createdAt: new Date(),
      })
      .returning();
    return rowToLead(row);
  }

  async list(filter?: LeadFilter): Promise<Lead[]> {
    const db = getDb();
    const conditions = [];

    if (filter?.status) {
      conditions.push(eq(leads.status, filter.status));
    }
    if (filter?.createdAfter) {
      conditions.push(gte(leads.createdAt, new Date(filter.createdAfter)));
    }
    if (filter?.createdBefore) {
      conditions.push(lte(leads.createdAt, new Date(filter.createdBefore)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const rows = await db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(filter?.limit ?? 100);

    return rows.map(rowToLead);
  }

  async getById(id: string): Promise<Lead | null> {
    const db = getDb();
    const [row] = await db.select().from(leads).where(eq(leads.id, id));
    return row ? rowToLead(row) : null;
  }

  async updateStatus(id: string, status: LeadStatus): Promise<void> {
    const db = getDb();
    await db.update(leads).set({ status }).where(eq(leads.id, id));
  }
}

function rowToLead(row: typeof leads.$inferSelect): Lead {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    name: row.name,
    phone: row.phone,
    address: row.address,
    email: row.email ?? undefined,
    propertyType: row.propertyType,
    propertyAge: row.propertyAge ?? undefined,
    propertySize: row.propertySize ?? undefined,
    stories: row.stories ?? undefined,
    services: row.services as string[],
    timeline: row.timeline,
    budget: row.budget ?? undefined,
    notes: row.notes ?? undefined,
    status: row.status,
    source: row.source ?? undefined,
    userAgent: row.userAgent ?? undefined,
  };
}
