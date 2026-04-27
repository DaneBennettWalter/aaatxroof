import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { CTA } from "@/components/sections/cta";
import { ProjectsGrid } from "@/components/sections/projects-grid";

export const metadata: Metadata = {
  title: "Recent Roofing Projects in Central Texas | AAA Texas Roofing",
  description:
    "A look at recent residential, commercial, storm-damage, and maintenance roofing projects across Austin, San Antonio, and the Texas Hill Country.",
  openGraph: {
    title: "Recent Roofing Projects in Central Texas | AAA Texas Roofing",
    description:
      "Recent residential, commercial, and storm-damage roofing projects across Central Texas.",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 text-white md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/70">
              Recent Work
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
              Projects across Central Texas
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              A snapshot of recent residential, commercial, storm-damage, and
              maintenance work — from Austin and San Antonio out into the Hill
              Country.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter + grid */}
      <section className="py-12 md:py-16">
        <Container>
          <ProjectsGrid />
          <p className="mt-10 text-center text-xs text-muted-foreground">
            Project photography is representative — replacing with real
            on-site photos as our portfolio grows.
          </p>
        </Container>
      </section>

      <CTA />
    </>
  );
}
