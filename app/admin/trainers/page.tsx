import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { adminListTrainers } from "@/lib/admin-data";
import { adminDeleteTrainer } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Trainers" };

export default async function AdminTrainersPage() {
  await requireAdmin();
  const trainers = await adminListTrainers();

  return (
    <main className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Content</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Trainers</h1>
          <p className="mt-2 text-sm text-mist">{trainers.length} on file.</p>
        </div>
        <Link
          href="/admin/trainers/new"
          className="inline-flex items-center gap-2 rounded-md bg-lime px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
        >
          <Plus className="size-4" aria-hidden /> New Trainer
        </Link>
      </div>

      {trainers.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wider text-faint">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Specialty</th>
                <th className="px-5 py-3 font-medium">Certs</th>
                <th className="px-5 py-3 font-medium">Flags</th>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t) => (
                <tr key={t.id} className="border-b border-hairline/50 last:border-0">
                  <td className="px-5 py-3 font-medium">{t.name}</td>
                  <td className="px-5 py-3 text-mist">{t.specialty || "—"}</td>
                  <td className="px-5 py-3 text-mist">{t.certifications.length}</td>
                  <td className="px-5 py-3">
                    <span className="flex gap-1.5">
                      {t.featured ? (
                        <span className="rounded-sm bg-lime/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-lime">
                          Featured
                        </span>
                      ) : null}
                      {!t.active ? (
                        <span className="rounded-sm bg-red-500/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-red-400">
                          Hidden
                        </span>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-faint">{t.sortOrder}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/trainers/${t.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-mist transition hover:bg-surface hover:text-lime"
                      >
                        <Pencil className="size-3.5" aria-hidden /> Edit
                      </Link>
                      <DeleteButton id={t.id} action={adminDeleteTrainer} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No trainers yet — add your first coach profile.
        </p>
      )}
    </main>
  );
}
