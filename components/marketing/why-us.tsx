import { Dumbbell, ShieldCheck, Users, Sparkles, Clock, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const REASONS = [
  {
    Icon: Dumbbell,
    title: "Elite Coaching",
    body: "Certified coaches who coach, not count reps. Every program is periodized and personal.",
  },
  {
    Icon: ShieldCheck,
    title: "Pro-Grade Equipment",
    body: "Commercial-standard racks, plates and machines, maintained daily.",
  },
  {
    Icon: Users,
    title: "Small-Group Energy",
    body: "Capped class sizes keep coaching personal and the floor safe.",
  },
  {
    Icon: Sparkles,
    title: "Spotless Facilities",
    body: "Daily deep-cleaned floor, showers and changing rooms. Always.",
  },
  {
    Icon: Clock,
    title: "Extended Hours",
    body: "Train when it suits you — early mornings to late nights.",
  },
  {
    Icon: TrendingUp,
    title: "Real Results",
    body: "Progress tracking, check-ins and programming built around your goal.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-obsidian py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Why Town Fitness Point"
          title="Built for People Who Show Up"
          lede="Everything on this floor exists for one reason: to move you measurably closer to your goal, every single session."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08} className="bg-obsidian">
              <div className="group h-full p-8 transition-colors duration-300 hover:bg-surface">
                <Icon
                  className="size-7 text-lime transition-transform duration-300 group-hover:-translate-y-1"
                  aria-hidden
                />
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
