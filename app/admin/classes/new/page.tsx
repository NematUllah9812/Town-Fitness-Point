import { requireAdmin } from "@/lib/auth";
import { ClassForm } from "@/components/admin/class-form";

export const metadata = { title: "New Class" };

export default async function NewClassPage() {
  await requireAdmin();
  return (
    <main className="container-x py-10">
      <p className="kicker">Classes</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">New Class</h1>
      <ClassForm />
    </main>
  );
}
