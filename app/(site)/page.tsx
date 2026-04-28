"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Building2, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PropertyType = "residential" | "commercial" | null;

export default function HomePage() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>(null);

  if (!selectedProperty) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            {/* Brand */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                AAA Texas Roofing
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Central Texas' most trusted roofing company. Professional service,
                honest pricing, quality you can count on.
              </p>
            </div>

            {/* Property Type Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold">
                What kind of property?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Card
                  className="group relative overflow-hidden cursor-pointer border-2 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedProperty("residential")}
                >
                  <div className="p-12 text-center">
                    <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Home className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3">Residential</h3>
                    <p className="text-white/80 text-lg">
                      Homeowners, apartments, townhomes
                    </p>
                  </div>
                </Card>

                <Card
                  className="group relative overflow-hidden cursor-pointer border-2 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedProperty("commercial")}
                >
                  <div className="p-12 text-center">
                    <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3">Commercial</h3>
                    <p className="text-white/80 text-lg">
                      Businesses, warehouses, multi-family
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-3xl mx-auto">
              <div>
                <div className="text-2xl md:text-3xl font-bold mb-2">Free</div>
                <div className="text-white/70 text-sm">Quotes & Inspections</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold mb-2">24/7</div>
                <div className="text-white/70 text-sm">Storm Response</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold mb-2">Insured</div>
                <div className="text-white/70 text-sm">Licensed & Bonded</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold mb-2">Local</div>
                <div className="text-white/70 text-sm">Central Texas</div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // Step 2: Action Selection
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {/* Back button */}
          <button
            onClick={() => setSelectedProperty(null)}
            className="mb-8 text-white/80 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            ← Back
          </button>

          {/* Confirmation */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm">
              {selectedProperty === "residential" ? (
                <Home className="h-6 w-6" />
              ) : (
                <Building2 className="h-6 w-6" />
              )}
              <span className="text-lg font-semibold capitalize">
                {selectedProperty} Property
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Get started in seconds. We're ready when you are.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <a
              href="tel:+15555555555"
              className={cn(
                "group relative overflow-hidden border-2 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105 rounded-xl",
              )}
            >
              <div className="p-12 text-center">
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold mb-3">Call Now</h3>
                <p className="text-lg opacity-80 group-hover:text-primary/80">
                  Speak with a roofing expert
                </p>
                <div className="mt-4 text-2xl font-bold">
                  (555) 555-5555
                </div>
              </div>
            </a>

            <Link
              href="/schedule"
              className={cn(
                "group relative overflow-hidden border-2 border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105 rounded-xl",
              )}
            >
              <div className="p-12 text-center">
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Calendar className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold mb-3">Schedule</h3>
                <p className="text-lg opacity-80 group-hover:text-primary/80">
                  Book a free inspection online
                </p>
                <div className="mt-4 text-xl font-semibold">
                  Pick your time →
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary nav */}
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/services"
              className="text-white/70 hover:text-white transition-colors"
            >
              Our Services
            </Link>
            <Link
              href="/projects"
              className="text-white/70 hover:text-white transition-colors"
            >
              Recent Projects
            </Link>
            <Link
              href="/about"
              className="text-white/70 hover:text-white transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              className="text-white/70 hover:text-white transition-colors"
            >
              Resources
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
