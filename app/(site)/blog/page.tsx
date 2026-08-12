import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Training tips, nutrition notes and member stories from Town Fitness Point. Practical advice, no fluff.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        kicker="Blog"
        title="Train Smarter. Eat Right. Show Up."
        lede="Practical notes from the floor — programming, nutrition and the occasional member story. Written by the coaches."
      />

      <section className="py-16 md:py-24">
        <Container>
          {posts.length > 0 ? (
            <div className="space-y-16">
              {/* Featured post */}
              {featured ? (
                <Reveal>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group grid overflow-hidden rounded-xl border border-hairline bg-surface transition-colors hover:border-lime/50 lg:grid-cols-2"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-72">
                      {featured.coverImageUrl ? (
                        <Image
                          src={featured.coverImageUrl}
                          alt={featured.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-surface" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-12">
                      <p className="kicker">Featured</p>
                      <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="mt-4 leading-relaxed text-mist">{featured.excerpt}</p>
                      <p className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-faint">
                        <CalendarDays className="size-3.5" aria-hidden />
                        {featured.publishedAt
                          ? new Date(featured.publishedAt).toLocaleDateString("en-PK", {
                              dateStyle: "medium",
                            })
                          : ""}
                        {featured.authorName ? ` · ${featured.authorName}` : ""}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-lime">
                        Read article <ArrowRight className="size-4" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ) : null}

              {/* Grid */}
              {rest.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={(i % 3) * 0.06}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-colors hover:border-lime/50"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {post.coverImageUrl ? (
                            <Image
                              src={post.coverImageUrl}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full bg-surface" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          {post.category ? (
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-lime">
                              {post.category}
                            </p>
                          ) : null}
                          <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">
                            {post.excerpt}
                          </p>
                          <p className="mt-4 flex items-center gap-2 text-xs text-faint">
                            <CalendarDays className="size-3.5" aria-hidden />
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString("en-PK", {
                                  dateStyle: "medium",
                                })
                              : ""}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <Reveal>
              <div className="mx-auto max-w-xl rounded-lg border border-dashed border-titanium bg-obsidian/40 p-10 text-center">
                <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-faint">
                  [PLACEHOLDER]
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  Articles are coming — training tips, nutrition notes and
                  member stories, written by the coaches. They appear here the
                  moment the first one is published.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
