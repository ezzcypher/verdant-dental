import { z } from "zod";

/** Shared by the client forms, the chat widget and the API route handlers. */

/* ------------------------------------------------------------------ *
 * Public endpoints
 * ------------------------------------------------------------------ */

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  // Everything below is optional — a shorter form converts better; the front
  // desk gathers the rest when they call to confirm.
  email: z.string().trim().email("Enter a valid email").max(160).optional().or(z.literal("")),
  treatment: z.string().trim().max(80).optional(),
  preferredDate: z.string().trim().max(60).optional(),
  preferredTime: z.string().trim().max(60).optional(),
  note: z.string().trim().max(1000).optional(),
});

export const messageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z.string().trim().max(120).optional(),
  body: z.string().trim().min(5, "Tell us a little more").max(2000),
});

export const chatSchema = z.object({
  /** Opaque public id of an existing conversation; omitted on the first turn. */
  sessionId: z.string().trim().min(8).max(64).optional(),
  message: z.string().trim().min(1, "Say something first").max(2000),
});

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required").max(200),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export const knowledgeSchema = z.object({
  category: z.enum([
    "clinic",
    "hours",
    "location",
    "contact",
    "policy",
    "faq",
    "aftercare",
    "insurance",
  ]),
  title: z.string().trim().min(2).max(120),
  content: z.string().trim().min(2).max(4000),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const treatmentSchema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.enum(["general", "cosmetic", "orthodontics", "surgical", "emergency"]),
  description: z.string().trim().max(600).optional(),
  priceFrom: z.string().trim().max(40).optional(),
  duration: z.string().trim().max(40).optional(),
  keywords: z.string().trim().max(400).optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export const dentistSchema = z.object({
  name: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(120),
  focus: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(2000).optional(),
  yearsExperience: z.number().int().min(0).max(80).optional(),
  languages: z.string().trim().max(200).optional(),
  photo: z.string().trim().max(300).optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ChatInput = z.infer<typeof chatSchema>;

export const TREATMENT_OPTIONS = [
  "Comprehensive Exam + 3D Scan",
  "Hygiene & Airflow Polish",
  "Teeth Whitening",
  "Porcelain Veneers",
  "Invisible Aligners",
  "Dental Implant",
  "Root Canal Therapy",
  "Emergency Appointment",
  "Something else",
] as const;
