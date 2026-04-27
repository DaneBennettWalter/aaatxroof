"use client";

import * as React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import {
  SERVICE_LABELS,
  TIMELINE_LABELS,
  BUDGET_LABELS,
  type ServiceType,
  type Timeline,
  type BudgetRange,
} from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Schema                                                                      */
/* -------------------------------------------------------------------------- */

const phoneRegex = /^[0-9+()\-.\s]+$/;

const fullSchema = z.object({
  // Step 1
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(40)
    .regex(phoneRegex, "Please enter a valid phone number"),
  address: z
    .string()
    .trim()
    .min(5, "Please enter the property address")
    .max(300),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(200)
    .optional()
    .or(z.literal("")),

  // Step 2
  propertyType: z.enum(["residential", "commercial"], {
    message: "Please choose residential or commercial",
  }),
  propertyAge: z.string().optional(),
  propertySize: z.string().max(40).optional(),
  stories: z.string().optional(),

  // Step 3
  services: z
    .array(
      z.enum([
        "residential",
        "commercial",
        "storm-damage",
        "inspection",
        "insurance-claim",
        "maintenance",
      ]),
    )
    .min(1, "Pick at least one service"),

  // Step 4
  timeline: z.enum(["emergency", "1-2-weeks", "1-3-months", "flexible"], {
    message: "When do you need this done?",
  }),
  budget: z
    .enum(["under-5k", "5k-15k", "15k-30k", "30k-plus", "unsure"])
    .optional(),
  notes: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof fullSchema>;

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  0: ["name", "phone", "address", "email"],
  1: ["propertyType", "propertyAge", "propertySize", "stories"],
  2: ["services"],
  3: ["timeline", "budget", "notes"],
};

const STEP_TITLES = [
  { title: "Let's get started", subtitle: "Three quick fields. We'll be in touch fast." },
  { title: "Tell us about the property", subtitle: "Helps us send the right crew." },
  { title: "What do you need?", subtitle: "Pick everything that applies." },
  { title: "Timing & details", subtitle: "Last step — promise." },
];

/* -------------------------------------------------------------------------- */
/* Reusable bits                                                               */
/* -------------------------------------------------------------------------- */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Step {current + 1} of {total}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  className?: string;
}

function OptionCard({
  selected,
  onClick,
  title,
  description,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full flex-col items-start gap-1 rounded-lg border bg-background p-3 text-left text-sm transition-all",
        "hover:border-primary/40 hover:bg-muted/40",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
          : "border-input",
        className,
      )}
    >
      <span className="font-medium">{title}</span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

export interface QuoteFormProps {
  /** Called after a successful submit (e.g. close the dialog). */
  onSuccess?: () => void;
  /** Optional class for outer wrapper. */
  className?: string;
}

export function QuoteForm({ onSuccess, className }: QuoteFormProps) {
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submittedName, setSubmittedName] = React.useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
      propertyType: undefined as unknown as FormValues["propertyType"],
      propertyAge: "",
      propertySize: "",
      stories: "",
      services: [],
      timeline: undefined as unknown as FormValues["timeline"],
      budget: undefined,
      notes: "",
    },
  });

  const totalSteps = 4;
  const isLastStep = step === totalSteps - 1;

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) return;
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const goBack = () => {
    setSubmitError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          email: values.email?.trim() ? values.email : undefined,
          notes: values.notes?.trim() ? values.notes : undefined,
          propertyAge: values.propertyAge?.trim() || undefined,
          propertySize: values.propertySize?.trim() || undefined,
          stories: values.stories?.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setSubmittedName(values.name.split(" ")[0] || values.name);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------ Success state ------------------------------- */

  if (submittedName) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-4 py-8 text-center",
          className,
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-8" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-semibold">
            Thanks, {submittedName} — we got it.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            A team member will reach out within one business day to confirm
            details and schedule your free assessment.
          </p>
        </div>
        <div className="mt-2 grid w-full gap-2 sm:grid-cols-2">
          <a
            href="tel:+15555555555"
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            )}
          >
            <Phone className="size-4" />
            Call us now
          </a>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              if (onSuccess) onSuccess();
            }}
          >
            Done
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Storm damage or emergency? Call now — we run 24/7.
        </p>
      </div>
    );
  }

  /* --------------------------- Step content ----------------------------- */

  const stepMeta = STEP_TITLES[step];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      noValidate
    >
      <ProgressBar current={step} total={totalSteps} />

      <div>
        <h3 className="font-heading text-lg font-semibold sm:text-xl">
          {stepMeta.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {stepMeta.subtitle}
        </p>
      </div>

      {/* Step transitions: simple fade/slide using key prop */}
      <div key={step} className="animate-in fade-in-0 slide-in-from-right-2 duration-200">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Jane Doe"
                className="mt-1.5 h-11"
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(555) 555-5555"
                className="mt-1.5 h-11"
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>
            <div>
              <Label htmlFor="address">Property address</Label>
              <Input
                id="address"
                autoComplete="street-address"
                placeholder="123 Main St, Austin, TX"
                className="mt-1.5 h-11"
                {...register("address")}
              />
              <FieldError message={errors.address?.message} />
            </div>
            <div>
              <Label htmlFor="email">
                Email <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1.5 h-11"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <Label>Property type</Label>
              <Controller
                control={control}
                name="propertyType"
                render={({ field }) => (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <OptionCard
                      title="Residential"
                      description="Home, duplex, townhome"
                      selected={field.value === "residential"}
                      onClick={() => field.onChange("residential")}
                    />
                    <OptionCard
                      title="Commercial"
                      description="Office, retail, industrial"
                      selected={field.value === "commercial"}
                      onClick={() => field.onChange("commercial")}
                    />
                  </div>
                )}
              />
              <FieldError message={errors.propertyType?.message} />
            </div>

            <div>
              <Label>
                Roof age{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Controller
                control={control}
                name="propertyAge"
                render={({ field }) => (
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { v: "0-5", l: "0–5 yrs" },
                      { v: "5-15", l: "5–15 yrs" },
                      { v: "15-30", l: "15–30 yrs" },
                      { v: "30+", l: "30+ yrs" },
                    ].map((opt) => (
                      <OptionCard
                        key={opt.v}
                        title={opt.l}
                        selected={field.value === opt.v}
                        onClick={() =>
                          field.onChange(field.value === opt.v ? "" : opt.v)
                        }
                      />
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="propertySize">
                  Approx. size{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="propertySize"
                  placeholder="e.g. 2,400 sqft"
                  className="mt-1.5 h-11"
                  {...register("propertySize")}
                />
              </div>
              <div>
                <Label>
                  Stories{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Controller
                  control={control}
                  name="stories"
                  render={({ field }) => (
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {["1", "2", "3+"].map((s) => (
                        <OptionCard
                          key={s}
                          title={s}
                          selected={field.value === s}
                          onClick={() =>
                            field.onChange(field.value === s ? "" : s)
                          }
                        />
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Controller
              control={control}
              name="services"
              render={({ field }) => {
                const value = field.value || [];
                const toggle = (s: ServiceType) => {
                  if (value.includes(s)) {
                    field.onChange(value.filter((v) => v !== s));
                  } else {
                    field.onChange([...value, s]);
                  }
                };
                return (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) => (
                      <OptionCard
                        key={s}
                        title={SERVICE_LABELS[s]}
                        selected={value.includes(s)}
                        onClick={() => toggle(s)}
                      />
                    ))}
                  </div>
                );
              }}
            />
            <FieldError message={errors.services?.message as string | undefined} />
            <p className="mt-3 text-xs text-muted-foreground">
              Pick everything that applies — we'll sort it out on the call.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <Label>Timeline</Label>
              <Controller
                control={control}
                name="timeline"
                render={({ field }) => (
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(Object.keys(TIMELINE_LABELS) as Timeline[]).map((t) => (
                      <OptionCard
                        key={t}
                        title={TIMELINE_LABELS[t]}
                        selected={field.value === t}
                        onClick={() => field.onChange(t)}
                      />
                    ))}
                  </div>
                )}
              />
              <FieldError message={errors.timeline?.message} />
            </div>

            <div>
              <Label>
                Budget{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Controller
                control={control}
                name="budget"
                render={({ field }) => (
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(Object.keys(BUDGET_LABELS) as BudgetRange[]).map((b) => (
                      <OptionCard
                        key={b}
                        title={BUDGET_LABELS[b]}
                        selected={field.value === b}
                        onClick={() =>
                          field.onChange(field.value === b ? undefined : b)
                        }
                      />
                    ))}
                  </div>
                )}
              />
            </div>

            <div>
              <Label htmlFor="notes">
                Anything else?{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Specific concerns, access notes, insurance carrier, etc."
                rows={4}
                className="mt-1.5"
                {...register("notes")}
              />
            </div>
          </div>
        )}
      </div>

      {submitError && (
        <Alert variant="destructive">
          <span>{submitError}</span>
        </Alert>
      )}

      {/* Footer: nav buttons */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={goBack}
          disabled={step === 0 || submitting}
          className={cn(step === 0 && "invisible")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        {!isLastStep ? (
          <Button
            type="button"
            size="lg"
            onClick={goNext}
            disabled={submitting}
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Get my quote
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Helper note: visible only on first step to underline value */}
      {step === 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Free, no-obligation quote. We'll never share your info.
        </p>
      )}

    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Trigger button + Dialog wrapper                                             */
/* -------------------------------------------------------------------------- */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface QuoteFormDialogProps {
  /** Rendered trigger button content (e.g. "Get Free Quote"). */
  children: React.ReactNode;
  /** Optional class for the trigger button. */
  triggerClassName?: string;
  /** Variant for the trigger button. Defaults to "secondary" (burnt orange). */
  triggerVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  /** Size for the trigger button. Defaults to "lg". */
  triggerSize?: "default" | "sm" | "lg" | "xs";
}

/**
 * Drop-in dialog wrapper that renders a styled trigger button and
 * opens the multi-step quote form.
 */
export function QuoteFormDialog({
  children,
  triggerClassName,
  triggerVariant = "secondary",
  triggerSize = "lg",
}: QuoteFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        className={triggerClassName}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Get a free quote</DialogTitle>
          <DialogDescription>
            Quick — most folks finish in under a minute.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 -mx-4 px-4">
          <QuoteForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
