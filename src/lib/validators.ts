import { EventType, LocationCategory } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Use at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const locationSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(20),
  category: z.nativeEnum(LocationCategory),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  latitude: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || !Number.isNaN(val), {
      message: "Latitude must be a number",
    }),
  longitude: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || !Number.isNaN(val), {
      message: "Longitude must be a number",
    }),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  eventType: z.nativeEnum(EventType),
  locationId: z.string().cuid(),
  startDateTime: z.string(),
  endDateTime: z.string().optional(),
  recurringRule: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type EventInput = z.infer<typeof eventSchema>;
