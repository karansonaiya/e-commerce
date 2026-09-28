import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is required"),
  shortTagline: z.string().optional(),
  images: z.string().min(1, "At least one image URL is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.coerce.number().nonnegative().optional().nullable(),
  stock: z.coerce.number().int().nonnegative(),
  categoryId: z.string().min(1, "Category is required"),
  featured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  ingredients: z.string().optional(),
  scentNotes: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
