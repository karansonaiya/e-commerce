"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { categorySchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

export type CategoryFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

function fieldErrorsFrom(issues: { path: (string | number)[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

async function ensureUniqueCategorySlug(slug: string, excludeId?: string) {
  let candidate = slug;
  let suffix = 2;
  while (
    await prisma.category.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    candidate = `${slug}-${suffix++}`;
  }
  return candidate;
}

function describeCategoryError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "P2002") {
      return "A category with this slug already exists. Please choose a different name or slug.";
    }
    if (code === "P2003" || code === "P2014") {
      return "This category still has products assigned to it. Move or delete those products first.";
    }
  }
  if (err instanceof Error) return err.message;
  return "Could not save the category. Please try again.";
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  try {
    const data = parsed.data;
    data.slug = await ensureUniqueCategorySlug(data.slug);
    await prisma.category.create({ data });
  } catch (err) {
    return { error: describeCategoryError(err) };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return null;
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description") || undefined,
    image: formData.get("image") || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  try {
    const data = parsed.data;
    data.slug = await ensureUniqueCategorySlug(data.slug, id);
    await prisma.category.update({ where: { id }, data });
  } catch (err) {
    return { error: describeCategoryError(err) };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return null;
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    await prisma.category.delete({ where: { id } });
  } catch (err) {
    throw new Error(describeCategoryError(err));
  }
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
