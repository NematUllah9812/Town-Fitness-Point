"use client";

import { useMemo, useState } from "react";
import { useTrialModal } from "@/components/marketing/trial-modal-provider";
import { CATEGORY_META, WEEKDAYS } from "@/lib/site";
import type { ClassCategory, Trainer } from "@/lib/types";

/** Enriched entry passed from the server page (already joined with classes/trainers). */
export interface ScheduleEntryView {
  id: string;
  weekday: number; // 0 = Monday … 6 = Sunday
  startTime: string; // "HH:MM"
  endTime: string;
  room: string | null;
  trainerId: string | null;
  className: string;
  classCategory: ClassCategory;
  trainerName: string | null;
}

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
];

/**
 * Interactive weekly timetable.
 * Desktop: day-column grid grouped by hour slots. Mobile: day chips + list.
 * Filters: class category + trainer. Tapping a class opens the free-trial modal.
 */
export function ScheduleBoard({
  entries,
  trainers,
}: {
  entries: ScheduleEntryView[];
  trainers: Trainer[];
}) {
  const { openTrial } = useTrialModal();
  const [category, setCategory] = useState<"all" | ClassCategory>("all");
  const [trainerId, setTrainerId] = useState<"all" | string>("all");
  const [day, setDay] = useState(0); // Monday default

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          (category === "all" || e.classCategory === category) &&
          (trainerId === "all" || e.trainerId === trainerId)
      ),
    [entries, category, trainerId]
  );

  const dayEntries = useMemo(
    () =>
      filtered
        .filter((e) => e.weekday === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [filtered, day]
  );

  const hasSchedule = entries.length > 0;

  const filters = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor="schedule-category">Class type</label>
      <select
        id="schedule-category"
        value={category}
        onChange={(e) => setCategory(e.target.value as "all" | ClassCategory)}
        className="rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm text-ink focus:border-lime focus:outline-none"
      >
        <option value="all">All class types</option>
        {(Object.entries(CATEGORY_META) as [ClassCategory, { label: string }][]).map(
          ([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          )
        )}
      </select>
      <label className="sr-only" htmlFor="schedule-trainer">Trainer</label>
      <select
        id="schedule-trainer"
        value={trainerId}
        onChange={(e) => setTrainerId(e.target.value)}
        className="rounded-md border border-titanium bg-obsidian px-3.5 py-2.5 text-sm text-ink focus:border-lime focus:outline-none"
      >
        <option value="all">All trainers</option>
        {trainers.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          setCategory("all");
          setTrainerId("all");
        }}
        className="text-xs font-medium uppercase tracking-wider text-mist underline-offset-4 hover:text-lime hover:underline"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <div>
      {filters}

      {hasSchedule ? (
        <>
          {/* Mobile day chips */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden" role="tablist" aria-label="Day">
            {WEEKDAYS.map((name, i) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={day === i}
                onClick={() => setDay(i)}
                className={`shrink-0 rounded-md border px-4 py-2 font-display text-xs font-bold uppercase tracking-wider ${
                  day === i
                    ? "border-lime bg-lime text-obsidian"
                    : "border-titanium text-mist"
                }`}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Mobile list */}
          <div className="mt-6 lg:hidden">
            <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.16em] text-mist">
              {WEEKDAYS[day]}
            </p>
            {dayEntries.length > 0 ? (
              <ul className="space-y-3">
                {dayEntries.map((e) => (
                  <li key={e.id}>
                    <ScheduleCell entry={e} onSelect={openTrial} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed border-titanium p-8 text-center text-sm text-mist">
                No classes on {WEEKDAYS[day]} with the current filters.
              </p>
            )}
          </div>

          {/* Desktop grid */}
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-hairline lg:block">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <caption className="sr-only">Weekly class timetable</caption>
              <thead>
                <tr className="border-b border-hairline">
                  <th scope="col" className="w-24 px-4 py-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-faint">
                    Time
                  </th>
                  {WEEKDAYS.map((name) => (
                    <th key={name} scope="col" className="border-l border-hairline px-4 py-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-mist">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot} className="border-t border-hairline/60 align-top">
                    <th scope="row" className="px-4 py-3 font-mono text-xs text-faint">
                      {slot}
                    </th>
                    {WEEKDAYS.map((_, dayIdx) => {
                      const cells = filtered.filter(
                        (e) => e.weekday === dayIdx && e.startTime.startsWith(slot.slice(0, 2))
                      );
                      return (
                        <td key={dayIdx} className="min-h-16 border-l border-hairline/60 px-2 py-2">
                          <div className="space-y-2">
                            {cells.map((e) => (
                              <ScheduleCell key={e.id} entry={e} onSelect={openTrial} compact />
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-faint">
            Times are set by the gym. Tap any class to book your free trial session.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-titanium bg-obsidian/40 p-10 text-center">
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-faint">
            [PLACEHOLDER]
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
            The weekly timetable will appear here. Class days and times are
            added by the gym in the admin panel — check back soon, or book a
            free trial to see the floor for yourself.
          </p>
          <button
            type="button"
            onClick={openTrial}
            className="mt-6 rounded-md bg-lime px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
          >
            Book Your Free Session
          </button>
        </div>
      )}
    </div>
  );
}

function ScheduleCell({
  entry,
  onSelect,
  compact = false,
}: {
  entry: ScheduleEntryView;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-md border border-titanium bg-surface px-3 py-2 text-left transition hover:border-lime"
      title={`${entry.className} — tap to book a free trial`}
    >
      <p className="font-display text-xs font-bold text-ink">{entry.className}</p>
      <p className="mt-0.5 text-[0.7rem] text-mist">
        {entry.startTime}–{entry.endTime}
        {entry.trainerName ? ` · ${entry.trainerName}` : ""}
        {entry.room ? ` · ${entry.room}` : ""}
      </p>
      {!compact ? (
        <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-lime">
          Book free trial
        </p>
      ) : null}
    </button>
  );
}
