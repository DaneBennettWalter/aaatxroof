"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  INSPECTION_TYPES,
  type Appointment,
  type AvailableDay,
  type InspectionType,
} from "@/lib/types";

type Step = "pick-slot" | "details" | "confirmed";

const PHONE_RE = /^[\d\s().+\-]{7,}$/;

const detailsSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name."),
  customerPhone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Please enter a valid phone number."),
  customerEmail: z.string().trim().email("Please enter a valid email."),
  address: z.string().trim().min(5, "Please enter the property address."),
  inspectionType: z.enum([
    "residential",
    "commercial",
    "storm-damage",
    "insurance",
  ]),
  notes: z.string().trim().max(2000).optional(),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

interface SelectedSlot {
  dayLabel: string;
  date: string;
  start: string;
  timeLabel: string;
}

export function Scheduler() {
  const [step, setStep] = React.useState<Step>("pick-slot");
  const [days, setDays] = React.useState<AvailableDay[] | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<SelectedSlot | null>(
    null,
  );
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [appointment, setAppointment] = React.useState<Appointment | null>(
    null,
  );

  const form = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      address: "",
      inspectionType: "residential",
      notes: "",
    },
  });

  const loadAvailability = React.useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/appointments/availability", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { days: AvailableDay[] };
      setDays(data.days);
      if (data.days.length > 0) {
        setSelectedDate((cur) =>
          cur && data.days.some((d) => d.date === cur) ? cur : data.days[0].date,
        );
      }
    } catch (err) {
      console.error("Failed to load availability", err);
      setLoadError("We couldn't load available times. Please try again.");
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await loadAvailability();
      if (cancelled) {
        // No state mutation needed; effect was torn down before fetch resolved.
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
    // loadAvailability is stable (useCallback with [] deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPickSlot = (day: AvailableDay, slot: { start: string; label: string }) => {
    setSelectedSlot({
      dayLabel: day.label,
      date: day.date,
      start: slot.start,
      timeLabel: slot.label,
    });
    setSubmitError(null);
    setStep("details");
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selectedSlot) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          scheduledFor: selectedSlot.start,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setSubmitError(
            "That slot was just booked. Please pick another time.",
          );
          await loadAvailability();
          setStep("pick-slot");
          setSelectedSlot(null);
          return;
        }
        setSubmitError(data?.error || "Failed to book appointment.");
        return;
      }
      setAppointment(data.appointment as Appointment);
      setStep("confirmed");
    } catch (err) {
      console.error("Booking error", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  });

  const restart = () => {
    form.reset();
    setSelectedSlot(null);
    setAppointment(null);
    setSubmitError(null);
    setStep("pick-slot");
    void loadAvailability();
  };

  if (step === "confirmed" && appointment) {
    return <Confirmation appointment={appointment} onRestart={restart} />;
  }

  if (step === "details" && selectedSlot) {
    return (
      <DetailsForm
        slot={selectedSlot}
        onBack={() => {
          setSubmitError(null);
          setStep("pick-slot");
        }}
        form={form}
        onSubmit={onSubmit}
        submitting={submitting}
        submitError={submitError}
      />
    );
  }

  return (
    <SlotPicker
      days={days}
      loadError={loadError}
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      onPickSlot={onPickSlot}
      onRetry={loadAvailability}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Step 1: pick a slot                                                         */
/* -------------------------------------------------------------------------- */

function SlotPicker(props: {
  days: AvailableDay[] | null;
  loadError: string | null;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
  onPickSlot: (
    day: AvailableDay,
    slot: { start: string; label: string },
  ) => void;
  onRetry: () => void;
}) {
  const { days, loadError, selectedDate, onSelectDate, onPickSlot, onRetry } =
    props;

  if (loadError) {
    return (
      <Card>
        <CardContent className="py-10">
          <Alert variant="destructive">
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={onRetry}>Try again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (days === null) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading available times…
        </CardContent>
      </Card>
    );
  }

  if (days.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">
            No appointments are available in the next 14 days. Please call us
            at <span className="font-semibold">(555) 555-5555</span> and we&apos;ll
            get you on the schedule.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activeDay = days.find((d) => d.date === selectedDate) ?? days[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          Schedule Your Free Inspection
        </CardTitle>
        <CardDescription>
          Pick a day and time that works for you. Inspections take about
          30–60 minutes and are 100% free, no obligation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Day pills */}
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Available days
          </Label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => {
              const active = day.date === activeDay.date;
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => onSelectDate(day.date)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  {day.label}
                  <span
                    className={cn(
                      "ml-2 rounded-full px-1.5 py-0.5 text-xs",
                      active
                        ? "bg-primary-foreground/20"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {day.slots.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots for the active day */}
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Available times — {activeDay.label}
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {activeDay.slots.map((slot) => (
              <Button
                key={slot.start}
                type="button"
                variant="outline"
                onClick={() => onPickSlot(activeDay, slot)}
                className="justify-center"
              >
                <Clock className="mr-1.5 h-4 w-4" />
                {slot.label}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Hours: Mon–Fri 8 AM – 5 PM · Saturday 9 AM – 2 PM · Closed Sunday.
          Times shown in Central Time.
        </p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 2: customer details                                                    */
/* -------------------------------------------------------------------------- */

function DetailsForm(props: {
  slot: SelectedSlot;
  onBack: () => void;
  form: ReturnType<typeof useForm<DetailsFormValues>>;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const { slot, onBack, form, onSubmit, submitting, submitError } = props;
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const inspectionType = watch("inspectionType");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Your Inspection Details</CardTitle>
            <CardDescription>
              Tell us where to meet you. We&apos;ll confirm by phone or email.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} type="button">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Change time
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <CalendarCheck className="h-3.5 w-3.5" />
            {slot.dayLabel}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            {slot.timeLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              icon={<User className="h-4 w-4" />}
              error={errors.customerName?.message}
            >
              <Input
                placeholder="Jane Smith"
                autoComplete="name"
                {...register("customerName")}
              />
            </Field>
            <Field
              label="Phone"
              icon={<Phone className="h-4 w-4" />}
              error={errors.customerPhone?.message}
            >
              <Input
                placeholder="(512) 555-1234"
                autoComplete="tel"
                inputMode="tel"
                {...register("customerPhone")}
              />
            </Field>
          </div>

          <Field
            label="Email"
            icon={<Mail className="h-4 w-4" />}
            error={errors.customerEmail?.message}
          >
            <Input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("customerEmail")}
            />
          </Field>

          <Field
            label="Property address"
            icon={<MapPin className="h-4 w-4" />}
            error={errors.address?.message}
          >
            <Input
              placeholder="123 Main St, Austin, TX 78701"
              autoComplete="street-address"
              {...register("address")}
            />
          </Field>

          <div>
            <Label className="mb-2 block text-sm font-medium">
              Inspection type
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {INSPECTION_TYPES.map((opt) => {
                const active = inspectionType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setValue("inspectionType", opt.value as InspectionType, {
                        shouldDirty: true,
                      })
                    }
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    <div className="font-medium">{opt.label}</div>
                  </button>
                );
              })}
            </div>
            {errors.inspectionType ? (
              <p className="mt-1 text-xs text-destructive">
                {errors.inspectionType.message}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="Anything we should know? Visible damage, gate codes, dogs in the yard, etc."
              {...register("notes")}
            />
          </div>

          {submitError ? (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={submitting}
            >
              Back
            </Button>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking…
                </>
              ) : (
                "Confirm Inspection"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field(props: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        {props.icon}
        {props.label}
      </Label>
      {props.children}
      {props.error ? (
        <p className="mt-1 text-xs text-destructive">{props.error}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 3: confirmation                                                        */
/* -------------------------------------------------------------------------- */

function Confirmation(props: {
  appointment: Appointment;
  onRestart: () => void;
}) {
  const { appointment, onRestart } = props;
  const dt = new Date(appointment.scheduledFor);
  const dateStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(dt);
  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dt);

  const inspectionLabel =
    INSPECTION_TYPES.find((t) => t.value === appointment.inspectionType)
      ?.label ?? appointment.inspectionType;

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl">You&apos;re on the schedule.</CardTitle>
        <CardDescription>
          We&apos;ve sent a confirmation to {appointment.customerEmail}. Save this
          page or take a screenshot — you&apos;ll want the details handy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/40 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailRow
              icon={<CalendarCheck className="h-4 w-4 text-primary" />}
              label="Date"
              value={dateStr}
            />
            <DetailRow
              icon={<Clock className="h-4 w-4 text-primary" />}
              label="Time"
              value={`${timeStr} CT`}
            />
            <DetailRow
              icon={<User className="h-4 w-4 text-primary" />}
              label="Name"
              value={appointment.customerName}
            />
            <DetailRow
              icon={<Phone className="h-4 w-4 text-primary" />}
              label="Phone"
              value={appointment.customerPhone}
            />
            <DetailRow
              icon={<MapPin className="h-4 w-4 text-primary" />}
              label="Address"
              value={appointment.address}
              full
            />
            <DetailRow
              icon={<CalendarCheck className="h-4 w-4 text-primary" />}
              label="Inspection"
              value={inspectionLabel}
            />
          </div>
          {appointment.notes ? (
            <div className="mt-4 border-t pt-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Notes
              </div>
              <p className="mt-1 text-sm">{appointment.notes}</p>
            </div>
          ) : null}
          <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
            <span>Confirmation #{appointment.id.slice(0, 8).toUpperCase()}</span>
            <span>Status: {appointment.status}</span>
          </div>
        </div>

        <div className="rounded-lg bg-primary/5 p-4 text-sm">
          <p className="font-medium">What happens next?</p>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-muted-foreground">
            <li>
              Our office will call to confirm the day before your appointment.
            </li>
            <li>
              An inspector will arrive within a 15-minute window of your
              scheduled time.
            </li>
            <li>
              You&apos;ll receive a written report with photos within 24 hours.
            </li>
            <li>
              Need to reschedule? Just call <strong>(555) 555-5555</strong>.
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" onClick={onRestart}>
            Book another inspection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow(props: {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={cn(props.full && "sm:col-span-2")}>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {props.icon}
        {props.label}
      </div>
      <div className="mt-0.5 text-sm font-medium">{props.value}</div>
    </div>
  );
}
