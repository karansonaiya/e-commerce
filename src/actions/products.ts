"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

function parseProductForm(formData: FormData) {
  return productSchema.parse({
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

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = parseProductForm(formData);

  await prisma.product.create({ data });

  revalidatePath("/admin/products");
  revalidatePath("/collections/all");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseProductForm(formData);

  await prisma.product.update({ where: { id }, data });

  revalidatePath("/admin/products");
  revalidatePath("/collections/all");
  revalidatePath(`/products/${data.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
