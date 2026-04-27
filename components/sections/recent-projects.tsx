import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/projects-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RecentProjects() {
  // Show 3 most recent projects
  const featured = PROJECTS.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional roofing work across Central Texas. Every project backed by our commitment to quality and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featured.map((project) => (
            <Card
              key={project.slug}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm shadow-lg">
                  {project.categoryLabel}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-white/90">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {project.city}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {project.year}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/projects"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "group",
            )}
          >
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
