import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Marquee } from "@/components/marketing/marquee";
import { StatsBar } from "@/components/marketing/stats-bar";
import { WhyUs } from "@/components/marketing/why-us";
import { ClassesPreview } from "@/components/marketing/classes-preview";
import { TrainersPreview } from "@/components/marketing/trainers-preview";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { TestimonialsPreview } from "@/components/marketing/testimonials-preview";
import { FinalCta } from "@/components/marketing/final-cta";
import {
  getFeaturedClasses,
  getFeaturedTrainers,
  getFeaturedTestimonials,
  getPlans,
  getSiteSettings,
} from "@/lib/content";
import { localBusinessSchema, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Town Fitness Point — Premium Gym & Fitness Center",
  description:
    "Premium gym and fitness center. Elite coaching, pro-grade equipment and small-group classes. Book your free session at Town Fitness Point.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [classes, trainers, plans, testimonials, settings] = await Promise.all([
    getFeaturedClasses(4),
    getFeaturedTrainers(3),
    getPlans(),
    getFeaturedTestimonials(2),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero />
      <Marquee />
      <StatsBar stats={settings.stats} />
      <WhyUs />
      <ClassesPreview classes={classes} />
      <TrainersPreview trainers={trainers} />
      <PricingPreview plans={plans} />
      <TestimonialsPreview testimonials={testimonials} />
      <FinalCta />

      {/* LocalBusiness structured data — placeholders until real facts are set.
          jsonLdScript escapes < > & so admin-set strings can't break out. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema(settings)) }}
      />
    </>
  );
}
