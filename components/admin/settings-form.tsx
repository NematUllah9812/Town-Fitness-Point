"use client";

import { adminUpdateSettings } from "@/lib/admin-actions";
import { AdminInput, AdminSubmit, AdminTextarea, Field } from "@/components/admin/fields";
import type { SiteSettings } from "@/lib/types";

/**
 * Site settings editor — the single place real business facts get filled
 * in. Every field maps to a site_settings row; empty = the site renders
 * a labeled [ADD …] placeholder.
 */
export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const s = settings;
  return (
    <form action={adminUpdateSettings} className="mt-8 space-y-8">
      {/* Business */}
      <Section title="Business">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name">
            <AdminInput name="businessName" maxLength={80} defaultValue={s.business.name} />
          </Field>
          <Field label="Tagline">
            <AdminInput name="businessTagline" maxLength={120} defaultValue={s.business.tagline} />
          </Field>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact information">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" hint="Leave blank → site shows [ADD PHONE NUMBER]">
            <AdminInput name="contactPhone" maxLength={24} defaultValue={s.contact.phone ?? ""} placeholder="0300-1234567" />
          </Field>
          <Field label="Email">
            <AdminInput name="contactEmail" type="email" maxLength={160} defaultValue={s.contact.email ?? ""} />
          </Field>
          <Field label="Address">
            <AdminInput name="contactAddress" maxLength={200} defaultValue={s.contact.address ?? ""} />
          </Field>
          <Field label="City" hint="Used for local SEO + map embed">
            <AdminInput name="contactCity" maxLength={80} defaultValue={s.contact.city ?? ""} />
          </Field>
        </div>
      </Section>

      {/* Hours */}
      <Section title="Opening hours">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Weekdays (e.g. 6:00 AM – 11:00 PM)">
            <AdminInput name="hoursWeekdays" maxLength={80} defaultValue={s.hours.weekdays ?? ""} />
          </Field>
          <Field label="Weekend">
            <AdminInput name="hoursWeekend" maxLength={80} defaultValue={s.hours.weekend ?? ""} />
          </Field>
        </div>
      </Section>

      {/* Socials */}
      <Section title="Social links">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Instagram">
            <AdminInput name="socialInstagram" type="url" maxLength={200} defaultValue={s.socials.instagram ?? ""} />
          </Field>
          <Field label="Facebook">
            <AdminInput name="socialFacebook" type="url" maxLength={200} defaultValue={s.socials.facebook ?? ""} />
          </Field>
          <Field label="YouTube">
            <AdminInput name="socialYoutube" type="url" maxLength={200} defaultValue={s.socials.youtube ?? ""} />
          </Field>
          <Field label="TikTok">
            <AdminInput name="socialTiktok" type="url" maxLength={200} defaultValue={s.socials.tiktok ?? ""} />
          </Field>
        </div>
      </Section>

      {/* Stats — REAL numbers only */}
      <Section title="Home page stats" hint="Real numbers only — if unsure, leave blank; the site shows [ADD].">
        <div className="grid gap-5 sm:grid-cols-4">
          <Field label="Active members">
            <AdminInput name="statsMembers" type="number" min={0} defaultValue={s.stats.members ?? ""} />
          </Field>
          <Field label="Certified coaches">
            <AdminInput name="statsTrainers" type="number" min={0} defaultValue={s.stats.trainers ?? ""} />
          </Field>
          <Field label="Years running">
            <AdminInput name="statsYears" type="number" min={0} defaultValue={s.stats.years ?? ""} />
          </Field>
          <Field label="Classes / week">
            <AdminInput name="statsClassesPerWeek" type="number" min={0} defaultValue={s.stats.classesPerWeek ?? ""} />
          </Field>
        </div>
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <Field label="About text">
          <AdminTextarea name="footerAbout" rows={3} maxLength={400} defaultValue={s.footer.about} />
        </Field>
      </Section>

      <AdminSubmit label="Save all settings" />
    </form>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-hairline bg-surface p-6">
      <h2 className="font-display text-base font-bold">{title}</h2>
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
