/**
 * Postgres implementation of `LeadRepo` (stub).
 *
 * All methods throw until `DATABASE_URL` is configured and migrations have
 * been applied. The shape of the queries we'll write is sketched in the
 * comments below so wiring this up is a fill-in-the-blanks job.
 */

import type { Lead, LeadStatus } from "../../../types";
import type { LeadFilter, LeadRepo, NewLead } from "../../types";

const NOT_CONFIGURED =
  "Postgres adapter not configured. Set DATABASE_URL and follow docs/DATABASE.md.";

export class PostgresLeadRepo implements LeadRepo {
  async create(_input: NewLead): Promise<Lead> {
    // const db = getDb();
    // const id = randomUUID();
    // const [row] = await db
    //   .insert(schema.leads)
    //   .values({ id, status: "new", ...input, services: input.services })
    //   .returning();
    // return rowToLead(row);
    throw new Error(NOT_CONFIGURED);
  }

  async list(_filter?: LeadFilter): Promise<Lead[]> {
    // const db = getDb();
    // const where = buildLeadWhere(filter);
    // const rows = await db.select().from(schema.leads).where(where).orderBy(desc(schema.leads.createdAt));
    // return rows.map(rowToLead);
    throw new Error(NOT_CONFIGURED);
  }

  async get(_id: string): Promise<Lead | null> {
    // const db = getDb();
    // const rows = await db.select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1);
    // return rows[0] ? rowToLead(rows[0]) : null;
    throw new Error(NOT_CONFIGURED);
  }

  async updateStatus(
    _id: string,
    _status: LeadStatus,
  ): Promise<Lead | null> {
    // const db = getDb();
    // const [row] = await db
    //   .update(schema.leads)
    //   .set({ status })
    //   .where(eq(schema.leads.id, id))
    //   .returning();
    // return row ? rowToLead(row) : null;
    throw new Error(NOT_CONFIGURED);
  }

  async count(_filter?: LeadFilter): Promise<number> {
    // const db = getDb();
    // const where = buildLeadWhere(filter);
    // const [{ value }] = await db
    //   .select({ value: count() })
    //   .from(schema.leads)
    //   .where(where);
    // return Number(value);
    throw new Error(NOT_CONFIGURED);
  }
}
