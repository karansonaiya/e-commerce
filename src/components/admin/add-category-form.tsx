"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CategoryImagePicker } from "@/components/admin/category-image-picker";
import { createCategory } from "@/actions/categories";

export function AddCategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, null);
  const [formKey, setFormKey] = useState(0);
  const wasPending = useRef(false);

  // The image picker's preview is React state, not a native form field, so it
  // survives the browser's native form-reset after a successful submit.
  // Remounting the form (via key) on success resets everything, including it.
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) {
      setFormKey((k) => k + 1);
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <form key={formKey} action={formAction} className="mt-4 space-y-4">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="slug">Slug (optional)</Label>
        <Input id="slug" name="slug" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" className="mt-1.5" />
      </div>
      <CategoryImagePicker />
      <Button type="submit">Add Category</Button>
    </form>
  );
}
