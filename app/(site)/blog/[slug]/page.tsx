import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CTA } from "@/components/sections/cta";
import { BLOG_POSTS, BLOG_SLUGS, getPost } from "@/lib/blog-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return { title: "Post not found | AAA Texas Roofing" };
  }
  const title = `${post.title} | AAA Texas Roofing`;
  return {
    title,
    description: post.excerpt,
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: post.image.src, alt: post.image.alt }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Related = up to 3 other posts
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {/* Header */}
      <section className="border-b bg-neutral-50 py-10 md:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to blog
            </Link>
            <span className="mt-4 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary">
              {post.category}
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(parseISO(post.publishedAt), "MMMM d, yyyy")}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero image */}
      <section>
        <Container>
          <div className="mx-auto -mt-2 max-w-4xl overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Body */}
      <article className="py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
              {post.body.map((section, idx) => {
                if (section.type === "h2") {
                  return (
                    <h2
                      key={idx}
                      className="mt-10 text-2xl font-bold text-foreground md:text-3xl"
                    >
                      {section.text}
                    </h2>
                  );
                }
                if (section.type === "ul") {
                  return (
                    <ul
                      key={idx}
                      className="list-disc space-y-2 pl-6 text-muted-foreground marker:text-secondary"
                    >
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-muted-foreground">
                    {section.text}
                  </p>
                );
              })}
            </div>
          </div>
        </Container>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t bg-neutral-50 py-12 md:py-16">
          <Container>
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">
              Related articles
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-secondary">
                      {p.category}
                    </span>
                    <h3 className="mt-2 line-clamp-2 font-semibold leading-snug">
                      {p.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary">
                      Read article
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CTA />
    </>
  );
}
