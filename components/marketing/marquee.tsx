const ITEMS = [
  "Strength",
  "HIIT",
  "Boxing",
  "Yoga & Mobility",
  "Spin",
  "CrossFit-Style WOD",
  "Functional Training",
  "Personal Training",
];

/**
 * Class-name ticker — pure CSS marquee (paused under
 * prefers-reduced-motion). Duplicated content is aria-hidden.
 */
export function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-hairline bg-surface py-4"
      aria-label="Class programs: Strength, HIIT, Boxing, Yoga and Mobility, Spin, CrossFit-Style WOD, Functional Training, Personal Training"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="mx-6 flex items-center gap-6 font-display text-sm font-bold uppercase tracking-[0.2em] text-faint"
              >
                {item}
                <span className="size-1.5 rounded-full bg-lime" aria-hidden />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
