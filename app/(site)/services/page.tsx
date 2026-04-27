import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CTA } from "@/components/sections/cta";
import { SERVICES } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Roofing Services in Central Texas | AAA Texas Roofing",
  description:
    "Residential, commercial, storm damage, inspections, insurance claims, and maintenance — full-service roofing across the Austin–San Antonio corridor.",
  openGraph: {
    title: "Roofing Services in Central Texas | AAA Texas Roofing",
    description:
      "Full-service roofing across the Austin–San Antonio corridor: residential, commercial, storm damage, inspections, insurance claims, and maintenance.",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 text-white md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/70">
              Our Services
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
              Roofing done right, across Central Texas
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              From a single repair to a full commercial reroof, we handle every
              kind of roofing work the Austin–San Antonio corridor throws at us
              — and we document it like we&apos;ll have to defend it tomorrow.
            </p>
          </div>
        </Container>
      </section>

      {/* Service cards */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group block focus-visible:outline-none"
                >
                  <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-primary">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-base">
                        {service.teaser}
                      </CardDescription>
                    </CardHeader>
                    <div className="px-4 pb-4 group-data-[size=sm]/card:px-3">
                      <span className="inline-flex items-center text-sm font-semibold text-primary">
                        Learn more
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
