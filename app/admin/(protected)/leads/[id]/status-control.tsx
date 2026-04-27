"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/admin-constants";

export function LeadStatusControl({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: LeadStatus;
}) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onChange = (next: string | null) => {
    if (!next) return;
    const value = next as LeadStatus;
    const previous = status;
    setStatus(value);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/leads/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: value }),
        });
        if (!res.ok) throw new Error(await res.text());
      } catch (err) {
        setStatus(previous);
        setError(err instanceof Error ? err.message : "Update failed");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Select value={status} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
