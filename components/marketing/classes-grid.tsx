"use client";

import { useState } from "react";
import { ClassCard } from "@/components/marketing/class-card";
import { CATEGORY_META } from "@/lib/site";
import type { GymClass, ClassCategory } from "@/lib/types";

type Filter = "all" | ClassCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  ...(Object.entries(CATEGORY_META) as [ClassCategory, { label: string }][]).map(
    ([key, meta]) => ({ key, label: meta.label })
  ),
];

/** Filterable classes grid (client-side filtering, zero extra requests). */
export function ClassesGrid({ classes }: { classes: GymClass[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? classes : classes.filter((c) => c.category === filter);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter classes by category"
      >
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`rounded-md border px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === f.key
                ? "border-lime bg-lime text-obsidian"
                : "border-titanium text-mist hover:border-lime hover:text-lime"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No classes in this category yet — check back soon.
        </p>
      )}
    </div>
  );
}
