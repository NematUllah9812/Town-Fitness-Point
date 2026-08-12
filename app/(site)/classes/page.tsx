import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { ClassesGrid } from "@/components/marketing/classes-grid";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getClasses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Classes & Programs",
  description:
    "Eight coached programs at Town Fitness Point: Strength, HIIT, Boxing, Yoga & Mobility, Spin and more. Every class scalable to your level.",
  alternates: { canonical: "/classes" },
};

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <>
      <PageHero
        kicker="Programs"
        title="Eight Ways to Train. One Standard."
        lede="Every program is coached, capped in size and scalable from your first session to competition prep. Filter by what you want to work on."
      />
      <section className="py-16 md:py-24">
        <Container>
          <ClassesGrid classes={classes} />
        </Container>
      </section>
      <section className="border-t border-hairline">
        <Container className="py-16 text-center md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Not sure where to start?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
              Book a free session and a coach will place you — right program,
              right intensity, right day.
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
