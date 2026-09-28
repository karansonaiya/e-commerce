"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function ProductForm({
  action,
  categories,
  defaults,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  defaults?: ProductDefaults;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" defaultValue={defaults?.name} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="slug">Slug (optional — auto-generated from name)</Label>
          <Input id="slug" name="slug" defaultValue={defaults?.slug} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="shortTagline">Short Tagline</Label>
        <Input id="shortTagline" name="shortTagline" defaultValue={defaults?.shortTagline ?? ""} className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required rows={4} defaultValue={defaults?.description} className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="images">Image URLs (comma-separated)</Label>
        <Input id="images" name="images" required defaultValue={defaults?.images} className="mt-1.5" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" name="price" type="number" step="0.01" required defaultValue={defaults?.price} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="salePrice">Sale Price (₹, optional)</Label>
          <Input id="salePrice" name="salePrice" type="number" step="0.01" defaultValue={defaults?.salePrice ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" required defaultValue={defaults?.stock ?? 0} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Select name="categoryId" defaultValue={defaults?.categoryId}>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="scentNotes">Key Notes / Ingredients highlight</Label>
          <Input id="scentNotes" name="scentNotes" defaultValue={defaults?.scentNotes ?? ""} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="ingredients">Full Ingredients</Label>
          <Input id="ingredients" name="ingredients" defaultValue={defaults?.ingredients ?? ""} className="mt-1.5" />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={defaults?.featured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isBestseller" defaultChecked={defaults?.isBestseller} />
          Bestseller
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNewArrival" defaultChecked={defaults?.isNewArrival} />
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
