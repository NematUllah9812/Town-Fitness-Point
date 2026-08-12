import { requireAdmin } from "@/lib/auth";
import { adminListTrials, adminListClasses } from "@/lib/admin-data";
import { StatusSelect } from "@/components/admin/status-select";

export const metadata = { title: "Free-Trial Requests" };

const OPTIONS = ["new", "contacted", "booked", "converted", "cancelled"];

export default async function AdminTrialsPage() {
  await requireAdmin();
  const [trials, classes] = await Promise.all([adminListTrials(), adminListClasses()]);
  const classById = new Map(classes.map((c) => [c.id, c.name]));

  return (
    <main className="container-x py-10">
      <p className="kicker">Inbox</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Free-Trial Requests
      </h1>
      <p className="mt-2 text-sm text-mist">
        {trials.length} total. Update status as you work through them —
        submissions are archived, never deleted.
      </p>

      {trials.length > 0 ? (
        <div className="mt-8 space-y-4">
          {trials.map((t) => (
            <article
              key={t.id}
              className="rounded-lg border border-hairline bg-surface p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold">{t.name}</h2>
                  <p className="mt-0.5 text-sm text-mist">
                    <a href={`mailto:${t.email}`} className="hover:text-lime">
                      {t.email}
                    </a>{" "}
                    · {t.phone}
                  </p>
                </div>
                <StatusSelect
                  table="free_trial_requests"
                  id={t.id}
                  current={t.status}
                  options={OPTIONS}
                />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-faint">Class</dt>
                  <dd className="mt-0.5 text-mist">
                    {t.preferred_class_id
                      ? classById.get(t.preferred_class_id) ?? "—"
                      : "Any"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-faint">Source</dt>
                  <dd className="mt-0.5 text-mist">{t.source}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-faint">Received</dt>
                  <dd className="mt-0.5 text-mist">
                    {new Date(t.created_at).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </div>
              </dl>
              {t.notes ? (
                <p className="mt-4 rounded-md border border-titanium bg-obsidian/60 p-3 text-sm text-mist">
                  {t.notes}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No free-trial requests yet.
        </p>
      )}
    </main>
  );
}
