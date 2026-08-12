/**
 * Schema.org builders — SportsActivityLocation / LocalBusiness,
 * FAQPage, Article. Unknown business facts render as clearly-marked
 * placeholders so the structured data is never "invented".
 *
 * SECURITY: jsonLdScript() escapes <, > and & as JSON unicode escapes so
 * admin-supplied strings (business name, address) can never break out of
 * the <script> tag. JSON.parse decodes \u003c back to <, so the data
 * remains correct after parsing.
 */
import type { BlogPost, SiteSettings } from "@/lib/types";

export function localBusinessSchema(settings: SiteSettings) {
  const { business, contact, socials } = settings;
  const sameAs = [socials.instagram, socials.facebook, socials.youtube, socials.tiktok]
    .filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: business.name,
    description: business.tagline,
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/images/hero.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address ?? "[ADD GYM ADDRESS]",
      addressLocality: contact.city ?? "[ADD CITY]",
      addressCountry: "PK",
    },
    telephone: contact.phone ?? "[ADD PHONE NUMBER]",
    email: contact.email ?? "[ADD EMAIL ADDRESS]",
    ...(sameAs.length > 0 ? { sameAs } : {}),
    openingHours: settings.hours.weekdays ?? "[ADD OPENING HOURS]",
    priceRange: "$$",
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(post: BlogPost, settings: SiteSettings) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ?? `${siteUrl}/images/hero.jpg`,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    author: {
      "@type": "Person",
      name: post.authorName ?? settings.business.name,
    },
    publisher: {
      "@type": "Organization",
      name: settings.business.name,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };
}

/**
 * Serialize structured data for embedding in a
 * <script type="application/ld+json"> tag. Escapes script-breaking
 * characters as JSON unicode escapes (safe for any admin-set string).
 */
export function jsonLdScript(schema: object): string {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
