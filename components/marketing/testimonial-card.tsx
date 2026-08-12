import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

/** Star-rated testimonial card (real member stories only). */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-hairline bg-surface p-8">
      <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`size-4 ${i < testimonial.rating ? "text-lime" : "text-titanium"}`}
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink">
        “{testimonial.quote}”
      </blockquote>
      {testimonial.resultSummary ? (
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-lime">
          {testimonial.resultSummary}
        </p>
      ) : null}
      <figcaption className="mt-5 flex items-center gap-3 border-t border-hairline pt-5">
        {testimonial.photoUrl ? (
          <Image
            src={testimonial.photoUrl}
            alt={testimonial.memberName}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-11 items-center justify-center rounded-full bg-titanium font-display text-sm font-bold">
            {testimonial.memberName.slice(0, 1)}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold">{testimonial.memberName}</p>
          {testimonial.role ? (
            <p className="text-xs text-mist">{testimonial.role}</p>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
