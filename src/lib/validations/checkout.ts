import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit phone number")
    .max(15, "Enter a valid phone number"),
  line1: z.string().min(4, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Enter a valid postal code"),
  country: z.string().min(2, "Country is required"),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
