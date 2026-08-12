import { requireAdmin } from "@/lib/auth";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata = { title: "New Testimonial" };

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <main className="container-x py-10">
      <p className="kicker">Testimonials</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">New Testimonial</h1>
      <TestimonialForm />
    </main>
  );
}
