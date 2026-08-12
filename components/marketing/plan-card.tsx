import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { MembershipPlan } from "@/lib/types";

/** Shared pricing card — home preview and /membership use the same component. */
export function PlanCard({ plan }: { plan: MembershipPlan }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-xl border p-8 ${
        plan.popular
          ? "border-lime/70 bg-surface shadow-[0_0_60px_-20px_rgba(198,255,0,0.25)]"
          : "border-hairline bg-surface"
      }`}
    >
      {plan.popular ? (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-sm bg-lime px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.16em] text-obsidian">
          Most Popular
        </span>
      ) : null}
      <h3 className="font-display text-xl font-bold">{plan.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">{plan.tagline}</p>
      <p className="mt-6 font-display text-4xl font-extrabold tracking-tight">
        {plan.pricePkr !== null ? (
          <>
            Rs {plan.pricePkr.toLocaleString("en-PK")}
            <span className="ml-1 text-sm font-medium text-mist">/ {plan.period}</span>
          </>
        ) : (
          <span className="text-mist">Contact us</span>
        )}
      </p>
      <ul className="mt-8 space-y-3 border-t border-hairline pt-6 text-sm text-mist">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex-1" />
      <ButtonLink
        href={`/membership?plan=${plan.slug}`}
        variant={plan.popular ? "primary" : "outline"}
        className="w-full"
      >
        {plan.popular ? "Join the Elite" : "View Plan"}
      </ButtonLink>
    </article>
  );
}
