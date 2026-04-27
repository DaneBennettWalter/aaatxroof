import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Phone, ArrowRight, CalendarCheck } from "lucide-react";
import { QuoteFormDialog } from "@/components/sections/quote-form";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-20 md:py-32">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Central Texas&apos; Most Trusted Roofing Company
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Professional roofing services for residential and commercial properties.
            Storm damage repair, insurance claims, and quality craftsmanship you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <QuoteFormDialog triggerClassName="text-lg px-8 h-12">
              Get Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </QuoteFormDialog>
            <Link
              href="/schedule"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-lg px-8 h-12 bg-white text-primary hover:bg-white/90 border-white",
              )}
            >
              <CalendarCheck className="mr-2 h-5 w-5" />
              Schedule Free Inspection
            </Link>
            <a
              href="tel:+15555555555"
              className="inline-flex items-center justify-center rounded-md text-lg px-8 h-12 bg-white/10 hover:bg-white/20 border border-white text-white font-medium transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: (555) 555-5555
            </a>
          </div>
        </div>
      </Container>

      {/* Trust Indicators */}
      <Container className="mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold mb-2">Free</div>
            <div className="text-white/80">Quotes &amp; Inspections</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold mb-2">24/7</div>
            <div className="text-white/80">Storm Response</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold mb-2">Insured</div>
            <div className="text-white/80">Liability &amp; Workers&apos; Comp</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold mb-2">Local</div>
            <div className="text-white/80">Central Texas Crews</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
