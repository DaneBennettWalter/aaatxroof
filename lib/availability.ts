/**
 * Availability calendar for inspection scheduling.
 *
 * Business hours (America/Chicago):
 *   - Mon–Fri  : 8:00 AM – 5:00 PM (last slot starts 4:00 PM)
 *   - Saturday : 9:00 AM – 2:00 PM (last slot starts 1:00 PM)
 *   - Sunday   : closed
 *
 * Slots are 1 hour. Past slots (relative to "now") are filtered out.
 */

import type { AvailableDay, AvailableSlot } from "./types";

export const BUSINESS_TIMEZONE = "America/Chicago";
export const SLOT_DURATION_MINUTES = 60;
export const SCHEDULING_WINDOW_DAYS = 14;

/** Inclusive start hour, exclusive end hour, in the business timezone. */
interface DayWindow {
  startHour: number;
  endHour: number;
}

function windowForDayOfWeek(dow: number): DayWindow | null {
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (dow === 0) return null;
  if (dow === 6) return { startHour: 9, endHour: 14 };
  return { startHour: 8, endHour: 17 };
}

/**
 * Return ISO date (YYYY-MM-DD) for a given Date as observed in `tz`.
 */
function isoDateInTz(d: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${day}`;
}

function dayOfWeekInTz(d: Date, tz: string): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(d);
  return ({ Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 } as Record<
    string,
    number
  >)[wd];
}

function dayLabelInTz(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

function timeLabelInTz(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Compute the UTC instant for a given (Y-M-D, hour) interpreted in `tz`.
 * Uses a small offset-iteration trick so we don't need a tz library.
 */
function instantForLocal(
  isoDate: string,
  hour: number,
  tz: string,
): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  // Initial guess: treat the local wall time as UTC.
  let guess = new Date(Date.UTC(y, m - 1, d, hour, 0, 0));

  // Iterate twice to converge across DST transitions.
  for (let i = 0; i < 2; i++) {
    const observed = isoDateInTz(guess, tz);
    const observedHour = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "2-digit",
        hour12: false,
      })
        .format(guess)
        .replace(/[^\d]/g, ""),
    );

    // Difference between intended local time and observed local time.
    const intended = Date.UTC(y, m - 1, d, hour);
    const [oy, om, od] = observed.split("-").map(Number);
    const observedUtc = Date.UTC(oy, om - 1, od, observedHour);
    const drift = observedUtc - intended;
    if (drift === 0) break;
    guess = new Date(guess.getTime() - drift);
  }

  return guess;
}

/**
 * Generate all candidate slots for the next N days, returning them grouped by
 * day. Past slots and slots in the booked set are excluded.
 *
 * @param now           Reference instant; defaults to current time.
 * @param bookedSlotSet Set of ISO timestamps already booked.
 */
export function generateAvailability(
  now: Date,
  bookedSlotSet: Set<string>,
  windowDays: number = SCHEDULING_WINDOW_DAYS,
): AvailableDay[] {
  const tz = BUSINESS_TIMEZONE;
  const days: AvailableDay[] = [];

  // Walk N calendar days starting today (in business tz).
  const todayIso = isoDateInTz(now, tz);
  const [ty, tm, td] = todayIso.split("-").map(Number);

  for (let offset = 0; offset < windowDays; offset++) {
    // Add `offset` days to the local date (UTC math; date-only is safe).
    const date = new Date(Date.UTC(ty, tm - 1, td + offset, 12, 0, 0));
    const isoDate = isoDateInTz(date, tz);
    const dow = dayOfWeekInTz(date, tz);
    const window = windowForDayOfWeek(dow);
    if (!window) continue;

    const slots: AvailableSlot[] = [];
    for (let hour = window.startHour; hour < window.endHour; hour++) {
      const start = instantForLocal(isoDate, hour, tz);
      if (start.getTime() <= now.getTime()) continue;

      const iso = start.toISOString();
      if (bookedSlotSet.has(iso)) continue;

      slots.push({
        start: iso,
        label: timeLabelInTz(start, tz),
      });
    }

    if (slots.length === 0) continue;

    days.push({
      date: isoDate,
      label: dayLabelInTz(
        instantForLocal(isoDate, 12, tz),
        tz,
      ),
      slots,
    });
  }

  return days;
}

/**
 * Validate that an ISO timestamp falls on a real business slot boundary
 * within the scheduling window.
 */
export function isValidSlotInstant(iso: string, now: Date): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  if (d.getTime() <= now.getTime()) return false;

  const tz = BUSINESS_TIMEZONE;
  const dow = dayOfWeekInTz(d, tz);
  const window = windowForDayOfWeek(dow);
  if (!window) return false;

  const isoDate = isoDateInTz(d, tz);
  const hourStr = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    hour12: false,
  })
    .format(d)
    .replace(/[^\d]/g, "");
  const hour = Number(hourStr);
  const minuteStr = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    minute: "2-digit",
  })
    .format(d)
    .replace(/[^\d]/g, "");
  const minute = Number(minuteStr);

  if (minute !== 0) return false;
  if (hour < window.startHour || hour >= window.endHour) return false;

  // Must align to an exact slot start: regenerate the canonical instant and
  // compare ISO strings to defend against weird input like off-the-hour ms.
  const canonical = instantForLocal(isoDate, hour, tz).toISOString();
  if (canonical !== d.toISOString()) return false;

  // Must be within the scheduling window.
  const horizon = new Date(now.getTime());
  horizon.setUTCDate(horizon.getUTCDate() + SCHEDULING_WINDOW_DAYS + 1);
  if (d.getTime() > horizon.getTime()) return false;

  return true;
}
