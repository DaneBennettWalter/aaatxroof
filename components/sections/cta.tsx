import { Container } from "@/components/layout/container";
import { ArrowRight } from "lucide-react";
import { QuoteFormDialog } from "@/components/sections/quote-form";

export function CTA() {
  return (
    <section className="py-20 bg-primary text-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Get a free, no-obligation quote today. We&apos;ll assess your roofing needs and provide a detailed estimate.
          </p>
          <QuoteFormDialog triggerClassName="text-lg px-8 h-12">
            Request Free Quote
            <ArrowRight className="ml-2 h-5 w-5" />
          </QuoteFormDialog>
        </div>
      </Container>
    </section>
  );
}
