import Link from "next/link";
import { Dumbbell, Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/content";
import { NAV_LINKS } from "@/lib/site";
import { NewsletterForm } from "@/components/forms/newsletter-form";

/** Site footer — logo, quick links, classes, contact, newsletter, socials. */
export async function Footer() {
  const settings = await getSiteSettings();
  const { contact, hours, socials, footer } = settings;

  const socialLinks = [
    { href: socials.instagram, label: "Instagram", Icon: Instagram },
    { href: socials.facebook, label: "Facebook", Icon: Facebook },
    { href: socials.youtube, label: "YouTube", Icon: Youtube },
  ];

  return (
    <footer className="border-t border-hairline bg-obsidian">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="Town Fitness Point — home">
            <span className="flex size-9 items-center justify-center rounded-md bg-lime text-obsidian">
              <Dumbbell className="size-5" aria-hidden />
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-[0.18em]">
              Town <span className="text-lime">Fitness</span> Point
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">{footer.about}</p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map(({ href, label, Icon }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-md border border-titanium text-mist transition hover:border-lime hover:text-lime"
                >
                  <Icon className="size-4.5" aria-hidden />
                </a>
              ) : (
                <span
                  key={label}
                  title={`[ADD ${label.toUpperCase()} URL]`}
                  className="flex size-10 cursor-not-allowed items-center justify-center rounded-md border border-hairline text-faint"
                  aria-label={`${label} — link pending`}
                >
                  <Icon className="size-4.5" aria-hidden />
                </span>
              )
            )}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer — quick links">
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-mist">Explore</h3>
          <ul className="mt-5 space-y-2.5">
            {[...NAV_LINKS, { href: "/gallery", label: "Gallery" }, { href: "/blog", label: "Blog" }].map(
              (l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-mist transition hover:text-lime">
                    {l.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-mist">Contact</h3>
          <ul className="mt-5 space-y-3 text-sm text-mist">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden />
              <span>{contact.address ?? "[ADD GYM ADDRESS]"}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-lime" aria-hidden />
              <a href={`tel:${contact.phone ?? ""}`} className={contact.phone ? "transition hover:text-lime" : "cursor-not-allowed"}>
                {contact.phone ?? "[ADD PHONE NUMBER]"}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-lime" aria-hidden />
              <a href={`mailto:${contact.email ?? ""}`} className={contact.email ? "transition hover:text-lime" : "cursor-not-allowed"}>
                {contact.email ?? "[ADD EMAIL ADDRESS]"}
              </a>
            </li>
          </ul>
          <div className="mt-5 space-y-1 border-t border-hairline pt-4 text-xs text-faint">
            <p>Mon–Fri: {hours.weekdays ?? "[ADD HOURS]"}</p>
            <p>Sat–Sun: {hours.weekend ?? "[ADD HOURS]"}</p>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-mist">
            Training tips. Zero spam.
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-mist">
            One email a week — programming tips, nutrition notes and gym news.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Town Fitness Point. All rights reserved.</p>
          <p>Strength is built here.</p>
        </div>
      </div>
    </footer>
  );
}
