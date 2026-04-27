import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { QuoteFormDialog } from "@/components/sections/quote-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact AAA Texas Roofing | Central Texas Roofers",
  description:
    "Get in touch with AAA Texas Roofing. Phone, email, free quote, or schedule a free roof inspection across the Austin–San Antonio corridor.",
  openGraph: {
    title: "Contact AAA Texas Roofing | Central Texas Roofers",
    description:
      "Phone, email, free quote, or schedule a free roof inspection across the Austin–San Antonio corridor.",
    type: "website",
  },
};

const PHONE = "(555) 555-5555";
const PHONE_HREF = "tel:+15555555555";
const EMAIL = "info@aaatxroof.com";
const EMAIL_HREF = "mailto:info@aaatxroof.com";

// Google Maps embed for Austin–San Antonio corridor (no API key required for standard embed)
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d877527.0123456789!2d-98.49!3d29.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU3JzAwLjAiTiA5OMKwMjknMDAuMCJX!5e0!3m2!1sen!2sus!4v1700000000000";

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 text-white md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/70">
              Contact
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
              Let&apos;s talk
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              Free quote, free inspection, or just questions — pick whichever
              works for you. We&apos;ll get back fast.
            </p>
          </div>
        </Container>
      </section>

      {/* Channels */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {/* Phone */}
            <a
              href={PHONE_HREF}
              className="group block rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mb-1 text-lg font-semibold">Call us</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Pick up the phone — fastest way to get answers.
              </p>
              <span className="text-base font-semibold text-primary">
                {PHONE}
              </span>
            </a>

            {/* Email */}
            <a
              href={EMAIL_HREF}
              className="group block rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mb-1 text-lg font-semibold">Email us</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Best for non-urgent questions or sending photos.
              </p>
              <span className="text-base font-semibold text-primary break-all">
                {EMAIL}
              </span>
            </a>

            {/* Quote form */}
            <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <ArrowRight className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="mb-1 text-lg font-semibold">Request a quote</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Quick four-step form. Most folks finish in under a minute.
              </p>
              <QuoteFormDialog triggerClassName="text-sm">
                Get a Free Quote
              </QuoteFormDialog>
            </div>

            {/* Schedule */}
            <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <CalendarCheck className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="mb-1 text-lg font-semibold">Schedule an inspection</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Pick a time on our calendar and we&apos;ll confirm.
              </p>
              <Link
                href="/schedule"
                className={cn(buttonVariants({ variant: "secondary" }), "text-sm")}
              >
                Schedule Inspection
              </Link>
            </div>
          </div>

          {/* Storm/emergency callout */}
          <div className="mx-auto mt-8 max-w-5xl">
            <div className="flex items-start gap-3 rounded-xl border border-secondary/30 bg-secondary/5 p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
              <div>
                <p className="mb-1 font-semibold text-foreground">
                  Storm damage or emergency?
                </p>
                <p className="text-sm text-muted-foreground">
                  We run 24/7 for emergency tarping and storm response. Call{" "}
                  <a
                    href={PHONE_HREF}
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    {PHONE}
                  </a>{" "}
                  any time.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hours + service area */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Hours</h2>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex justify-between border-b border-input/50 py-2">
                  <span>Monday – Friday</span>
                  <span className="font-medium text-foreground">
                    7:00 AM – 6:00 PM
                  </span>
                </li>
                <li className="flex justify-between border-b border-input/50 py-2">
                  <span>Saturday</span>
                  <span className="font-medium text-foreground">
                    8:00 AM – 2:00 PM
                  </span>
                </li>
                <li className="flex justify-between border-b border-input/50 py-2">
                  <span>Sunday</span>
                  <span className="font-medium text-foreground">By appointment</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Emergency calls</span>
                  <span className="font-medium text-secondary">24/7</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Service area</h2>
              <p className="mb-3 text-muted-foreground">
                We serve the full Austin–San Antonio corridor and the
                surrounding Hill Country.
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <li>Austin</li>
                <li>San Antonio</li>
                <li>Round Rock</li>
                <li>Georgetown</li>
                <li>Cedar Park</li>
                <li>Leander</li>
                <li>Pflugerville</li>
                <li>Buda</li>
                <li>Kyle</li>
                <li>San Marcos</li>
                <li>New Braunfels</li>
                <li>Schertz</li>
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                Outside this list? Call us — we likely cover you.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              Where we work
            </h2>
            <p className="mb-6 text-muted-foreground">
              Centered on the I-35 corridor between Austin and San Antonio.
            </p>
            <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
              <iframe
                title="AAA Texas Roofing service area — Austin to San Antonio corridor"
                src={MAP_EMBED_SRC}
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              No physical office address yet — we operate as a mobile service
              across Central Texas.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
