import { requireAdmin } from "@/lib/auth";
import { adminListMessages } from "@/lib/admin-data";
import { StatusSelect } from "@/components/admin/status-select";

export const metadata = { title: "Contact Messages" };

const OPTIONS = ["new", "contacted", "resolved", "cancelled"];

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await adminListMessages();

  return (
    <main className="container-x py-10">
      <p className="kicker">Inbox</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Contact Messages
      </h1>
      <p className="mt-2 text-sm text-mist">{messages.length} total.</p>

      {messages.length > 0 ? (
        <div className="mt-8 space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className="rounded-lg border border-hairline bg-surface p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold">{m.subject}</h2>
                  <p className="mt-0.5 text-sm text-mist">
                    {m.name} ·{" "}
                    <a href={`mailto:${m.email}`} className="hover:text-lime">
                      {m.email}
                    </a>
                    {m.phone ? ` · ${m.phone}` : ""}
                  </p>
                </div>
                <StatusSelect
                  table="contact_messages"
                  id={m.id}
                  current={m.status}
                  options={OPTIONS}
                />
              </div>
              <p className="mt-4 rounded-md border border-titanium bg-obsidian/60 p-4 text-sm leading-relaxed text-mist">
                {m.message}
              </p>
              <p className="mt-3 text-xs text-faint">
                Received {new Date(m.created_at).toLocaleString("en-PK", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No contact messages yet.
        </p>
      )}
    </main>
  );
}
