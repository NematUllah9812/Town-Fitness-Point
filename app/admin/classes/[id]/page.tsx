import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminGetClass } from "@/lib/admin-data";
import { ClassForm } from "@/components/admin/class-form";

export const metadata = { title: "Edit Class" };

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const cls = await adminGetClass(id);
  if (!cls) notFound();

  return (
    <main className="container-x py-10">
      <p className="kicker">Classes</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Edit — {cls.name}
      </h1>
      <ClassForm cls={cls} />
    </main>
  );
}
