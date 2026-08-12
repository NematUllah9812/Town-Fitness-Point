import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminGetTrainer } from "@/lib/admin-data";
import { TrainerForm } from "@/components/admin/trainer-form";

export const metadata = { title: "Edit Trainer" };

export default async function EditTrainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const trainer = await adminGetTrainer(id);
  if (!trainer) notFound();

  return (
    <main className="container-x py-10">
      <p className="kicker">Trainers</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Edit — {trainer.name}
      </h1>
      <TrainerForm trainer={trainer} />
    </main>
  );
}
