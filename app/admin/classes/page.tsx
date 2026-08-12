import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { adminListClasses } from "@/lib/admin-data";
import { adminDeleteClass } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/site";

export const metadata = { title: "Classes" };

export default async function AdminClassesPage() {
  await requireAdmin();
  const classes = await adminListClasses();

  return (
    <main className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Content</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Classes</h1>
          <p className="mt-2 text-sm text-mist">{classes.length} programs on file.</p>
        </div>
        <Link
          href="/admin/classes/new"
          className="inline-flex items-center gap-2 rounded-md bg-lime px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
        >
          <Plus className="size-4" aria-hidden /> New Class
        </Link>
      </div>

      {classes.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wider text-faint">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Difficulty</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Flags</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="border-b border-hairline/50 last:border-0">
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-mist">{CATEGORY_META[c.category].label}</td>
                  <td className="px-5 py-3 text-mist">{DIFFICULTY_META[c.difficulty].label}</td>
                  <td className="px-5 py-3 text-faint">{c.durationMin} min</td>
                  <td className="px-5 py-3">
                    <span className="flex gap-1.5">
                      {c.featured ? (
                        <span className="rounded-sm bg-lime/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-lime">
                          Featured
                        </span>
                      ) : null}
                      {!c.active ? (
                        <span className="rounded-sm bg-red-500/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-red-400">
                          Hidden
                        </span>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/classes/${c.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-mist transition hover:bg-surface hover:text-lime"
                      >
                        <Pencil className="size-3.5" aria-hidden /> Edit
                      </Link>
                      <DeleteButton id={c.id} action={adminDeleteClass} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No classes yet — add your first program.
        </p>
      )}
    </main>
  );
}
