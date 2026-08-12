import { ArrowRight, UserRound } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { TrainerCard } from "@/components/marketing/trainer-card";
import type { Trainer } from "@/lib/types";

/**
 * Trainers preview. Real coach profiles are added via the admin panel.
 * Until real trainers exist, honest placeholder cards are shown —
 * no invented coach bios.
 */
export function TrainersPreview({ trainers }: { trainers: Trainer[] }) {
  return (
    <section className="border-t border-hairline bg-surface/40 py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            kicker="Coaches"
            title="Meet the Team Behind the Floor"
            lede="Every coach is certified, and every session is programmed. No floor is better than the people on it."
          />
          <Reveal delay={0.1}>
            <ButtonLink href="/trainers" variant="outline">
              All Trainers <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.length > 0 ? (
            trainers.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.08}>
                <TrainerCard trainer={t} />
              </Reveal>
            ))
          ) : (
            [0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex h-full min-h-72 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-titanium bg-obsidian p-8 text-center">
                  <UserRound className="size-10 text-titanium" aria-hidden />
                  <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-faint">
                    [PLACEHOLDER]
                  </p>
                  <p className="max-w-56 text-sm leading-relaxed text-mist">
                    Real trainer profiles will appear here once added in the
                    admin panel.
                  </p>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
