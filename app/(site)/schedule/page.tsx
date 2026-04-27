import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Scheduler } from "@/components/sections/scheduler";

export const metadata: Metadata = {
  title: "Schedule a Free Roof Inspection | AAA Texas Roofing",
  description:
    "Book a free, no-obligation roof inspection in Central Texas. Pick a time that works — we'll handle the rest.",
};

export default function SchedulePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-14 text-white md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/70">
              Free Inspection
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
              Schedule your free roof inspection
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              Pick a time that works for you. Our certified inspector will
              walk the roof, document any issues with photos, and send you a
              written report — no pressure, no obligation.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Scheduler />
          </div>
        </Container>
      </section>
    </>
  );
}
