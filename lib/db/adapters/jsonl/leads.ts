/**
 * JSONL implementation of `LeadRepo`.
 *
 * Storage: data/leads.jsonl, one JSON object per line.
 * Concurrency: status updates take an exclusive file lock and use atomic
 * tempfile-rename writes; appends serialize through the same lock.
 */

import path from "node:path";
import { randomUUID } from "node:crypto";

import type { Lead, LeadStatus } from "../../../types";
import type { LeadFilter, LeadRepo, NewLead } from "../../types";
import {
  DATA_DIR,
  appendJsonl,
  atomicWriteJsonl,
  readJsonl,
  withFileLock,
} from "./shared";

const LEADS_FILE = path.join(DATA_DIR, "leads.jsonl");

function statusMatches(
  lead: Lead,
  status: LeadFilter["status"],
): boolean {
  if (!status) return true;
  if (Array.isArray(status)) return status.includes(lead.status);
  return lead.status === status;
}

function applyFilter(rows: Lead[], filter?: LeadFilter): Lead[] {
  if (!filter) return rows;
  return rows.filter((lead) => {
    if (!statusMatches(lead, filter.status)) return false;
    if (filter.createdAfter && lead.createdAt < filter.createdAfter) {
      return false;
    }
    if (filter.createdBefore && lead.createdAt >= filter.createdBefore) {
      return false;
    }
    return true;
  });
}

export class JsonlLeadRepo implements LeadRepo {
  async create(input: NewLead): Promise<Lead> {
    const lead: Lead = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new",
      name: input.name,
      phone: input.phone,
      email: input.email,
      address: input.address,
      propertyType: input.propertyType,
      propertyAge: input.propertyAge,
      propertySize: input.propertySize,
      stories: input.stories,
      services: input.services,
      timeline: input.timeline,
      budget: input.budget,
      notes: input.notes,
      source: input.source,
      userAgent: input.userAgent,
    };

    await withFileLock(LEADS_FILE, async () => {
      await appendJsonl(LEADS_FILE, lead);
    });

    return lead;
  }

  async list(filter?: LeadFilter): Promise<Lead[]> {
    const rows = await readJsonl<Lead>(LEADS_FILE);
    const filtered = applyFilter(rows, filter);
    // Newest first.
    return filtered.sort((a, b) =>
      (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
  }

  async get(id: string): Promise<Lead | null> {
    const rows = await readJsonl<Lead>(LEADS_FILE);
    return rows.find((lead) => lead.id === id) ?? null;
  }

  async updateStatus(
    id: string,
    status: LeadStatus,
  ): Promise<Lead | null> {
    return withFileLock(LEADS_FILE, async () => {
      const rows = await readJsonl<Lead>(LEADS_FILE);
      let updated: Lead | null = null;
      const next = rows.map((lead) => {
        if (lead.id === id) {
          const merged: Lead = { ...lead, status };
          updated = merged;
          return merged;
        }
        return lead;
      });
      if (!updated) return null;
      await atomicWriteJsonl(LEADS_FILE, next);
      return updated;
    });
  }

  async count(filter?: LeadFilter): Promise<number> {
    const rows = await readJsonl<Lead>(LEADS_FILE);
    return applyFilter(rows, filter).length;
  }
}
