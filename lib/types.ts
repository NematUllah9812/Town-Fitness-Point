/**
 * Central type definitions — every entity the site and admin consume.
 * DB rows are mapped to these camelCase types in lib/content.ts.
 */

export type ClassCategory =
  | "strength"
  | "cardio"
  | "combat"
  | "mind_body"
  | "functional";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type PlanPeriod = "monthly" | "quarterly" | "yearly";

export type SubmissionStatus =
  | "new"
  | "contacted"
  | "booked"
  | "converted"
  | "cancelled";

export type GalleryCategory = "facility" | "classes" | "equipment" | "community";

export interface GymClass {
  id: string;
  slug: string;
  name: string;
  category: ClassCategory;
  difficulty: Difficulty;
  description: string;
  durationMin: number;
  calorieBurnEst: number | null;
  imageUrl: string | null;
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

export interface Trainer {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  bio: string;
  certifications: string[];
  experienceYears: number | null;
  photoUrl: string | null;
  socials: { instagram?: string; facebook?: string; youtube?: string };
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

export interface MembershipPlan {
  id: string;
  slug: string;
  name: string;
  pricePkr: number | null; // null => "Contact us" (never invent prices)
  period: PlanPeriod;
  tagline: string;
  features: string[];
  popular: boolean;
  active: boolean;
  sortOrder: number;
}

export interface ScheduleEntry {
  id: string;
  classId: string;
  trainerId: string | null;
  weekday: number; // 0 = Monday … 6 = Sunday
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  capacity: number | null;
  room: string | null;
  active: boolean;
}

export interface Testimonial {
  id: string;
  memberName: string;
  role: string | null;
  photoUrl: string | null;
  rating: number; // 1..5
  quote: string;
  resultSummary: string | null;
  published: boolean;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: GalleryCategory;
  sortOrder: number;
  active: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  category: string | null;
  authorName: string | null;
  published: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

/** Admin-editable site facts. All optional — UI renders [ADD …] placeholders when absent. */
export interface SiteSettings {
  business: {
    name: string;
    tagline: string;
  };
  contact: {
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
  };
  hours: {
    weekdays: string | null;
    weekend: string | null;
  };
  socials: {
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  stats: {
    members: number | null;
    trainers: number | null;
    years: number | null;
    classesPerWeek: number | null;
  };
  footer: {
    about: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  business: { name: "Town Fitness Point", tagline: "Strength is built here." },
  contact: { phone: null, email: null, address: null, city: null },
  hours: { weekdays: null, weekend: null },
  socials: { instagram: null, facebook: null, youtube: null, tiktok: null },
  stats: { members: null, trainers: null, years: null, classesPerWeek: null },
  footer: {
    about:
      "A premium strength & conditioning facility. Elite coaching, pro-grade equipment and small-group classes — built for people who show up.",
  },
};
