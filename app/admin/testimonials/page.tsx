import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { adminListTestimonials } from "@/lib/admin-data";
import { adminDeleteTestimonial } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const testimonials = await adminListTestimonials();

  return (
    <main className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Content</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="mt-2 text-sm text-mist">
            {testimonials.length} on file. Only published ones appear on the site.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 rounded-md bg-lime px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
        >
          <Plus className="size-4" aria-hidden /> New Testimonial
        </Link>
      </div>

      {testimonials.length > 0 ? (
        <div className="mt-8 space-y-4">
          {testimonials.map((t) => (
            <article key={t.id} className="rounded-lg border border-hairline bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold">{t.memberName}</h2>
                  <p className="mt-0.5 text-xs text-faint">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)} · {t.role ?? "member"}
                  </p>
                </div>
                <span className="flex items-center gap-2">
                  <span className="flex gap-1.5">
                    {!t.published ? (
                      <span className="rounded-sm bg-red-500/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-red-400">
                        Draft
                      </span>
                    ) : null}
                    {t.featured ? (
                      <span className="rounded-sm bg-lime/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-lime">
                        Featured
                      </span>
                    ) : null}
                  </span>
                  <Link
                    href={`/admin/testimonials/${t.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-mist transition hover:bg-surface hover:text-lime"
                  >
                    <Pencil className="size-3.5" aria-hidden /> Edit
                  </Link>
                  <DeleteButton id={t.id} action={adminDeleteTestimonial} />
                </span>
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-mist">
                “{t.quote}”
              </blockquote>
              {t.resultSummary ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-lime">
                  {t.resultSummary}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No testimonials yet — real member stories only.
        </p>
      )}
    </main>
  );
}
