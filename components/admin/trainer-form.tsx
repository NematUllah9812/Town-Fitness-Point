"use client";

import { adminUpsertTrainer } from "@/lib/admin-actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSubmit,
  AdminTextarea,
  Field,
} from "@/components/admin/fields";
import type { Trainer } from "@/lib/types";

export function TrainerForm({ trainer }: { trainer?: Trainer | null }) {
  return (
    <form
      action={adminUpsertTrainer}
      className="mt-8 max-w-2xl space-y-6 rounded-lg border border-hairline bg-surface p-8"
    >
      {trainer ? (
        <input type="hidden" name="id" value={trainer.id} />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name">
          <AdminInput name="name" required maxLength={100} defaultValue={trainer?.name} />
        </Field>
        <Field label="Slug (leave blank to auto-generate)">
          <AdminInput name="slug" maxLength={80} defaultValue={trainer?.slug} placeholder="auto" />
        </Field>
      </div>

      <Field label="Specialty">
        <AdminInput name="specialty" maxLength={100} defaultValue={trainer?.specialty} placeholder="e.g. Strength & Conditioning" />
      </Field>

      <Field label="Bio">
        <AdminTextarea name="bio" rows={4} maxLength={1000} defaultValue={trainer?.bio} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Certifications (comma-separated)">
          <AdminInput
            name="certifications"
            defaultValue={trainer?.certifications.join(", ")}
            placeholder="NSCA-CPT, CrossFit L2"
          />
        </Field>
        <Field label="Years of experience">
          <AdminInput
            name="experienceYears"
            type="number"
            min={0}
            max={60}
            defaultValue={trainer?.experienceYears ?? ""}
          />
        </Field>
        <Field label="Sort order">
          <AdminInput name="sortOrder" type="number" defaultValue={trainer?.sortOrder ?? 0} />
        </Field>
      </div>

      <Field label="Photo URL (leave blank until real photos are provided)">
        <AdminInput
          name="photoUrl"
          type="url"
          maxLength={500}
          defaultValue={trainer?.photoUrl ?? ""}
          placeholder="https://…"
        />
      </Field>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-wider text-mist">
          Social links
        </legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminInput name="instagram" placeholder="Instagram URL" defaultValue={trainer?.socials.instagram ?? ""} />
          <AdminInput name="facebook" placeholder="Facebook URL" defaultValue={trainer?.socials.facebook ?? ""} />
          <AdminInput name="youtube" placeholder="YouTube URL" defaultValue={trainer?.socials.youtube ?? ""} />
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-6">
        <AdminCheckbox name="featured" label="Featured (shown on home page)" defaultChecked={trainer?.featured} />
        <AdminCheckbox name="active" label="Active (visible on site)" defaultChecked={trainer?.active ?? true} />
      </div>

      <div className="flex items-center gap-4">
        <AdminSubmit label={trainer ? "Save changes" : "Create trainer"} />
        <a href="/admin/trainers" className="text-sm text-mist underline-offset-4 hover:text-ink hover:underline">
          Cancel
        </a>
      </div>
    </form>
  );
}
