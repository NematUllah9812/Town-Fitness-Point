/**
 * Structural site constants — navigation, enums, copy defaults.
 * These are compile-time safe brand facts, NOT admin-editable (v1).
 */

import type { ClassCategory, Difficulty } from "./types";

export const SITE_NAME = "Town Fitness Point";

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/classes", label: "Classes" },
  { href: "/trainers", label: "Trainers" },
  { href: "/membership", label: "Membership" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
] as const;

export const CATEGORY_META: Record<ClassCategory, { label: string; blurb: string }> = {
  strength: { label: "Strength", blurb: "Barbell, rack and platform work built for progress." },
  cardio: { label: "Cardio", blurb: "Engine work — intervals, conditioning and pace." },
  combat: { label: "Combat", blurb: "Boxing and striking fundamentals with real intensity." },
  mind_body: { label: "Mind & Body", blurb: "Mobility, recovery and control." },
  functional: { label: "Functional", blurb: "Moving well in every plane — for life and sport." },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string }> = {
  beginner: { label: "Beginner" },
  intermediate: { label: "Intermediate" },
  advanced: { label: "Advanced" },
};

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
