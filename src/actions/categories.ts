"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { categorySchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const data = categorySchema.parse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
  });

  await prisma.category.create({ data });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
