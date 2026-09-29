"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";
import { emitEvent } from "@/lib/redis";

export type ProductFormValues = {
  name: string;
  slug: string;
  shortTagline: string;
  description: string;
  images: string;
  price: string;
  salePrice: string;
  stock: string;
  categoryId: string;
  ingredients: string;
  scentNotes: string;
  featured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
};

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: ProductFormValues;
} | null;

function readFormValues(formData: FormData): ProductFormValues {
  return {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    shortTagline: String(formData.get("shortTagline") || ""),
    description: String(formData.get("description") || ""),
    images: String(formData.get("images") || ""),
    price: String(formData.get("price") || ""),
    salePrice: String(formData.get("salePrice") || ""),
    stock: String(formData.get("stock") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    ingredients: String(formData.get("ingredients") || ""),
    scentNotes: String(formData.get("scentNotes") || ""),
    featured: formData.get("featured") === "on",
    isBestseller: formData.get("isBestseller") === "on",
    isNewArrival: formData.get("isNewArrival") === "on",
  };
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description"),
    shortTagline: formData.get("shortTagline") || undefined,
    images: formData.get("images"),
    price: formData.get("price"),
    salePrice: formData.get("salePrice") || undefined,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on",
    isBestseller: formData.get("isBestseller") === "on",
    isNewArrival: formData.get("isNewArrival") === "on",
    ingredients: formData.get("ingredients") || undefined,
    scentNotes: formData.get("scentNotes") || undefined,
  });
}

function fieldErrorsFrom(issues: { path: (string | number)[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

async function ensureUniqueSlug(slug: string, excludeId?: string) {
  let candidate = slug;
  let suffix = 2;
  while (
    await prisma.product.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    candidate = `${slug}-${suffix++}`;
  }
  return candidate;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const values = readFormValues(formData);

  const result = parseProductForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted field(s) below.",
      fieldErrors: fieldErrorsFrom(result.error.issues),
      values,
    };
  }

  try {
    const data = result.data;
    data.slug = await ensureUniqueSlug(data.slug);
    await prisma.product.create({ data });
  } catch (err) {
    return { error: describeProductError(err), values };
  }

  revalidatePath("/admin/products");
  revalidatePath("/collections/all");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const values = readFormValues(formData);

  const result = parseProductForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the highlighted field(s) below.",
      fieldErrors: fieldErrorsFrom(result.error.issues),
      values,
    };
  }

  try {
    const data = result.data;
    data.slug = await ensureUniqueSlug(data.slug, id);

    const updated = await prisma.product.update({ where: { id }, data });

    emitEvent("product:update", {
      id: updated.id,
      stock: updated.stock,
      price: updated.price,
      salePrice: updated.salePrice,
    });

    revalidatePath("/admin/products");
    revalidatePath("/collections/all");
    revalidatePath(`/products/${data.slug}`);
  } catch (err) {
    return { error: describeProductError(err), values };
  }

  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  emitEvent("product:delete", { id });
  revalidatePath("/admin/products");
}

function describeProductError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
    return "A product with conflicting details already exists. Please adjust and try again.";
  }
  return "Could not save the product. Please try again.";
}
