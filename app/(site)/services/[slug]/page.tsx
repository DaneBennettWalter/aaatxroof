import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { QuoteFormDialog } from "@/components/sections/quote-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SERVICE_SLUGS,
  SERVICES,
  getService,
} from "@/lib/services-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    return { title: "Service not found | AAA Texas Roofing" };
  }
  const title = `${service.title} | AAA Texas Roofing`;
  return {
    title,
    description: service.metaDescription,
    openGraph: {
      title,
      description: service.metaDescription,
      type: "website",
      images: [{ url: service.heroImage.src, alt: service.heroImage.alt }],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const Icon = service.icon;

  // Related = up to 3 other services
  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0">
          <Image
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary/80" />
        </div>
        <div className="relative">
          <Container>
            <div className="max-w-3xl py-16 md:py-24">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/90 ring-1 ring-white/20 backdrop-blur">
                <Icon className="h-4 w-4" />
                {service.shortTitle}
              </div>
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
                {service.title}
              </h1>
              <p className="mb-8 text-lg text-white/90 md:text-xl">
                {service.intro}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
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
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              What we do
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              {service.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* What's included */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">
              What&apos;s included
            </h2>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {service.included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg bg-white p-4 ring-1 ring-foreground/5"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              How it works
            </h2>
            <p className="mb-10 text-lg text-muted-foreground">
              Straightforward process. No surprises.
            </p>
            <ol className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {service.process.map((step, idx) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Why us */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">
              Why choose us for {service.shortTitle.toLowerCase()}
            </h2>
            <ul className="space-y-4">
              {service.whyUs.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                  <span className="text-base">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Related services */}
      <section className="py-16 md:py-20">
        <Container>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">
            Other services
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((s) => {
              const RelIcon = s.icon;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group block rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <RelIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold">{s.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {s.teaser}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-primary">
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-16 text-white md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Free quote, free inspection, no pressure. Pick whichever is
              easier.
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
