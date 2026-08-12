import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Town Fitness Point — a premium strength & conditioning facility. Our story, mission and values, and the standard we hold on the floor.",
  alternates: { canonical: "/about" },
};

const GALLERY = [
  { src: "/images/hero.jpg", alt: "The main training floor" },
  { src: "/images/classes/strength.jpg", alt: "Barbell and rack area" },
  { src: "/images/classes/hiit.jpg", alt: "Conditioning zone" },
  { src: "/images/classes/boxing.jpg", alt: "Combat area" },
];

/**
 * About page. Business facts (story, founder, certifications) are honest
 * placeholders until the gym provides them — no invented claims. Mission
 * text is brand draft copy, flagged as such below the section.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About Town Fitness Point"
        title="Built Around One Standard: Yours."
        lede="Premium equipment, real coaching and a floor that holds everyone to the same standard — show up, do the work, get better."
      />

      {/* Story */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative">
                <Image
                  src="/images/hero.jpg"
                  alt="Town Fitness Point training floor"
                  width={900}
                  height={600}
                  className="aspect-[3/2] w-full rounded-lg border border-hairline object-cover"
                />
                <div className="absolute -bottom-6 -right-4 hidden w-48 overflow-hidden rounded-lg border border-hairline shadow-2xl md:block">
                  <Image
                    src="/images/classes/strength.jpg"
                    alt="Training in progress"
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="kicker">Our story</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  From Idea to the Floor
                </h2>
                <div className="mt-6 space-y-4">
                  <PlaceholderPanel label="Gym story">
                    <p className="max-w-lg">
                      [ADD GYM STORY — who started Town Fitness Point, when and
                      why, what the gym looked like at the beginning, and what
                      has changed since. We will publish exactly what you write
                      — nothing invented.]
                    </p>
                  </PlaceholderPanel>
                  <PlaceholderPanel label="Founding date">
                    <p>
                      [ADD FOUNDING YEAR] · [ADD CITY] — the standard started here.
                    </p>
                  </PlaceholderPanel>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Mission / Vision / Values */}
      <section className="border-t border-hairline bg-surface/40 py-16 md:py-24">
        <Container>
          <Reveal>
            <p className="kicker text-center">What we stand for</p>
            <h2 className="mx-auto mt-3 max-w-xl text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
              The Standard We Train To
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Mission",
                body: "Make premium training accessible to everyone in our city — with coaching that treats every member like an athlete, from the first session on.",
              },
              {
                title: "Vision",
                body: "A community where showing up consistently is the norm, progress is tracked, and the standard never drops.",
              },
              {
                title: "Values",
                body: "Discipline, honesty and community. We do what we say, and we hold you to the same standard.",
              },
            ].map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="h-full rounded-lg border border-hairline bg-obsidian p-8">
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    <span className="text-lime">{String(i + 1).padStart(2, "0")}.</span> {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <p className="text-center text-xs text-faint">
              Draft mission copy — final wording to be confirmed by the gym.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Facility preview */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <p className="kicker">The floor</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              A Facility Built to Train In
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GALLERY.map((img, i) => (
              <Reveal key={img.src} delay={i * 0.06}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={450}
                  className="aspect-[4/3] w-full rounded-lg border border-hairline object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-4">
            <p className="text-xs text-faint">
              Concept imagery — real facility photos will replace these.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Founder message */}
      <section className="border-t border-hairline py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <div className="mx-auto flex size-64 items-center justify-center rounded-lg border border-dashed border-titanium bg-surface text-center">
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-faint">
                  [ADD FOUNDER PHOTO]
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="kicker">From the founder</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  A Message from {`[ADD FOUNDER NAME]`}
                </h2>
                <div className="mt-6">
                  <PlaceholderPanel label="Founder message">
                    <p className="max-w-xl">
                      [ADD FOUNDER MESSAGE — why you built this gym, what you
                      believe about training, and what members can expect when
                      they walk through the door.]
                    </p>
                  </PlaceholderPanel>
                </div>
                <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.2em] text-faint">
                  [ADD FOUNDER NAME] — Founder, Town Fitness Point
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Certifications strip */}
      <section className="border-t border-hairline bg-surface/40 py-14">
        <Container>
          <Reveal>
            <PlaceholderPanel label="Certifications & affiliations" className="mx-auto max-w-3xl text-center">
              <p>
                [ADD CERTIFICATIONS AND AFFILIATIONS — e.g. coaching
                certifications, federation memberships, community partners.]
              </p>
            </PlaceholderPanel>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
