import "server-only";

import { getServiceClient } from "@/lib/supabase/admin";
import {
  mapClass,
  mapPlan,
  mapTrainer,
  mapTestimonial,
  mapBlogPost,
} from "@/lib/content";
import type { BlogPost, GymClass, MembershipPlan, Testimonial, Trainer } from "@/lib/types";

/**
 * Admin data helpers — every call uses the SERVICE client (bypasses RLS)
 * and MUST only be reached after requireAdmin() in the calling page.
 * These helpers never appear in client code.
 */

export async function adminListTrainers(): Promise<Trainer[]> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("trainers")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(`adminListTrainers: ${error.message}`);
  return (data ?? []).map(mapTrainer);
}

export async function adminGetTrainer(id: string): Promise<Trainer | null> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("trainers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`adminGetTrainer: ${error.message}`);
  return data ? mapTrainer(data) : null;
}

export async function adminListClasses(): Promise<GymClass[]> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("classes")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(`adminListClasses: ${error.message}`);
  return (data ?? []).map(mapClass);
}

export async function adminGetClass(id: string): Promise<GymClass | null> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("classes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`adminGetClass: ${error.message}`);
  return data ? mapClass(data) : null;
}

export async function adminListPlans(): Promise<MembershipPlan[]> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("membership_plans")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(`adminListPlans: ${error.message}`);
  return (data ?? []).map(mapPlan);
}

export async function adminListTestimonials(): Promise<Testimonial[]> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`adminListTestimonials: ${error.message}`);
  return (data ?? []).map(mapTestimonial);
}

export async function adminGetTestimonial(id: string): Promise<Testimonial | null> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`adminGetTestimonial: ${error.message}`);
  return data ? mapTestimonial(data) : null;
}

export async function adminListBlogPosts(): Promise<BlogPost[]> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`adminListBlogPosts: ${error.message}`);
  return (data ?? []).map(mapBlogPost);
}

export async function adminGetBlogPost(id: string): Promise<BlogPost | null> {
  const service = getServiceClient();
  const { data, error } = await service
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`adminGetBlogPost: ${error.message}`);
  return data ? mapBlogPost(data) : null;
}

/** Submissions inbox rows — raw service reads, page renders them. */
export async function adminListTrials() {
  const service = getServiceClient();
  const { data, error } = await service
    .from("free_trial_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`adminListTrials: ${error.message}`);
  return data ?? [];
}

export async function adminListInquiries() {
  const service = getServiceClient();
  const { data, error } = await service
    .from("membership_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`adminListInquiries: ${error.message}`);
  return data ?? [];
}

export async function adminListMessages() {
  const service = getServiceClient();
  const { data, error } = await service
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`adminListMessages: ${error.message}`);
  return data ?? [];
}

export async function adminListScheduleEntries() {
  const service = getServiceClient();
  const { data, error } = await service
    .from("schedule")
    .select("*")
    .order("weekday")
    .order("start_time");
  if (error) throw new Error(`adminListScheduleEntries: ${error.message}`);
  return data ?? [];
}

export async function adminGetSettingsRows() {
  const service = getServiceClient();
  const { data, error } = await service.from("site_settings").select("key, value");
  if (error) throw new Error(`adminGetSettingsRows: ${error.message}`);
  return data ?? [];
}

export async function adminCounts() {
  const service = getServiceClient();
  const [trials, inquiries, messages, subscribers, newTrials] = await Promise.all([
    service.from("free_trial_requests").select("id", { count: "exact", head: true }),
    service.from("membership_inquiries").select("id", { count: "exact", head: true }),
    service.from("contact_messages").select("id", { count: "exact", head: true }),
    service
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("subscribed", true),
    service
      .from("free_trial_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);
  return {
    trials: trials.count ?? 0,
    inquiries: inquiries.count ?? 0,
    messages: messages.count ?? 0,
    subscribers: subscribers.count ?? 0,
    newTrials: newTrials.count ?? 0,
  };
}
