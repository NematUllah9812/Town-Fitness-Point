import { z } from "zod";

/**
 * Server-side validation for every public form.
 * These schemas run in Server Actions — the browser never decides
 * what is valid input. All fields are length-capped.
 */

const name = z
  .string()
  .trim()
  .min(2, "Please enter your name")
  .max(80, "Name is too long");

const email = z
  .string()
  .trim()
  .email("Please enter a valid email")
  .max(160, "Email is too long")
  .toLowerCase();

const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number")
  .max(24, "Phone number is too long")
  .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters");

export const trialRequestSchema = z.object({
  name,
  email,
  phone,
  // class slug or uuid — resolved to a FK id server-side in the action
  preferredClassId: z.string().trim().max(64).nullable().optional(),
  notes: z.string().trim().max(500, "Notes are too long").optional().default(""),
});

export const contactMessageSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Please add a subject").max(120, "Subject is too long"),
  message: z.string().trim().min(10, "Message is too short").max(2000, "Message is too long"),
});

export const newsletterSchema = z.object({
  email,
});

export const membershipInquirySchema = z.object({
  name,
  email,
  phone,
  // plan slug or uuid — resolved to a FK id server-side in the action
  planId: z.string().trim().max(64).nullable().optional(),
  message: z.string().trim().max(1000, "Message is too long").optional().default(""),
});

export type TrialRequestInput = z.infer<typeof trialRequestSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
