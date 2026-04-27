import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, Building2, CloudRain, ClipboardCheck, FileText, Wrench, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Residential Roofing",
    description: "New installations, replacements, and repairs for homes throughout Central Texas.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    slug: "residential",
  },
  {
    title: "Commercial Roofing",
    description: "Professional solutions for businesses, warehouses, and commercial properties.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=800&q=80",
    slug: "commercial",
  },
  {
    title: "Storm Damage Repair",
    description: "Fast response to wind, hail, and weather damage. Insurance claim assistance included.",
    icon: CloudRain,
    image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=800&q=80",
    slug: "storm-damage",
  },
  {
    title: "Roof Inspections",
    description: "Comprehensive inspections to identify issues before they become expensive problems.",
    icon: ClipboardCheck,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    slug: "inspections",
  },
  {
    title: "Insurance Claims",
    description: "We work directly with your insurance company to maximize your claim and minimize hassle.",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    slug: "insurance-claims",
  },
  {
    title: "Maintenance & Repairs",
    description: "Keep your roof in top condition with professional maintenance and minor repairs.",
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80",
    slug: "repairs",
  },
];

export function Services() {
  return (
    <section className="py-20 bg-neutral-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive roofing solutions for every need. Professional, reliable, and built to last.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} href={`/services/${service.slug}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {service.title}
                      <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
