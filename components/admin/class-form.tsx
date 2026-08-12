"use client";

import { adminUpsertClass } from "@/lib/admin-actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminSubmit,
  AdminTextarea,
  Field,
} from "@/components/admin/fields";
import type { GymClass } from "@/lib/types";

export function ClassForm({ cls }: { cls?: GymClass | null }) {
  return (
    <form
      action={adminUpsertClass}
      className="mt-8 max-w-2xl space-y-6 rounded-lg border border-hairline bg-surface p-8"
    >
      {cls ? <input type="hidden" name="id" value={cls.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Class name">
          <AdminInput name="name" required maxLength={100} defaultValue={cls?.name} />
        </Field>
        <Field label="Slug (leave blank to auto-generate)">
          <AdminInput name="slug" maxLength={80} defaultValue={cls?.slug} placeholder="auto" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Category">
          <AdminSelect name="category" defaultValue={cls?.category ?? "strength"}>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="combat">Combat</option>
            <option value="mind_body">Mind & Body</option>
            <option value="functional">Functional</option>
          </AdminSelect>
        </Field>
        <Field label="Difficulty">
          <AdminSelect name="difficulty" defaultValue={cls?.difficulty ?? "beginner"}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </AdminSelect>
        </Field>
        <Field label="Duration (minutes)">
          <AdminInput name="durationMin" type="number" min={10} max={240} defaultValue={cls?.durationMin ?? 60} />
        </Field>
      </div>

      <Field label="Description">
        <AdminTextarea name="description" rows={4} maxLength={1000} defaultValue={cls?.description} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Est. calorie burn (optional)">
          <AdminInput name="calorieBurnEst" type="number" min={0} defaultValue={cls?.calorieBurnEst ?? ""} />
        </Field>
        <Field label="Sort order">
          <AdminInput name="sortOrder" type="number" defaultValue={cls?.sortOrder ?? 0} />
        </Field>
        <Field label="Image URL (optional)">
          <AdminInput name="imageUrl" type="url" maxLength={500} defaultValue={cls?.imageUrl ?? ""} placeholder="https://…" />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <AdminCheckbox name="featured" label="Featured (shown on home page)" defaultChecked={cls?.featured} />
        <AdminCheckbox name="active" label="Active (visible on site)" defaultChecked={cls?.active ?? true} />
      </div>

      <div className="flex items-center gap-4">
        <AdminSubmit label={cls ? "Save changes" : "Create class"} />
        <a href="/admin/classes" className="text-sm text-mist underline-offset-4 hover:text-ink hover:underline">
          Cancel
        </a>
      </div>
    </form>
  );
}
