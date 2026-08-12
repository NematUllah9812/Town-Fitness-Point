"use client";

import { adminUpsertScheduleEntry } from "@/lib/admin-actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminSubmit,
  Field,
} from "@/components/admin/fields";
import { WEEKDAYS } from "@/lib/site";
import type { GymClass, Trainer } from "@/lib/types";

/** Add / edit a weekly timetable entry. */
export function ScheduleEntryForm({
  classes,
  trainers,
}: {
  classes: GymClass[];
  trainers: Trainer[];
}) {
  return (
    <form
      action={adminUpsertScheduleEntry}
      className="rounded-lg border border-hairline bg-surface p-6"
    >
      <h2 className="font-display text-lg font-bold">Add a class to the timetable</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Class">
          <AdminSelect name="classId" required defaultValue="">
            <option value="" disabled>
              Select class…
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </AdminSelect>
        </Field>
        <Field label="Trainer (optional)">
          <AdminSelect name="trainerId" defaultValue="">
            <option value="">—</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </AdminSelect>
        </Field>
        <Field label="Day">
          <AdminSelect name="weekday" defaultValue="0">
            {WEEKDAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </AdminSelect>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start">
            <AdminInput name="startTime" type="time" required defaultValue="18:00" />
          </Field>
          <Field label="End">
            <AdminInput name="endTime" type="time" required defaultValue="19:00" />
          </Field>
        </div>
        <Field label="Room (optional)">
          <AdminInput name="room" maxLength={60} placeholder="Main floor" />
        </Field>
        <Field label="Capacity (optional)">
          <AdminInput name="capacity" type="number" min={1} max={200} placeholder="12" />
        </Field>
        <div className="flex items-end pb-1">
          <AdminCheckbox name="active" label="Active" defaultChecked />
        </div>
        <div className="flex items-end">
          <AdminSubmit label="Add entry" />
        </div>
      </div>
    </form>
  );
}
