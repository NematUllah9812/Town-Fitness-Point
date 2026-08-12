import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminGetTestimonial } from "@/lib/admin-data";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const testimonial = await adminGetTestimonial(id);
  if (!testimonial) notFound();

  return (
    <main className="container-x py-10">
      <p className="kicker">Testimonials</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Edit — {testimonial.memberName}
      </h1>
      <TestimonialForm testimonial={testimonial} />
    </main>
  );
}
