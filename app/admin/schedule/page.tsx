import { requireAdmin } from "@/lib/auth";
import {
  adminListScheduleEntries,
  adminListClasses,
  adminListTrainers,
} from "@/lib/admin-data";
import { adminDeleteScheduleEntry } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { ScheduleEntryForm } from "@/components/admin/schedule-entry-form";
import { WEEKDAYS } from "@/lib/site";

export const metadata = { title: "Schedule" };

export default async function AdminSchedulePage() {
  await requireAdmin();
  const [entries, classes, trainers] = await Promise.all([
    adminListScheduleEntries(),
    adminListClasses(),
    adminListTrainers(),
  ]);
  const classById = new Map(classes.map((c) => [c.id, c]));
  const trainerById = new Map(trainers.map((t) => [t.id, t]));

  const sorted = [...entries].sort(
    (a, b) =>
      a.weekday - b.weekday || a.start_time.localeCompare(b.start_time)
  );

  return (
    <main className="container-x py-10">
      <p className="kicker">Content</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Timetable</h1>
      <p className="mt-2 text-sm text-mist">
        {entries.length} entries. Entries show on the public schedule the moment
        they are saved.
      </p>

      <div className="mt-8">
        <ScheduleEntryForm classes={classes} trainers={trainers} />
      </div>

      {sorted.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wider text-faint">
                <th className="px-5 py-3 font-medium">Day</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Class</th>
                <th className="px-5 py-3 font-medium">Trainer</th>
                <th className="px-5 py-3 font-medium">Room</th>
                <th className="px-5 py-3 font-medium">Capacity</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => {
                const cls = classById.get(e.class_id);
                const trainer = e.trainer_id ? trainerById.get(e.trainer_id) : null;
                return (
                  <tr
                    key={e.id}
                    className={`border-b border-hairline/50 last:border-0 ${
                      !e.active ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-5 py-3 font-medium">{WEEKDAYS[e.weekday]}</td>
                    <td className="px-5 py-3 text-mist">
                      {e.start_time.slice(0, 5)}–{e.end_time.slice(0, 5)}
                    </td>
                    <td className="px-5 py-3">{cls?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-mist">{trainer?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-mist">{e.room ?? "—"}</td>
                    <td className="px-5 py-3 text-faint">{e.capacity ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center justify-end gap-2">
                        {!e.active ? (
                          <span className="rounded-sm bg-red-500/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-red-400">
                            Hidden
                          </span>
                        ) : null}
                        <DeleteButton id={e.id} action={adminDeleteScheduleEntry} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No timetable entries yet — add one above.
        </p>
      )}
    </main>
  );
}
