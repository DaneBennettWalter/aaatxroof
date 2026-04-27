import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home, Building2, CloudRain, ClipboardCheck, FileText, Wrench } from "lucide-react";

const services = [
  {
    title: "Residential Roofing",
    description: "New installations, replacements, and repairs for homes throughout Central Texas.",
    icon: Home,
  },
  {
    title: "Commercial Roofing",
    description: "Professional solutions for businesses, warehouses, and commercial properties.",
    icon: Building2,
  },
  {
    title: "Storm Damage Repair",
    description: "Fast response to wind, hail, and weather damage. Insurance claim assistance included.",
    icon: CloudRain,
  },
  {
    title: "Roof Inspections",
    description: "Comprehensive inspections to identify issues before they become expensive problems.",
    icon: ClipboardCheck,
  },
  {
    title: "Insurance Claims",
    description: "We work directly with your insurance company to maximize your claim and minimize hassle.",
    icon: FileText,
  },
  {
    title: "Maintenance & Repairs",
    description: "Keep your roof in top condition with professional maintenance and minor repairs.",
    icon: Wrench,
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
              <Card key={service.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
