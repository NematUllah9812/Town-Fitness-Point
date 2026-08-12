import { requireAdmin } from "@/lib/auth";
import { TrainerForm } from "@/components/admin/trainer-form";

export const metadata = { title: "New Trainer" };

export default async function NewTrainerPage() {
  await requireAdmin();
  return (
    <main className="container-x py-10">
      <p className="kicker">Trainers</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">New Trainer</h1>
      <TrainerForm />
    </main>
  );
}
