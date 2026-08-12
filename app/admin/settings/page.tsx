import { requireAdmin } from "@/lib/auth";
import { adminGetSettingsRows } from "@/lib/admin-data";
import { SettingsForm } from "@/components/admin/settings-form";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";

export const metadata = { title: "Settings" };

/** Merge stored rows over defaults so the form always renders every field. */
function mergeSettings(rows: { key: string; value: Record<string, unknown> }[]): SiteSettings {
  const merged = structuredClone(DEFAULT_SETTINGS) as unknown as Record<
    string,
    Record<string, unknown>
  >;
  for (const row of rows) {
    const key = row.key as keyof SiteSettings;
    if (key in merged && row.value) {
      merged[key] = { ...merged[key], ...row.value };
    }
  }
  return merged as unknown as SiteSettings;
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const [{ saved }, rows] = await Promise.all([searchParams, adminGetSettingsRows()]);
  const settings = mergeSettings(rows);

  return (
    <main className="container-x py-10">
      <p className="kicker">Admin</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Site Settings</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
        This is where real business facts get filled in. Empty fields render as
        labeled placeholders on the public site — nothing is invented.
      </p>
      {saved === "1" ? (
        <p className="mt-4 inline-block rounded-md border border-lime/40 bg-lime/10 px-3 py-2 text-sm text-lime">
          Settings saved.
        </p>
      ) : null}
      <SettingsForm settings={settings} />
    </main>
  );
}
