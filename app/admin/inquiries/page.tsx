import { requireAdmin } from "@/lib/auth";
import { adminListInquiries, adminListPlans } from "@/lib/admin-data";
import { StatusSelect } from "@/components/admin/status-select";

export const metadata = { title: "Membership Inquiries" };

const OPTIONS = ["new", "contacted", "booked", "converted", "cancelled"];

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const [inquiries, plans] = await Promise.all([adminListInquiries(), adminListPlans()]);
  const planById = new Map(plans.map((p) => [p.id, p.name]));

  return (
    <main className="container-x py-10">
      <p className="kicker">Inbox</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Membership Inquiries
      </h1>
      <p className="mt-2 text-sm text-mist">{inquiries.length} total.</p>

      {inquiries.length > 0 ? (
        <div className="mt-8 space-y-4">
          {inquiries.map((inq) => (
            <article
              key={inq.id}
              className="rounded-lg border border-hairline bg-surface p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold">{inq.name}</h2>
                  <p className="mt-0.5 text-sm text-mist">
                    <a href={`mailto:${inq.email}`} className="hover:text-lime">
                      {inq.email}
                    </a>{" "}
                    · {inq.phone}
                  </p>
                </div>
                <StatusSelect
                  table="membership_inquiries"
                  id={inq.id}
                  current={inq.status}
                  options={OPTIONS}
                />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-faint">Plan of interest</dt>
                  <dd className="mt-0.5 text-mist">
                    {inq.plan_id ? planById.get(inq.plan_id) ?? "—" : "Not sure yet"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-faint">Received</dt>
                  <dd className="mt-0.5 text-mist">
                    {new Date(inq.created_at).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </div>
              </dl>
              {inq.message ? (
                <p className="mt-4 rounded-md border border-titanium bg-obsidian/60 p-3 text-sm text-mist">
                  {inq.message}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No membership inquiries yet.
        </p>
      )}
    </main>
  );
}
