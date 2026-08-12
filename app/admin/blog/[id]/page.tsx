import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminGetBlogPost } from "@/lib/admin-data";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata = { title: "Edit Blog Post" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await adminGetBlogPost(id);
  if (!post) notFound();

  return (
    <main className="container-x py-10">
      <p className="kicker">Blog</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        Edit — {post.title}
      </h1>
      <BlogForm post={post} />
    </main>
  );
}
