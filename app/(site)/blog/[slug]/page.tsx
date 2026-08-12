import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getBlogPostBySlug, getBlogPosts, getSiteSettings } from "@/lib/content";
import { articleSchema, jsonLdScript } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Only published posts are statically generated (database mode).
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      ...(post.coverImageUrl ? { images: [{ url: post.coverImageUrl }] } : {}),
    },
  };
}

/** Blog article page — renders content as paragraphs (blank-line separated). */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteSettings(),
  ]);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  return (
    <article>
      {/* Header */}
      <header className="border-b border-hairline pb-14 pt-36 md:pt-44">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist transition hover:text-lime"
          >
            <ArrowLeft className="size-4" aria-hidden /> All articles
          </Link>
          {post.category ? (
            <p className="kicker mt-6">{post.category}</p>
          ) : null}
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-wider text-faint">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-3.5" aria-hidden />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-PK", {
                    dateStyle: "long",
                  })
                : ""}
            </span>
            {post.authorName ? <span>· {post.authorName}</span> : null}
          </p>
        </Container>
      </header>

      {/* Cover */}
      {post.coverImageUrl ? (
        <div className="relative aspect-[16/7] w-full overflow-hidden border-b border-hairline">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {/* Body */}
      <Container className="max-w-3xl py-14">
        <div className="space-y-6 text-base leading-relaxed text-ink md:text-lg">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-mist [&:first-child]:text-ink [&:first-child]:text-lg md:[&:first-child]:text-xl">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-hairline bg-surface p-8 text-center">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Put it into practice.
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
            Articles are easier with a coach watching your reps. Your first
            session is free.
          </p>
          <Link
            href="/membership"
            className="mt-6 inline-block rounded-md bg-lime px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
          >
            Start Your Transformation
          </Link>
        </div>
      </Container>
      {/* Article structured data (escaped) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(articleSchema(post, settings)),
        }}
      />
    </article>
  );
}
