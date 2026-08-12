import Link from "next/link";
import { ArrowRight, Inbox, Mail, MessageSquare, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { adminCounts, adminListTrials } from "@/lib/admin-data";

export const metadata = {
  title: "Dashboard",
};

/** Admin overview: inbox counts + latest free-trial requests. */
export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const [counts, trials] = await Promise.all([adminCounts(), adminListTrials()]);

  const cards = [
    {
      href: "/admin/trials",
      Icon: Inbox,
      label: "Free-trial requests",
      value: counts.trials,
      highlight: counts.newTrials,
    },
    {
      href: "/admin/inquiries",
      Icon: Users,
      label: "Membership inquiries",
      value: counts.inquiries,
    },
    {
      href: "/admin/messages",
      Icon: MessageSquare,
      label: "Contact messages",
      value: counts.messages,
    },
    {
      href: "/admin/settings",
      Icon: Mail,
      label: "Newsletter subscribers",
      value: counts.subscribers,
    },
  ];

  return (
    <main className="container-x py-10">
      <p className="kicker">Admin</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Welcome, {admin.fullName || admin.email}
      </h1>
      <p className="mt-2 text-sm text-mist">
        Session verified server-side. Role confirmed against the database.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, Icon, label, value, highlight }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-lg border border-hairline bg-surface p-6 transition hover:border-lime/50"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-5 text-lime" aria-hidden />
              <ArrowRight
                className="size-4 text-faint transition group-hover:translate-x-0.5 group-hover:text-lime"
                aria-hidden
              />
            </div>
            <p className="mt-5 font-display text-4xl font-extrabold tracking-tight">
              {value}
              {highlight ? (
                <span className="ml-2 align-middle text-xs font-bold uppercase tracking-wider text-lime">
                  {highlight} new
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-mist">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Latest free-trial requests</h2>
          <Link href="/admin/trials" className="text-xs font-semibold uppercase tracking-wider text-lime">
            View all
          </Link>
        </div>
        {trials.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline text-xs uppercase tracking-wider text-faint">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {trials.slice(0, 6).map((t) => (
                  <tr key={t.id} className="border-b border-hairline/50 last:border-0">
                    <td className="px-5 py-3 font-medium">{t.name}</td>
                    <td className="px-5 py-3 text-mist">
                      {t.email}
                      <span className="block text-xs text-faint">{t.phone}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-sm border border-lime/60 bg-lime/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-lime">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-faint">
                      {new Date(t.created_at).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-titanium p-8 text-center text-sm text-mist">
            No free-trial requests yet. They will appear here as soon as the
            website form is live.
          </p>
        )}
      </div>
    </main>
  );
}
