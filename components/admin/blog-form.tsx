"use client";

import { adminUpsertBlogPost } from "@/lib/admin-actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSubmit,
  AdminTextarea,
  Field,
} from "@/components/admin/fields";
import type { BlogPost } from "@/lib/types";

export function BlogForm({ post }: { post?: BlogPost | null }) {
  const publishedAtValue = post?.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 16)
    : "";

  return (
    <form
      action={adminUpsertBlogPost}
      className="mt-8 max-w-3xl space-y-6 rounded-lg border border-hairline bg-surface p-8"
    >
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <Field label="Title">
        <AdminInput name="title" required maxLength={150} defaultValue={post?.title} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Slug (blank = auto)">
          <AdminInput name="slug" maxLength={100} defaultValue={post?.slug} placeholder="auto" />
        </Field>
        <Field label="Category">
          <AdminInput name="category" maxLength={60} defaultValue={post?.category ?? ""} placeholder="Nutrition" />
        </Field>
        <Field label="Author">
          <AdminInput name="authorName" maxLength={100} defaultValue={post?.authorName ?? ""} />
        </Field>
      </div>

      <Field label="Excerpt (shown in listings)">
        <AdminTextarea name="excerpt" rows={2} maxLength={300} defaultValue={post?.excerpt} />
      </Field>

      <Field
        label="Content (plain text; blank lines become paragraphs)"
        hint="Keep it real and useful — this is also your SEO body copy."
      >
        <AdminTextarea name="content" rows={12} required maxLength={20000} defaultValue={post?.content} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cover image URL">
          <AdminInput name="coverImageUrl" type="url" maxLength={500} defaultValue={post?.coverImageUrl ?? ""} placeholder="https://…" />
        </Field>
        <Field label="Publish date (optional; defaults to now)">
          <AdminInput name="publishedAt" type="datetime-local" defaultValue={publishedAtValue} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <AdminCheckbox name="published" label="Published (visible on site)" defaultChecked={post?.published} />
      </div>

      <div className="flex items-center gap-4">
        <AdminSubmit label={post ? "Save changes" : "Create post"} />
        <a href="/admin/blog" className="text-sm text-mist underline-offset-4 hover:text-ink hover:underline">
          Cancel
        </a>
      </div>
    </form>
  );
}
