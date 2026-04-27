"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PROJECTS,
  PROJECT_FILTERS,
  type Project,
  type ProjectFilter,
} from "@/lib/projects-data";

/* -------------------------------------------------------------------------- */
/* Filterable grid                                                             */
/* -------------------------------------------------------------------------- */

export function ProjectsGrid() {
  const [active, setActive] = React.useState<ProjectFilter["value"]>("all");
  const [selected, setSelected] = React.useState<Project | null>(null);

  const filtered =
    active === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === active);

  return (
    <>
      {/* Filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {PROJECT_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActive(f.value)}
            aria-pressed={active === f.value}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              active === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-foreground hover:bg-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => setSelected(project)}
            className="group block overflow-hidden rounded-xl bg-card text-left ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-primary backdrop-blur">
                {project.categoryLabel}
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-semibold leading-snug">
                {project.title}
              </h3>
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                {project.summary}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-input p-8 text-center text-muted-foreground">
          No projects in this category yet.
        </p>
      )}

      {/* Lightbox modal */}
      {selected && (
        <ProjectLightbox
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                    */
/* -------------------------------------------------------------------------- */

function ProjectLightbox({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow ring-1 ring-foreground/10 hover:bg-white"
        >
          <span aria-hidden>×</span>
        </button>
        <div className="relative aspect-[16/9] w-full bg-muted">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
        <div className="max-h-[40vh] overflow-y-auto p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
              {project.categoryLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {project.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {project.year}
            </span>
          </div>
          <h3 className="mb-2 text-2xl font-bold">{project.title}</h3>
          <p className="mb-4 text-muted-foreground">{project.description}</p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="rounded-md bg-muted/50 px-3 py-2 text-sm"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
