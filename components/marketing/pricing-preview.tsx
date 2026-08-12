import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { PlanCard } from "@/components/marketing/plan-card";
import type { MembershipPlan } from "@/lib/types";

export function PricingPreview({ plans }: { plans: MembershipPlan[] }) {
  return (
    <section className="bg-obsidian py-24 md:py-32">
      <Container>
        <SectionHeading
          kicker="Membership"
          title="Choose Your Level"
          lede="Transparent plans, no hidden fees. Prices are set by the gym — every plan starts with a free session."
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.08}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-faint">
            Prices in PKR — set by the gym in the admin panel. All plans include a free trial session.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
