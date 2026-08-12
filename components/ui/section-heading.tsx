import { Reveal } from "@/components/ui/reveal";

/**
 * Editorial section heading: kicker + title + optional lede.
 * Strong size contrast is the "premium editorial" signature.
 */
export function SectionHeading({
  kicker,
  title,
  lede,
  align = "left",
}: {
  kicker: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}
    >
      <p className="kicker">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {lede ? (
        <p className={`mt-4 text-base leading-relaxed text-mist md:text-lg ${centered ? "mx-auto" : ""}`}>
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
