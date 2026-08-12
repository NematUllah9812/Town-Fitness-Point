import Image from "next/image";
import { Instagram, Facebook, Youtube, UserRound } from "lucide-react";
import type { Trainer } from "@/lib/types";

const SOCIAL_ICONS = [
  { key: "instagram", Icon: Instagram, label: "Instagram" },
  { key: "facebook", Icon: Facebook, label: "Facebook" },
  { key: "youtube", Icon: Youtube, label: "YouTube" },
] as const;

/** Shared trainer card — home preview and /trainers use the same component. */
export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-colors duration-300 hover:border-lime/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
        {trainer.photoUrl ? (
          <Image
            src={trainer.photoUrl}
            alt={`${trainer.name} — ${trainer.specialty}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <UserRound className="size-12 text-titanium" aria-hidden />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold tracking-tight">{trainer.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-lime">
          {trainer.specialty}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mist">{trainer.bio}</p>

        {trainer.certifications.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Certifications">
            {trainer.certifications.map((cert) => (
              <li
                key={cert}
                className="rounded-sm border border-titanium bg-obsidian/60 px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-mist"
              >
                {cert}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-1 items-end justify-between border-t border-hairline pt-4">
          {trainer.experienceYears !== null ? (
            <p className="text-xs font-medium uppercase tracking-wider text-faint">
              {trainer.experienceYears} yrs experience
            </p>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            {SOCIAL_ICONS.map(({ key, Icon, label }) =>
              trainer.socials[key] ? (
                <a
                  key={key}
                  href={trainer.socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${trainer.name} on ${label}`}
                  className="flex size-8 items-center justify-center rounded-md border border-titanium text-mist transition hover:border-lime hover:text-lime"
                >
                  <Icon className="size-3.5" aria-hidden />
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
