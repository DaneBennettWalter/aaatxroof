/**
 * Postgres implementation of `LeadRepo`.
 */

import { randomUUID } from "node:crypto";
import { eq, and, gte, lte, desc, sql, inArray } from "drizzle-orm";
import type { Lead, LeadStatus, ServiceType } from "../../../types";
import type { LeadFilter, LeadRepo, NewLead } from "../../types";
import { getDb } from "./client";
import { leads } from "../../schema";

export class PostgresLeadRepo implements LeadRepo {
  async create(input: NewLead): Promise<Lead> {
    const db = await getDb();
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
    const db = await getDb();
    const conditions = [];

    if (filter?.status) {
      if (Array.isArray(filter.status)) {
        conditions.push(inArray(leads.status, filter.status));
      } else {
        conditions.push(eq(leads.status, filter.status));
      }
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
      .limit(100);

    return rows.map(rowToLead);
  }

  async get(id: string): Promise<Lead | null> {
    const db = await getDb();
    const [row] = await db.select().from(leads).where(eq(leads.id, id));
    return row ? rowToLead(row) : null;
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead | null> {
    const db = await getDb();
    const [row] = await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, id))
      .returning();
    return row ? rowToLead(row) : null;
  }

  async count(filter?: LeadFilter): Promise<number> {
    const db = await getDb();
    const conditions = [];

    if (filter?.status) {
      if (Array.isArray(filter.status)) {
        conditions.push(inArray(leads.status, filter.status));
      } else {
        conditions.push(eq(leads.status, filter.status));
      }
    }
    if (filter?.createdAfter) {
      conditions.push(gte(leads.createdAt, new Date(filter.createdAfter)));
    }
    if (filter?.createdBefore) {
      conditions.push(lte(leads.createdAt, new Date(filter.createdBefore)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(where);

    return result?.count ?? 0;
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
    services: row.services as ServiceType[],
    timeline: row.timeline,
    budget: row.budget ?? undefined,
    notes: row.notes ?? undefined,
    status: row.status,
    source: row.source ?? undefined,
    userAgent: row.userAgent ?? undefined,
  };
}
