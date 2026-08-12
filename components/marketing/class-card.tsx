import Image from "next/image";
import Link from "next/link";
import { Clock, Dumbbell, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/site";
import type { GymClass } from "@/lib/types";

/** Shared class card — home preview and /classes use the same component. */
export function ClassCard({ cls }: { cls: GymClass }) {
  return (
    <Link
      href="/schedule"
      className="group block h-full overflow-hidden rounded-lg border border-hairline bg-surface transition-colors duration-300 hover:border-lime/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cls.imageUrl ? (
          <Image
            src={cls.imageUrl}
            alt={cls.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface">
            <Dumbbell className="size-10 text-titanium" aria-hidden />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge tone="accent">{DIFFICULTY_META[cls.difficulty].label}</Badge>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-faint">
          {CATEGORY_META[cls.category].label}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight transition-colors group-hover:text-lime">
          {cls.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">
          {cls.description}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-faint">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden /> {cls.durationMin} min
          </span>
          {cls.calorieBurnEst ? (
            <span className="flex items-center gap-1.5">
              <Flame className="size-3.5" aria-hidden /> ~{cls.calorieBurnEst} kcal
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
