import { Reveal } from "@/components/ui/reveal";
import type { SiteSettings } from "@/lib/types";

/**
 * Stats bar. Renders REAL numbers only — values come from admin-editable
 * site settings; until the owner provides them, clearly-marked
 * [ADD] placeholders are shown. No invented statistics, ever.
 */
export function StatsBar({ stats }: { stats: SiteSettings["stats"] }) {
  const items: { label: string; value: number | null }[] = [
    { label: "Active Members", value: stats.members },
    { label: "Certified Coaches", value: stats.trainers },
    { label: "Years Running", value: stats.years },
    { label: "Classes / Week", value: stats.classesPerWeek },
  ];

  return (
    <section className="border-b border-hairline bg-obsidian">
      <div className="container-x grid grid-cols-2 divide-x divide-hairline lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08} className="px-4 py-12 text-center lg:py-16">
            <p className="font-display text-4xl font-extrabold tracking-tight text-lime md:text-5xl">
              {item.value ?? "[ADD]"}
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-mist">
              {item.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
