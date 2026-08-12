import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ClassCard } from "@/components/marketing/class-card";
import type { GymClass } from "@/lib/types";

export function ClassesPreview({ classes }: { classes: GymClass[] }) {
  return (
    <section className="bg-obsidian py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            kicker="Classes"
            title="Programs That Deliver"
            lede="Coached sessions with capped numbers, scalable to every level — from first session to competition prep."
          />
          <Reveal delay={0.1}>
            <ButtonLink href="/classes" variant="outline">
              All Classes <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {classes.map((cls, i) => (
            <Reveal key={cls.id} delay={(i % 4) * 0.08}>
              <ClassCard cls={cls} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
