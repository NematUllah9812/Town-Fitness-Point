import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PlanCard } from "@/components/marketing/plan-card";
import { PlanComparison } from "@/components/marketing/plan-comparison";
import { MembershipInquiryForm } from "@/components/forms/membership-inquiry-form";
import { getPlans } from "@/lib/content";

export const metadata: Metadata = {
  title: "Membership & Pricing",
  description:
    "Three membership levels at Town Fitness Point — Essential, Pro and Elite. Transparent plans, no hidden fees, every plan starts with a free session.",
  alternates: { canonical: "/membership" },
};

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const [{ plan }, plans] = await Promise.all([searchParams, getPlans()]);
  const initialPlan = plan && plans.some((p) => p.slug === plan) ? plan : undefined;

  return (
    <>
      <PageHero
        kicker="Membership"
        title="Choose Your Level"
        lede="Three plans, one standard. Transparent pricing, no hidden fees, and every membership starts with a free trial session."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <PlanCard plan={p} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="kicker">Compare</p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Every Plan, Side by Side
                </h2>
              </div>
              <p className="text-sm text-faint">
                Prices in PKR — set by the gym. All plans include a free trial session.
              </p>
            </div>
            <PlanComparison plans={plans} />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-hairline bg-surface/40 py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <div>
                <p className="kicker">Start now</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Not Sure Which Plan Fits?
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
                  Tell us where you are and where you want to be. A membership
                  advisor will call you back within 24 hours with a straight
                  answer — no upsell, no pressure.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-mist">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                    Every plan starts with a free trial session.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                    No lock-in contracts — month to month, cancel anytime.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden />
                    Family and student rates available on request.
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <MembershipInquiryForm plans={plans} initialPlan={initialPlan} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
