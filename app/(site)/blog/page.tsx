import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CTA } from "@/components/sections/cta";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Roofing Blog | AAA Texas Roofing",
  description:
    "Practical roofing advice for Central Texas homeowners and property managers — insurance claims, materials, storm prep, and more.",
  openGraph: {
    title: "Roofing Blog | AAA Texas Roofing",
    description:
      "Practical roofing advice for Central Texas homeowners and property managers.",
    type: "website",
  },
};

export default function BlogPage() {
  // Sort newest first
  const posts = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16 text-white md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/70">
              Blog
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
              Roofing notes from the field
            </h1>
            <p className="text-lg text-white/90 md:text-xl">
              Practical advice for Central Texas property owners — insurance,
              materials, storm prep, and the questions we get most often.
            </p>
          </div>
        </Container>
      </section>

      {/* Featured */}
      <section className="py-12 md:py-16">
        <Container>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-lg md:grid md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] w-full md:aspect-auto md:h-full">
              <Image
                src={featured.image.src}
                alt={featured.image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-6 md:p-10">
              <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary">
                {featured.category}
              </span>
              <h2 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(parseISO(featured.publishedAt), "MMM d, yyyy")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {featured.readTime}
                </span>
              </div>
              <span className="mt-5 inline-flex items-center font-semibold text-primary">
                Read article
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Container>
      </section>

      {/* Grid */}
      <section className="pb-16 md:pb-20">
        <Container>
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">More articles</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-secondary">
                    {post.category}
                  </span>
                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(parseISO(post.publishedAt), "MMM d, yyyy")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
