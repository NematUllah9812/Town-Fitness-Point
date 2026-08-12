import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { TrainerCard } from "@/components/marketing/trainer-card";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";
import { getTrainers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Trainers",
  description:
    "Meet the certified coaching team at Town Fitness Point — specialties, certifications and experience. Profiles are added as the team grows.",
  alternates: { canonical: "/trainers" },
};

export default async function TrainersPage() {
  const trainers = await getTrainers();

  return (
    <>
      <PageHero
        kicker="Coaches"
        title="Coached Like an Athlete, Every Session"
        lede="Certified coaches, real programming, zero guesswork. Meet the people who run the floor."
      />
      <section className="py-16 md:py-24">
        <Container>
          {trainers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainers.map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 0.08}>
                  <TrainerCard trainer={t} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <PlaceholderPanel label="Trainer profiles">
                <p className="max-w-xl">
                  The coaching team is being finalized. Each profile will
                  include certifications, specialties and years of experience
                  — added here from the admin panel as the team is confirmed.
                  No invented bios, ever.
                </p>
              </PlaceholderPanel>
            </Reveal>
          )}
        </Container>
      </section>
      <section className="border-t border-hairline">
        <Container className="py-16 text-center md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Train with a coach who watches every rep.
            </h2>
            <ButtonLink href="/contact" variant="primary" className="mt-8">
              Talk to Us
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
