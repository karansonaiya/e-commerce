"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export function AddToCartForm({
  productId,
  name,
  slug,
  image,
  price,
  salePrice,
  stock,
}: {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice: number | null;
  stock: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  // Clamp at render time instead of syncing via effect, so a live stock drop
  // (someone else buying the last units) is reflected immediately.
  const effectiveQuantity = stock > 0 ? Math.min(quantity, stock) : 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-[var(--color-ink)]/15">
        <button
          className="p-3"
          onClick={() => setQuantity((q) => Math.max(1, Math.min(q, stock) - 1))}
          aria-label="Decrease quantity"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center font-medium">{effectiveQuantity}</span>
        <button
          className="p-3"
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          aria-label="Increase quantity"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Button
        size="lg"
        className="flex-1"
        disabled={stock === 0}
        onClick={() => {
          addItem({ productId, name, slug, image, price, salePrice, quantity: effectiveQuantity, stock });
          toast.success(`${name} added to bag`);
        }}
      >
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}
