import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { GalleryGrid } from "@/components/marketing/gallery-grid";
import { getGalleryItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside Town Fitness Point — the floor, the equipment, the classes and the community. Photos are added by the gym.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <PageHero
        kicker="Gallery"
        title="Inside the Facility"
        lede="The floor, the iron and the people. Photos are added by the gym as the facility grows — filter by what you want to see."
      />
      <section className="py-16 md:py-24">
        <Container>
          {items.length > 0 ? (
            <Reveal>
              <GalleryGrid items={items} />
            </Reveal>
          ) : (
            <Reveal>
              <div className="mx-auto max-w-xl rounded-lg border border-dashed border-titanium bg-obsidian/40 p-10 text-center">
                <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-faint">
                  [PLACEHOLDER]
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  Facility photos will appear here — added by the gym from the
                  admin panel. Real photos of the floor, equipment and classes,
                  not stock.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
