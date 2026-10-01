"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CategoryImagePicker } from "@/components/admin/category-image-picker";
import { updateCategory } from "@/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
};

export function CategoryEditDialog({ category }: { category: Category }) {
  const action = updateCategory.bind(null, category.id);
  const [state, formAction, isPending] = useActionState(action, null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending) {
      if (state?.error) {
        toast.error(state.error);
      } else {
        toast.success("Category updated successfully");
        closeRef.current?.click();
      }
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label={`Edit ${category.name}`}
          className="rounded-md p-1.5 text-[var(--color-ink-soft)] transition hover:bg-[var(--color-cream-dark)] hover:text-[var(--color-ink)]"
        >
          <Pencil className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form action={formAction} noValidate className="space-y-4">
          {state?.error && !state.fieldErrors && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}
          <div>
            <Label htmlFor={`name-${category.id}`}>Name</Label>
            <Input
              id={`name-${category.id}`}
              name="name"
              defaultValue={category.name}
              required
              className="mt-1.5"
            />
            {state?.fieldErrors?.name && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`slug-${category.id}`}>Slug</Label>
            <Input id={`slug-${category.id}`} name="slug" defaultValue={category.slug} className="mt-1.5" />
            {state?.fieldErrors?.slug && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.slug}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`description-${category.id}`}>Description</Label>
            <Input
              id={`description-${category.id}`}
              name="description"
              defaultValue={category.description ?? ""}
              className="mt-1.5"
            />
          </div>
          <CategoryImagePicker defaultValue={category.image} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
        <DialogClose ref={closeRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
