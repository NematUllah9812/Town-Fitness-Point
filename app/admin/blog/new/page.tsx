import { requireAdmin } from "@/lib/auth";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata = { title: "New Blog Post" };

export default async function NewBlogPostPage() {
  await requireAdmin();
  return (
    <main className="container-x py-10">
      <p className="kicker">Blog</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">New Post</h1>
      <BlogForm />
    </main>
  );
}
