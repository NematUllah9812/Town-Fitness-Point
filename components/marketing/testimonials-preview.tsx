import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import type { Testimonial } from "@/lib/types";

/**
 * Testimonials preview. REAL member stories only — added via the admin
 * panel. Until the first story is published, an honest empty state is
 * shown. No invented success stories.
 */
export function TestimonialsPreview({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="border-t border-hairline bg-surface/40 py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Member Stories"
          title="Results, Not Promises"
          lede="Real members. Real numbers. Published straight from the floor."
          align="center"
        />

        <div className="mt-14">
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.slice(0, 2).map((t, i) => (
                <Reveal key={t.id} delay={i * 0.08}>
                  <figure className="h-full rounded-xl border border-hairline bg-surface p-8">
                    <Quote className="size-8 text-lime" aria-hidden />
                    <blockquote className="mt-4 text-lg leading-relaxed text-ink">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                      <span className="flex size-11 items-center justify-center rounded-full bg-titanium font-display text-sm font-bold">
                        {t.memberName.slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{t.memberName}</p>
                        <p className="text-xs text-mist">{t.resultSummary ?? t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-xl border border-dashed border-titanium bg-obsidian p-10 text-center">
                <Quote className="size-8 text-titanium" aria-hidden />
                <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-faint">
                  [PLACEHOLDER]
                </p>
                <p className="text-sm leading-relaxed text-mist">
                  Member stories will appear here — real results from real
                  members, published from the admin panel.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal className="mt-10 text-center" delay={0.1}>
          <ButtonLink href="/testimonials" variant="outline">
            Read Member Stories
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
