"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APPOINTMENT_STATUSES,
  type AppointmentStatus,
} from "@/lib/admin-constants";

export function AppointmentStatusControl({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: AppointmentStatus;
}) {
  const [status, setStatus] = useState<AppointmentStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onChange = (next: string | null) => {
    if (!next) return;
    const value = next as AppointmentStatus;
    const previous = status;
    setStatus(value);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/appointments/${encodeURIComponent(id)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: value }),
          },
        );
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
          {APPOINTMENT_STATUSES.map((s) => (
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
