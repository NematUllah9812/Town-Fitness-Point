import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { getSiteSettings } from "@/lib/content";
import { faqSchema, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Town Fitness Point — visit the gym, call us, or send a message. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  {
    q: "How do I book a free trial session?",
    a: "Hit the 'Book Your Free Session' button anywhere on the site, fill in your details, and a coach will call you within 24 hours to confirm your time.",
  },
  {
    q: "Do I need to be fit to join?",
    a: "No. Every class is scalable — coaches adjust intensity to your level, from first session to competition prep.",
  },
  {
    q: "What should I bring on my first day?",
    a: "Training clothes, indoor shoes and a water bottle. Everything else — equipment, programming, coaching — is on the floor.",
  },
  {
    q: "Is there a joining fee or contract?",
    a: "Memberships are month-to-month with no lock-in. Prices are set by the gym — ask us for today's rates.",
  },
  {
    q: "Do you offer personal training?",
    a: "Yes — one-on-one coaching is part of the Elite plan and available as a standalone add-on. Ask at the front desk or via this form.",
  },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const { contact, hours } = settings;

  const mapQuery =
    [contact.address, contact.city].filter(Boolean).join(", ") || "Pakistan";

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Walk In. Call. Write."
        lede="The fastest way to get answers is to show up — but phone, email and this form all land on the same desk."
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            {/* Info column */}
            <Reveal>
              <div className="space-y-6">
                <div className="rounded-xl border border-hairline bg-surface p-7">
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-mist">
                    Visit
                  </h2>
                  <p className="mt-4 flex items-start gap-3 text-mist">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-lime" aria-hidden />
                    <span>
                      {contact.address ?? "[ADD GYM ADDRESS]"}
                      {contact.city ? <span className="block">{contact.city}</span> : null}
                    </span>
                  </p>
                  <p className="mt-4 flex items-start gap-3 text-mist">
                    <Clock className="mt-0.5 size-5 shrink-0 text-lime" aria-hidden />
                    <span>
                      Mon–Fri: {hours.weekdays ?? "[ADD HOURS]"}
                      <span className="block">Sat–Sun: {hours.weekend ?? "[ADD HOURS]"}</span>
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-hairline bg-surface p-7">
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-mist">
                    Talk to us
                  </h2>
                  <p className="mt-4 flex items-center gap-3 text-mist">
                    <Phone className="size-5 shrink-0 text-lime" aria-hidden />
                    <a href={`tel:${contact.phone ?? ""}`} className={contact.phone ? "hover:text-lime" : "cursor-not-allowed"}>
                      {contact.phone ?? "[ADD PHONE NUMBER]"}
                    </a>
                  </p>
                  <p className="mt-4 flex items-center gap-3 text-mist">
                    <Mail className="size-5 shrink-0 text-lime" aria-hidden />
                    <a href={`mailto:${contact.email ?? ""}`} className={contact.email ? "hover:text-lime" : "cursor-not-allowed"}>
                      {contact.email ?? "[ADD EMAIL ADDRESS]"}
                    </a>
                  </p>
                </div>

                {/* Map — points at the address once set in admin settings */}
                <div className="overflow-hidden rounded-xl border border-hairline">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                    title="Map to Town Fitness Point"
                    loading="lazy"
                    className="h-72 w-full border-0 bg-surface"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <p className="border-t border-hairline bg-surface px-4 py-2.5 text-xs text-faint">
                    {contact.address
                      ? "Map pinned to the gym address."
                      : "Map shows a general location until the gym address is set in admin → Settings."}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Form column */}
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-hairline bg-surface/40 py-16 md:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <p className="kicker text-center">FAQ</p>
            <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
              Before You Ask
            </h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.05}>
                <details className="group rounded-lg border border-hairline bg-obsidian">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 font-display text-sm font-bold tracking-tight marker:hidden">
                    {faq.q}
                    <span className="text-lime transition-transform duration-200 group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-5 text-sm leading-relaxed text-mist">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      {/* FAQ structured data (escaped — no script breakout possible) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema(FAQS)) }}
      />
    </>
  );
}
