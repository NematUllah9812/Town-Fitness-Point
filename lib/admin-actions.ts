"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getServiceClient } from "@/lib/supabase/admin";
import { getSsrClient } from "@/lib/supabase/ssr";

/**
 * Admin server actions.
 *
 * SECURITY MODEL:
 * - EVERY action starts with `await requireAdmin()` — a server-side
 *   session + role check. Never client-side trust.
 * - Mutations run through the service client; RLS policies additionally
 *   reject any write from a non-admin session.
 * - Inputs are validated with zod (length caps, type checks).
 * - After every mutation the affected routes are revalidated.
 */

const idSchema = z.string().uuid().nullable().optional();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const text = (max: number) => z.string().trim().max(max).optional().default("");

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function adminLogout() {
  await requireAdmin();
  const supabase = await getSsrClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Submission status updates (no delete — submissions are archived)
// ---------------------------------------------------------------------------

const SUBMISSION_TABLES = [
  "free_trial_requests",
  "membership_inquiries",
  "contact_messages",
] as const;
const STATUS_LISTS: Record<(typeof SUBMISSION_TABLES)[number], string[]> = {
  free_trial_requests: ["new", "contacted", "booked", "converted", "cancelled"],
  membership_inquiries: ["new", "contacted", "booked", "converted", "cancelled"],
  contact_messages: ["new", "contacted", "resolved", "cancelled"],
};

export async function adminUpdateSubmissionStatus(formData: FormData) {
  await requireAdmin();
  const table = formData.get("table") as string;
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!SUBMISSION_TABLES.includes(table as (typeof SUBMISSION_TABLES)[number])) {
    throw new Error("Invalid table");
  }
  const allowed = STATUS_LISTS[table as (typeof SUBMISSION_TABLES)[number]];
  if (!allowed.includes(status)) throw new Error("Invalid status");
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid id");

  const service = getServiceClient();
  const { error } = await service.from(table).update({ status }).eq("id", id);
  if (error) throw new Error(`status update failed: ${error.message}`);

  revalidatePath("/admin", "layout");
}

// ---------------------------------------------------------------------------
// Trainers
// ---------------------------------------------------------------------------

export async function adminUpsertTrainer(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || null;
  const parsed = z
    .object({
      name: z.string().trim().min(1).max(100),
      slug: z.string().trim().max(80).optional().default(""),
      specialty: text(100),
      bio: text(1000),
      certifications: text(500),
      experienceYears: z.string().trim().optional().default(""),
      photoUrl: text(500),
      instagram: text(200),
      facebook: text(200),
      youtube: text(200),
      featured: z.string().optional(),
      active: z.string().optional(),
      sortOrder: z.string().trim().optional().default("0"),
    })
    .safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      specialty: formData.get("specialty"),
      bio: formData.get("bio"),
      certifications: formData.get("certifications"),
      experienceYears: formData.get("experienceYears"),
      photoUrl: formData.get("photoUrl"),
      instagram: formData.get("instagram"),
      facebook: formData.get("facebook"),
      youtube: formData.get("youtube"),
      featured: formData.get("featured"),
      active: formData.get("active"),
      sortOrder: formData.get("sortOrder"),
    });
  if (!parsed.success) throw new Error("Invalid trainer data");

  const d = parsed.data;
  const slug = d.slug || slugify(d.name);
  const payload = {
    name: d.name,
    slug,
    specialty: d.specialty,
    bio: d.bio,
    certifications: d.certifications
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    experience_years: d.experienceYears ? Number(d.experienceYears) : null,
    photo_url: d.photoUrl || null,
    socials: {
      instagram: d.instagram || null,
      facebook: d.facebook || null,
      youtube: d.youtube || null,
    },
    featured: d.featured === "on",
    active: d.active === "on",
    sort_order: Number(d.sortOrder) || 0,
  };

  const service = getServiceClient();
  const { error } = id
    ? await service.from("trainers").update(payload).eq("id", id)
    : await service.from("trainers").insert(payload);
  if (error) throw new Error(`trainer save failed: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/trainers");
}

export async function adminDeleteTrainer(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid id");
  const service = getServiceClient();
  const { error } = await service.from("trainers").delete().eq("id", id);
  if (error) throw new Error(`trainer delete failed: ${error.message}`);
  revalidatePath("/", "layout");
  redirect("/admin/trainers");
}

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

export async function adminUpsertClass(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || null;
  const parsed = z
    .object({
      name: z.string().trim().min(1).max(100),
      slug: z.string().trim().max(80).optional().default(""),
      category: z.enum(["strength", "cardio", "combat", "mind_body", "functional"]),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      description: text(1000),
      durationMin: z.string().trim().optional().default("60"),
      calorieBurnEst: z.string().trim().optional().default(""),
      imageUrl: text(500),
      featured: z.string().optional(),
      active: z.string().optional(),
      sortOrder: z.string().trim().optional().default("0"),
    })
    .safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      category: formData.get("category"),
      difficulty: formData.get("difficulty"),
      description: formData.get("description"),
      durationMin: formData.get("durationMin"),
      calorieBurnEst: formData.get("calorieBurnEst"),
      imageUrl: formData.get("imageUrl"),
      featured: formData.get("featured"),
      active: formData.get("active"),
      sortOrder: formData.get("sortOrder"),
    });
  if (!parsed.success) throw new Error("Invalid class data");

  const d = parsed.data;
  const payload = {
    name: d.name,
    slug: d.slug || slugify(d.name),
    category: d.category,
    difficulty: d.difficulty,
    description: d.description,
    duration_min: Math.min(Math.max(Number(d.durationMin) || 60, 10), 240),
    calorie_burn_est: d.calorieBurnEst ? Number(d.calorieBurnEst) : null,
    image_url: d.imageUrl || null,
    featured: d.featured === "on",
    active: d.active === "on",
    sort_order: Number(d.sortOrder) || 0,
  };

  const service = getServiceClient();
  const { error } = id
    ? await service.from("classes").update(payload).eq("id", id)
    : await service.from("classes").insert(payload);
  if (error) throw new Error(`class save failed: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/classes");
}

export async function adminDeleteClass(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid id");
  const service = getServiceClient();
  const { error } = await service.from("classes").delete().eq("id", id);
  if (error) throw new Error(`class delete failed: ${error.message}`);
  revalidatePath("/", "layout");
  redirect("/admin/classes");
}

// ---------------------------------------------------------------------------
// Schedule entries
// ---------------------------------------------------------------------------

export async function adminUpsertScheduleEntry(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || null;
  const parsed = z
    .object({
      classId: z.string().uuid(),
      trainerId: z.string().uuid().nullable().optional(),
      weekday: z.coerce.number().int().min(0).max(6),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
      capacity: z.string().trim().optional().default(""),
      room: text(60),
      active: z.string().optional(),
    })
    .safeParse({
      classId: formData.get("classId"),
      trainerId: formData.get("trainerId") || null,
      weekday: formData.get("weekday"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      capacity: formData.get("capacity"),
      room: formData.get("room"),
      active: formData.get("active"),
    });
  if (!parsed.success) throw new Error("Invalid schedule entry");
  if (parsed.data.endTime <= parsed.data.startTime) {
    throw new Error("End time must be after start time");
  }

  const d = parsed.data;
  const payload = {
    class_id: d.classId,
    trainer_id: d.trainerId ?? null,
    weekday: d.weekday,
    start_time: d.startTime,
    end_time: d.endTime,
    capacity: d.capacity ? Number(d.capacity) : null,
    room: d.room || null,
    active: d.active === "on",
  };

  const service = getServiceClient();
  const { error } = id
    ? await service.from("schedule").update(payload).eq("id", id)
    : await service.from("schedule").insert(payload);
  if (error) throw new Error(`schedule save failed: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/schedule");
}

export async function adminDeleteScheduleEntry(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid id");
  const service = getServiceClient();
  const { error } = await service.from("schedule").delete().eq("id", id);
  if (error) throw new Error(`schedule delete failed: ${error.message}`);
  revalidatePath("/", "layout");
  redirect("/admin/schedule");
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function adminUpsertTestimonial(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || null;
  const parsed = z
    .object({
      memberName: z.string().trim().min(1).max(100),
      role: text(100),
      rating: z.coerce.number().int().min(1).max(5),
      quote: z.string().trim().min(1).max(1000),
      resultSummary: text(200),
      photoUrl: text(500),
      published: z.string().optional(),
      featured: z.string().optional(),
    })
    .safeParse({
      memberName: formData.get("memberName"),
      role: formData.get("role"),
      rating: formData.get("rating"),
      quote: formData.get("quote"),
      resultSummary: formData.get("resultSummary"),
      photoUrl: formData.get("photoUrl"),
      published: formData.get("published"),
      featured: formData.get("featured"),
    });
  if (!parsed.success) throw new Error("Invalid testimonial data");

  const d = parsed.data;
  const payload = {
    member_name: d.memberName,
    role: d.role || null,
    rating: d.rating,
    quote: d.quote,
    result_summary: d.resultSummary || null,
    photo_url: d.photoUrl || null,
    published: d.published === "on",
    featured: d.featured === "on",
  };

  const service = getServiceClient();
  const { error } = id
    ? await service.from("testimonials").update(payload).eq("id", id)
    : await service.from("testimonials").insert(payload);
  if (error) throw new Error(`testimonial save failed: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}

export async function adminDeleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid id");
  const service = getServiceClient();
  const { error } = await service.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(`testimonial delete failed: ${error.message}`);
  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export async function adminUpsertBlogPost(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || null;
  const parsed = z
    .object({
      title: z.string().trim().min(1).max(150),
      slug: z.string().trim().max(100).optional().default(""),
      excerpt: text(300),
      content: z.string().trim().min(1).max(20000),
      coverImageUrl: text(500),
      category: text(60),
      authorName: text(100),
      published: z.string().optional(),
      publishedAt: z.string().trim().optional().default(""),
    })
    .safeParse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      coverImageUrl: formData.get("coverImageUrl"),
      category: formData.get("category"),
      authorName: formData.get("authorName"),
      published: formData.get("published"),
      publishedAt: formData.get("publishedAt"),
    });
  if (!parsed.success) throw new Error("Invalid blog post data");

  const d = parsed.data;
  const isPublished = d.published === "on";
  const payload = {
    title: d.title,
    slug: d.slug || slugify(d.title),
    excerpt: d.excerpt,
    content: d.content,
    cover_image_url: d.coverImageUrl || null,
    category: d.category || null,
    author_name: d.authorName || null,
    published: isPublished,
    published_at: isPublished
      ? d.publishedAt
        ? new Date(d.publishedAt).toISOString()
        : new Date().toISOString()
      : null,
  };

  const service = getServiceClient();
  const { error } = id
    ? await service.from("blog_posts").update(payload).eq("id", id)
    : await service.from("blog_posts").insert(payload);
  if (error) throw new Error(`blog save failed: ${error.message}`);

  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

export async function adminDeleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!z.string().uuid().safeParse(id).success) throw new Error("Invalid id");
  const service = getServiceClient();
  const { error } = await service.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(`blog delete failed: ${error.message}`);
  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

export async function adminUpdateSettings(formData: FormData) {
  await requireAdmin();

  const str = (name: string) => {
    const v = formData.get(name);
    return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
  };
  const num = (name: string) => {
    const v = formData.get(name);
    if (typeof v !== "string" || v.trim() === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const sections: Record<string, Record<string, unknown>> = {
    business: {
      name: str("businessName") ?? "Town Fitness Point",
      tagline: str("businessTagline") ?? "",
    },
    contact: {
      phone: str("contactPhone"),
      email: str("contactEmail"),
      address: str("contactAddress"),
      city: str("contactCity"),
    },
    hours: {
      weekdays: str("hoursWeekdays"),
      weekend: str("hoursWeekend"),
    },
    socials: {
      instagram: str("socialInstagram"),
      facebook: str("socialFacebook"),
      youtube: str("socialYoutube"),
      tiktok: str("socialTiktok"),
    },
    stats: {
      members: num("statsMembers"),
      trainers: num("statsTrainers"),
      years: num("statsYears"),
      classesPerWeek: num("statsClassesPerWeek"),
    },
    footer: {
      about: str("footerAbout") ?? "",
    },
  };

  const service = getServiceClient();
  for (const [key, value] of Object.entries(sections)) {
    const { error } = await service.from("site_settings").upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (error) throw new Error(`settings save failed (${key}): ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
