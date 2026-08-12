import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/** Consistent sub-page hero: kicker + display title + lede. */
export function PageHero({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="border-b border-hairline bg-obsidian pb-16 pt-36 md:pb-20 md:pt-44">
      <Container>
        <Reveal>
          <p className="kicker">{kicker}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lede ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">{lede}</p>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
