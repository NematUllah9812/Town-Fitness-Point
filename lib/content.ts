import "server-only";

import { getAnonServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import {
  DEFAULT_SETTINGS,
  type BlogPost,
  type GalleryItem,
  type GymClass,
  type MembershipPlan,
  type ScheduleEntry,
  type SiteSettings,
  type Testimonial,
  type Trainer,
} from "@/lib/types";

/**
 * Public content layer.
 *
 * Reads go through the ANON key + RLS: the database itself decides what
 * anonymous visitors may see. In mock mode (no Supabase env vars) a
 * clearly-marked placeholder dataset is served so the design is
 * reviewable — it contains no invented business claims: no fake stats,
 * no fake trainers, no fake testimonials, no invented prices.
 */

const MOCK_CLASSES: GymClass[] = [
  {
    id: "mock-strength",
    slug: "strength-conditioning",
    name: "Strength & Conditioning",
    category: "strength",
    difficulty: "advanced",
    description:
      "Periodized barbell and rack work — squats, presses and pulls coached with intent. Built for lifters who want measurable progress.",
    durationMin: 60,
    calorieBurnEst: null,
    imageUrl: "/images/classes/strength.jpg",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  {
    id: "mock-hiit",
    slug: "hiit",
    name: "HIIT",
    category: "cardio",
    difficulty: "intermediate",
    description:
      "Forty-five minutes of interval work designed to spike your engine and keep it there. Every session is scalable to your level.",
    durationMin: 45,
    calorieBurnEst: null,
    imageUrl: "/images/classes/hiit.jpg",
    featured: true,
    active: true,
    sortOrder: 2,
  },
  {
    id: "mock-crossfit",
    slug: "crossfit-wod",
    name: "CrossFit-Style WOD",
    category: "strength",
    difficulty: "advanced",
    description:
      "High-intensity functional workouts — lifted, rowed, thrown and finished. Coached for safety first, intensity second.",
    durationMin: 60,
    calorieBurnEst: null,
    imageUrl: null,
    featured: false,
    active: true,
    sortOrder: 3,
  },
  {
    id: "mock-boxing",
    slug: "boxing",
    name: "Boxing",
    category: "combat",
    difficulty: "intermediate",
    description:
      "Striking fundamentals, footwork and bag work. A full-body engine builder disguised as a fight camp.",
    durationMin: 60,
    calorieBurnEst: null,
    imageUrl: "/images/classes/boxing.jpg",
    featured: true,
    active: true,
    sortOrder: 4,
  },
  {
    id: "mock-yoga",
    slug: "yoga-mobility",
    name: "Yoga & Mobility",
    category: "mind_body",
    difficulty: "beginner",
    description:
      "Strength through range of motion. A calm, dim-studio practice for recovery, flexibility and control.",
    durationMin: 60,
    calorieBurnEst: null,
    imageUrl: "/images/classes/yoga.jpg",
    featured: true,
    active: true,
    sortOrder: 5,
  },
  {
    id: "mock-spin",
    slug: "spin",
    name: "Spin / Cycling",
    category: "cardio",
    difficulty: "beginner",
    description:
      "Ride to the beat. Low-impact, high-output conditioning that builds serious leg strength and aerobic base.",
    durationMin: 45,
    calorieBurnEst: null,
    imageUrl: null,
    featured: false,
    active: true,
    sortOrder: 6,
  },
  {
    id: "mock-functional",
    slug: "functional-training",
    name: "Functional Training",
    category: "functional",
    difficulty: "intermediate",
    description:
      "Move well in every plane. Kettlebells, sleds, carries and bodyweight work for life and sport.",
    durationMin: 60,
    calorieBurnEst: null,
    imageUrl: null,
    featured: false,
    active: true,
    sortOrder: 7,
  },
  {
    id: "mock-pt",
    slug: "personal-training",
    name: "Personal Training",
    category: "functional",
    difficulty: "beginner",
    description:
      "One-on-one coaching, custom programming and full accountability. The fastest route to your goal — whatever it is.",
    durationMin: 60,
    calorieBurnEst: null,
    imageUrl: null,
    featured: false,
    active: true,
    sortOrder: 8,
  },
];

/** Membership structure is a sample — prices stay null ("Contact us") until the owner sets them. */
const MOCK_PLANS: MembershipPlan[] = [
  {
    id: "mock-essential",
    slug: "essential",
    name: "Essential",
    pricePkr: null,
    period: "monthly",
    tagline: "Consistent training, on your own terms.",
    features: [
      "Full gym floor access",
      "Locker & changing rooms",
      "Monthly fitness assessment",
      "Free trial session included",
    ],
    popular: false,
    active: true,
    sortOrder: 1,
  },
  {
    id: "mock-pro",
    slug: "pro",
    name: "Pro",
    pricePkr: null,
    period: "monthly",
    tagline: "Everything in Essential, plus the classes.",
    features: [
      "Full gym floor access",
      "Locker & changing rooms",
      "Monthly fitness assessment",
      "Free trial session included",
      "Unlimited group classes",
      "Quarterly coach check-in",
      "Progress tracking",
      "Guest pass every month",
    ],
    popular: true,
    active: true,
    sortOrder: 2,
  },
  {
    id: "mock-elite",
    slug: "elite",
    name: "Elite",
    pricePkr: null,
    period: "monthly",
    tagline: "Coached like an athlete, all year.",
    features: [
      "Full gym floor access",
      "Locker & changing rooms",
      "Monthly fitness assessment",
      "Free trial session included",
      "Unlimited group classes",
      "Quarterly coach check-in",
      "Progress tracking",
      "Guest pass every month",
      "Monthly personal training sessions",
      "Nutrition guidance",
      "Priority class booking",
      "Recovery & mobility programming",
    ],
    popular: false,
    active: true,
    sortOrder: 3,
  },
];

// No trainers / testimonials / gallery / schedule in mock mode —
// those require real business input, per the Real Content Only rule.

export function mapClass(row: Record<string, unknown>): GymClass {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    category: row.category as GymClass["category"],
    difficulty: row.difficulty as GymClass["difficulty"],
    description: row.description as string,
    durationMin: row.duration_min as number,
    calorieBurnEst: (row.calorie_burn_est as number | null) ?? null,
    imageUrl: (row.image_url as string | null) ?? null,
    featured: row.featured as boolean,
    active: row.active as boolean,
    sortOrder: row.sort_order as number,
  };
}

export function mapPlan(row: Record<string, unknown>): MembershipPlan {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    pricePkr: (row.price_pkr as number | null) ?? null,
    period: row.period as MembershipPlan["period"],
    tagline: row.tagline as string,
    features: row.features as string[],
    popular: row.popular as boolean,
    active: row.active as boolean,
    sortOrder: row.sort_order as number,
  };
}

export function mapTrainer(row: Record<string, unknown>): Trainer {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    specialty: row.specialty as string,
    bio: row.bio as string,
    certifications: row.certifications as string[],
    experienceYears: (row.experience_years as number | null) ?? null,
    photoUrl: (row.photo_url as string | null) ?? null,
    socials: (row.socials ?? {}) as Trainer["socials"],
    featured: row.featured as boolean,
    active: row.active as boolean,
    sortOrder: row.sort_order as number,
  };
}

export function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return {
    id: row.id as string,
    memberName: row.member_name as string,
    role: (row.role as string | null) ?? null,
    photoUrl: (row.photo_url as string | null) ?? null,
    rating: row.rating as number,
    quote: row.quote as string,
    resultSummary: (row.result_summary as string | null) ?? null,
    published: row.published as boolean,
    featured: row.featured as boolean,
  };
}

export function mapGallery(row: Record<string, unknown>): GalleryItem {
  return {
    id: row.id as string,
    imageUrl: row.image_url as string,
    caption: (row.caption as string | null) ?? null,
    category: row.category as GalleryItem["category"],
    sortOrder: row.sort_order as number,
    active: row.active as boolean,
  };
}

export function mapBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) ?? "",
    content: (row.content as string) ?? "",
    coverImageUrl: (row.cover_image_url as string | null) ?? null,
    category: (row.category as string | null) ?? null,
    authorName: (row.author_name as string | null) ?? null,
    published: row.published as boolean,
    publishedAt: (row.published_at as string | null) ?? null,
    seoTitle: (row.seo_title as string | null) ?? null,
    seoDescription: (row.seo_description as string | null) ?? null,
  };
}

async function settingsFromDb(): Promise<SiteSettings> {
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("site_settings_public")
    .select("key, value");
  if (error) {
    console.warn("[content] site_settings read failed:", error.message);
    return DEFAULT_SETTINGS;
  }
  const merged: SiteSettings = structuredClone(DEFAULT_SETTINGS);
  const target = merged as unknown as Record<string, Record<string, unknown>>;
  for (const row of data ?? []) {
    const key = row.key as keyof SiteSettings;
    if (key in target && row.value) {
      target[key as string] = {
        ...target[key as string],
        ...(row.value as Record<string, unknown>),
      };
    }
  }
  return merged;
}

export async function getClasses(): Promise<GymClass[]> {
  if (env.useMockData) return MOCK_CLASSES;
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(`getClasses: ${error.message}`);
  return (data ?? []).map(mapClass);
}

export async function getFeaturedClasses(limit = 4): Promise<GymClass[]> {
  const classes = await getClasses();
  return classes.filter((c) => c.featured).slice(0, limit);
}

export async function getTrainers(): Promise<Trainer[]> {
  if (env.useMockData) return [];
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(`getTrainers: ${error.message}`);
  return (data ?? []).map(mapTrainer);
}

export async function getFeaturedTrainers(limit = 3): Promise<Trainer[]> {
  const trainers = await getTrainers();
  return trainers.filter((t) => t.featured).slice(0, limit);
}

export async function getPlans(): Promise<MembershipPlan[]> {
  if (env.useMockData) return MOCK_PLANS;
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(`getPlans: ${error.message}`);
  return (data ?? []).map(mapPlan);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (env.useMockData) return [];
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`getTestimonials: ${error.message}`);
  return (data ?? []).map(mapTestimonial);
}

export async function getFeaturedTestimonials(limit = 4): Promise<Testimonial[]> {
  const all = await getTestimonials();
  const featured = all.filter((t) => t.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (env.useMockData) return [];
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(`getGalleryItems: ${error.message}`);
  return (data ?? []).map(mapGallery);
}

export async function getSchedule(): Promise<ScheduleEntry[]> {
  if (env.useMockData) return [];
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("schedule")
    .select("*")
    .eq("active", true)
    .order("weekday")
    .order("start_time");
  if (error) throw new Error(`getSchedule: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id as string,
    classId: row.class_id as string,
    trainerId: (row.trainer_id as string | null) ?? null,
    weekday: row.weekday as number,
    startTime: (row.start_time as string).slice(0, 5),
    endTime: (row.end_time as string).slice(0, 5),
    capacity: (row.capacity as number | null) ?? null,
    room: (row.room as string | null) ?? null,
    active: row.active as boolean,
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (env.useMockData) return DEFAULT_SETTINGS;
  return settingsFromDb();
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (env.useMockData) return [];
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(`getBlogPosts: ${error.message}`);
  return (data ?? []).map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (env.useMockData) return null;
  const supabase = getAnonServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(`getBlogPostBySlug: ${error.message}`);
  return data ? mapBlogPost(data) : null;
}
