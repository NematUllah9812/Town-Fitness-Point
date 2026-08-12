import { Check, Minus } from "lucide-react";
import type { MembershipPlan } from "@/lib/types";

/**
 * Feature comparison table derived from the plans' own `features` arrays
 * (identical strings across tiers = shared rows). No hardcoded matrix —
 * add a feature in admin and it appears here.
 */
function buildRows(plans: MembershipPlan[]) {
  const map = new Map<string, boolean[]>();
  plans.forEach((plan, planIndex) => {
    plan.features.forEach((feature) => {
      const row = map.get(feature) ?? Array<boolean>(plans.length).fill(false);
      row[planIndex] = true;
      map.set(feature, row);
    });
  });
  return [...map.entries()];
}

export function PlanComparison({ plans }: { plans: MembershipPlan[] }) {
  const rows = buildRows(plans);
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline bg-surface">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Membership plan feature comparison
        </caption>
        <thead>
          <tr className="border-b border-hairline">
            <th scope="col" className="px-6 py-5 font-display text-xs font-bold uppercase tracking-[0.18em] text-mist">
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={`px-6 py-5 text-center font-display text-sm font-bold ${
                  plan.popular ? "text-lime" : "text-ink"
                }`}
              >
                {plan.name}
                {plan.popular ? (
                  <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-lime">
                    Most popular
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([feature, included], i) => (
            <tr
              key={feature}
              className={i % 2 === 0 ? "bg-obsidian/40" : ""}
            >
              <th scope="row" className="px-6 py-4 font-normal text-mist">
                {feature}
              </th>
              {included.map((has, planIndex) => (
                <td key={planIndex} className="px-6 py-4 text-center">
                  {has ? (
                    <Check className="mx-auto size-4.5 text-lime" aria-label="Included" />
                  ) : (
                    <Minus className="mx-auto size-4 text-faint" aria-label="Not included" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
