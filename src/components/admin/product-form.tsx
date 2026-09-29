"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/admin/image-picker";
import type { ProductFormState, ProductFormValues } from "@/actions/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = { id: string; name: string };

type ProductDefaults = {
  name?: string;
  slug?: string;
  description?: string;
  shortTagline?: string | null;
  images?: string;
  price?: number;
  salePrice?: number | null;
  stock?: number;
  categoryId?: string;
  featured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  ingredients?: string | null;
  scentNotes?: string | null;
};

function valuesFromDefaults(defaults?: ProductDefaults): ProductFormValues {
  return {
    name: defaults?.name ?? "",
    slug: defaults?.slug ?? "",
    shortTagline: defaults?.shortTagline ?? "",
    description: defaults?.description ?? "",
    images: defaults?.images ?? "",
    price: defaults?.price?.toString() ?? "",
    salePrice: defaults?.salePrice?.toString() ?? "",
    stock: defaults?.stock?.toString() ?? "0",
    categoryId: defaults?.categoryId ?? "",
    ingredients: defaults?.ingredients ?? "",
    scentNotes: defaults?.scentNotes ?? "",
    featured: defaults?.featured ?? false,
    isBestseller: defaults?.isBestseller ?? false,
    isNewArrival: defaults?.isNewArrival ?? false,
  };
}

export function ProductForm({
  action,
  categories,
  defaults,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  defaults?: ProductDefaults;
}) {
  const [state, formAction] = useActionState(action, null);
  const [values, setValues] = useState<ProductFormValues>(() => valuesFromDefaults(defaults));
  const formRef = useRef<HTMLFormElement>(null);

  // Native <form> fields reset after any server action submission (success or
  // error) — repopulate whatever the admin last typed from the returned state
  // instead of losing it, and jump to the first invalid field.
  useEffect(() => {
    if (state?.values) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resync after the native form reset that follows every action submission
      setValues(state.values);
    }
    if (state?.fieldErrors) {
      const firstField = Object.keys(state.fieldErrors)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`);
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  const errors = state?.fieldErrors ?? {};

  return (
    <form ref={formRef} action={formAction} className="max-w-3xl space-y-5">
      {state?.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="mt-1.5"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="slug">Slug (optional — auto-generated from name)</Label>
          <Input
            id="slug"
            name="slug"
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shortTagline">Short Tagline</Label>
        <Input
          id="shortTagline"
          name="shortTagline"
          value={values.shortTagline}
          onChange={(e) => set("shortTagline", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className="mt-1.5"
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <ImagePicker defaultValue={defaults?.images} />
      {errors.images && <p className="text-xs text-red-600">{errors.images}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            required
            className="mt-1.5"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>
        <div>
          <Label htmlFor="salePrice">Sale Price (₹, optional)</Label>
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            step="0.01"
            value={values.salePrice}
            onChange={(e) => set("salePrice", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={values.stock}
            onChange={(e) => set("stock", e.target.value)}
            required
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Select
          name="categoryId"
          value={values.categoryId || undefined}
          onValueChange={(v) => set("categoryId", v)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="scentNotes">Key Notes / Ingredients highlight</Label>
          <Input
            id="scentNotes"
            name="scentNotes"
            value={values.scentNotes}
            onChange={(e) => set("scentNotes", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="ingredients">Full Ingredients</Label>
          <Input
            id="ingredients"
            name="ingredients"
            value={values.ingredients}
            onChange={(e) => set("ingredients", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isBestseller"
            checked={values.isBestseller}
            onChange={(e) => set("isBestseller", e.target.checked)}
          />
          Bestseller
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isNewArrival"
            checked={values.isNewArrival}
            onChange={(e) => set("isNewArrival", e.target.checked)}
          />
          New Arrival
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving..." : "Save Product"}
    </Button>
  );
}
