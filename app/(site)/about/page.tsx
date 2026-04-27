import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  HardHat,
  Handshake,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { QuoteFormDialog } from "@/components/sections/quote-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About AAA Texas Roofing | Central Texas' Premier Roofing Company",
  description:
    "AAA Texas Roofing is Central Texas' premier roofing company — vetted crews, professional documentation, and craftsmanship built to outlast Texas weather.",
  openGraph: {
    title: "About AAA Texas Roofing | Central Texas' Premier Roofing Company",
    description:
      "Central Texas' premier roofing company — vetted crews, professional documentation, and craftsmanship built to outlast Texas weather.",
    type: "website",
  },
};

const trustSignals = [
  {
    icon: ShieldCheck,
    title: "Fully Insured",
    body: "Liability and workers' comp coverage on every job. Certificates available on request.",
  },
  {
    icon: Award,
    title: "Manufacturer Certified",
    body: "Crews trained on the systems they install — backed by manufacturer warranties.",
  },
  {
    icon: HardHat,
    title: "Vetted Crews",
    body: "We work with field crews we know — not random subs we met yesterday.",
  },
  {
    icon: Handshake,
    title: "Insurance Experienced",
    body: "Comfortable on-roof with adjusters; documentation built for carriers.",
  },
];

const processSteps = [
  {
    n: 1,
    title: "Reach out",
    body:
      "Quote form or schedule an inspection — both are free, both go to a real person.",
  },
  {
    n: 2,
    title: "On-site assessment",
    body:
      "We walk the roof, document conditions with photos, and explain what we find in plain English.",
  },
  {
    n: 3,
    title: "Clear written estimate",
    body:
      "Itemized scope, materials, and timeline. You see what you're paying for before anything starts.",
  },
  {
    n: 4,
    title: "Schedule the work",
    body:
      "We pick a day that works for your schedule and the weather. No surprises.",
  },
  {
    n: 5,
    title: "Build it right",
    body:
      "Tarps over landscaping, daily cleanup, and a final walkthrough so you sign off on the work — not just the invoice.",
  },
  {
    n: 6,
    title: "Stand behind it",
    body:
      "Manufacturer-backed material warranty plus our workmanship warranty. We pick up the phone if anything comes up.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80"
            alt="Central Texas neighborhood with quality residential roofs"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary/80" />
        </div>
        <div className="relative">
          <Container>
            <div className="max-w-3xl py-16 md:py-24">
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/70">
                About Us
              </p>
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
                Central Texas&apos; premier roofing company
              </h1>
              <p className="text-lg text-white/90 md:text-xl">
                We&apos;re built for the Austin–San Antonio corridor: vetted
                crews, professional documentation, and craftsmanship that
                respects both your home and Texas weather.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Our story
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                AAA Texas Roofing exists because the gap between a great
                roofing company and a forgettable one is enormous — and most
                homeowners only find out which side they hired after the work
                is already done.
              </p>
              <p>
                We connect Central Texas property owners with the best
                roofers in the region: vetted, insured, manufacturer-certified
                crews who treat the job like their own house is on the
                receiving end. Every project we touch is documented, scoped,
                and built to a standard we&apos;d be willing to put our name
                on — because we do.
              </p>
              <p>
                We focus on the Austin–San Antonio corridor on purpose. Local
                crews. Local code knowledge. Local weather patterns. When you
                roof for Texas heat, hail, and humidity year after year, you
                stop guessing and start knowing.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Positioning band */}
      <section className="bg-neutral-50 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-secondary">
              Why we&apos;re different
            </p>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Professional. Documented. Built right.
            </h2>
            <p className="text-lg text-muted-foreground">
              Most roofs don&apos;t fail because the materials are bad. They
              fail because someone cut a corner during install — bad flashing,
              missing underlayment, skipped ventilation. We don&apos;t cut
              those corners. And we document the ones we don&apos;t cut, so
              you can prove it later.
            </p>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              How we work
            </h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Six steps. No mystery.
            </p>
            <ol className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {processSteps.map((step) => (
                <li key={step.n} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Trust signals */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
              Built to be trusted
            </h2>
            <p className="mb-10 text-center text-lg text-muted-foreground">
              The boring-but-important stuff that protects your home and
              ours.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trustSignals.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="rounded-xl bg-white p-6 ring-1 ring-foreground/10"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-1 font-semibold">{t.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.body}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              License numbers, insurance certificates, and manufacturer
              credentials available on request.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-white md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Let&apos;s talk about your roof
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Free quote, free inspection, no pressure. We&apos;ll give you a
              straight answer either way.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <QuoteFormDialog triggerClassName="text-base px-6 h-12">
                Get a Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </QuoteFormDialog>
              <Link
                href="/schedule"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 border-white bg-white px-6 text-base text-primary hover:bg-white/90",
                )}
              >
                <CalendarCheck className="mr-2 h-5 w-5" />
                Schedule Inspection
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
