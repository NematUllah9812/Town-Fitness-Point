"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem, GalleryCategory } from "@/lib/types";

type Filter = "all" | GalleryCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "facility", label: "Facility" },
  { key: "classes", label: "Classes" },
  { key: "equipment", label: "Equipment" },
  { key: "community", label: "Community" },
];

/**
 * Filterable gallery with a keyboard-navigable lightbox
 * (← / → to move, Esc to close, focus trapped in the dialog).
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((cur) => {
        if (cur === null) return null;
        return (cur + dir + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, step]);

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFilter(f.key);
              setLightboxIndex(null);
            }}
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

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-surface focus-visible:outline-lime"
              aria-label={item.caption ?? "Open image in lightbox"}
            >
              <Image
                src={item.imageUrl}
                alt={item.caption ?? "Town Fitness Point"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/90 to-transparent px-3 pb-2 pt-8 text-left text-xs font-medium text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.caption ?? ""}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No images in this category yet — the gym adds them from the admin panel.
        </p>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {current ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={current.caption ?? "Gallery image"}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute right-4 top-4 z-10 rounded-md p-2 text-mist transition hover:text-ink"
            >
              <X className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous image"
              className="absolute left-3 z-10 rounded-md border border-titanium p-2.5 text-ink transition hover:border-lime hover:text-lime md:left-6"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next image"
              className="absolute right-3 z-10 rounded-md border border-titanium p-2.5 text-ink transition hover:border-lime hover:text-lime md:right-6"
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>

            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-hairline">
                <Image
                  src={current.imageUrl}
                  alt={current.caption ?? "Town Fitness Point"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                />
              </div>
              {current.caption ? (
                <p className="mt-3 text-center text-sm text-mist">{current.caption}</p>
              ) : null}
              <p className="mt-1 text-center text-xs text-faint">
                {lightboxIndex! + 1} / {filtered.length}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
