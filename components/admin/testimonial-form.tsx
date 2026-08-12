"use client";

import { adminUpsertTestimonial } from "@/lib/admin-actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminSubmit,
  AdminTextarea,
  Field,
} from "@/components/admin/fields";
import type { Testimonial } from "@/lib/types";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial | null }) {
  return (
    <form
      action={adminUpsertTestimonial}
      className="mt-8 max-w-2xl space-y-6 rounded-lg border border-hairline bg-surface p-8"
    >
      {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Member name">
          <AdminInput name="memberName" required maxLength={100} defaultValue={testimonial?.memberName} />
        </Field>
        <Field label="Role (e.g. 'Member since 2024')">
          <AdminInput name="role" maxLength={100} defaultValue={testimonial?.role ?? ""} />
        </Field>
        <Field label="Rating">
          <AdminSelect name="rating" defaultValue={testimonial?.rating ?? 5}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </AdminSelect>
        </Field>
      </div>

      <Field label="Quote">
        <AdminTextarea name="quote" rows={4} required maxLength={1000} defaultValue={testimonial?.quote} />
      </Field>

      <Field label="Result summary (e.g. 'Lost 18 kg in 6 months' — real results only)">
        <AdminInput name="resultSummary" maxLength={200} defaultValue={testimonial?.resultSummary ?? ""} />
      </Field>

      <Field label="Photo URL (optional)">
        <AdminInput name="photoUrl" type="url" maxLength={500} defaultValue={testimonial?.photoUrl ?? ""} placeholder="https://…" />
      </Field>

      <div className="flex flex-wrap gap-6">
        <AdminCheckbox name="published" label="Published (visible on site)" defaultChecked={testimonial?.published} />
        <AdminCheckbox name="featured" label="Featured (home page)" defaultChecked={testimonial?.featured} />
      </div>

      <div className="flex items-center gap-4">
        <AdminSubmit label={testimonial ? "Save changes" : "Create testimonial"} />
        <a href="/admin/testimonials" className="text-sm text-mist underline-offset-4 hover:text-ink hover:underline">
          Cancel
        </a>
      </div>
    </form>
  );
}
