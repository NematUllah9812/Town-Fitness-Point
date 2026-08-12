import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { adminListBlogPosts } from "@/lib/admin-data";
import { adminDeleteBlogPost } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await adminListBlogPosts();

  return (
    <main className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Content</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="mt-2 text-sm text-mist">
            {posts.length} on file. Published posts appear on /blog and in the sitemap.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-md bg-lime px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-obsidian transition hover:bg-lime-strong"
        >
          <Plus className="size-4" aria-hidden /> New Post
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wider text-faint">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-hairline/50 last:border-0">
                  <td className="px-5 py-3 font-medium">{p.title}</td>
                  <td className="px-5 py-3 text-mist">{p.category ?? "—"}</td>
                  <td className="px-5 py-3">
                    {p.published ? (
                      <span className="rounded-sm bg-lime/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-lime">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-sm bg-red-500/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-red-400">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-faint">
                    {p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString("en-PK", { dateStyle: "medium" })
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-mist transition hover:bg-surface hover:text-lime"
                      >
                        <Pencil className="size-3.5" aria-hidden /> Edit
                      </Link>
                      <DeleteButton id={p.id} action={adminDeleteBlogPost} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-titanium p-10 text-center text-sm text-mist">
          No posts yet — write your first one.
        </p>
      )}
    </main>
  );
}
