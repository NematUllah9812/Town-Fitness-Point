import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { ButtonLink } from "@/components/ui/button";
import { getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Member Stories",
  description:
    "Real results from real members at Town Fitness Point. Stories are published from the gym — nothing invented.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const hero = testimonials.find((t) => t.featured) ?? null;
  const gridList = testimonials.filter((t) => t !== hero);
  const heroCompanions = testimonials.filter((t) => t !== hero && t.featured);

  return (
    <>
      <PageHero
        kicker="Member Stories"
        title="Results, Not Promises"
        lede="Real members, real numbers, published straight from the gym. Your story belongs here too."
      />
      <section className="py-16 md:py-24">
        <Container>
          {testimonials.length > 0 ? (
            <div className="space-y-14">
              {hero ? (
                <Reveal>
                  <figure className="grid items-center gap-8 rounded-2xl border border-lime/30 bg-surface p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
                    <div>
                      <p className="kicker">Featured story</p>
                      <blockquote className="mt-4 text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
                        “{hero.quote}”
                      </blockquote>
                      {hero.resultSummary ? (
                        <p className="mt-5 text-sm font-bold uppercase tracking-wider text-lime">
                          {hero.resultSummary}
                        </p>
                      ) : null}
                      <figcaption className="mt-6 flex items-center gap-3">
                        <span className="flex size-12 items-center justify-center rounded-full bg-titanium font-display text-base font-bold">
                          {hero.memberName.slice(0, 1)}
                        </span>
                        <div>
                          <p className="font-semibold">{hero.memberName}</p>
                          <p className="text-sm text-mist">{hero.role ?? "Member"}</p>
                        </div>
                      </figcaption>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {heroCompanions.slice(0, 2).map((t) => (
                        <TestimonialCard key={t.id} testimonial={t} />
                      ))}
                    </div>
                  </figure>
                </Reveal>
              ) : null}

              {gridList.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {gridList.map((t, i) => (
                    <Reveal key={t.id} delay={(i % 3) * 0.06}>
                      <TestimonialCard testimonial={t} />
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
                  Member stories will appear here — real results from real
                  members, published from the admin panel. We do not invent
                  testimonials.
                </p>
              </div>
            </Reveal>
          )}

          <Reveal className="mt-14 text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Your Story Starts Here
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
              First session is free. The results are up to you — the standard
              is on us.
            </p>
            <ButtonLink href="/membership" variant="primary" className="mt-8">
              Start Your Transformation
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
