"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, discountPercent, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { ProductCard as ProductCardType } from "@/types";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ProductCardType }) {
  const image = product.images.split(",")[0]?.trim();
  const percent = discountPercent(product.price, product.salePrice);
  const addItem = useCartStore((s) => s.addItem);
  const { has, toggle } = useWishlistStore();
  const wished = has(product.id);

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-cream-dark)]">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {percent > 0 && (
            <Badge className="absolute left-3 top-3">-{percent}%</Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
          >
            <Heart className={cn("size-4", wished && "fill-[var(--color-brand)] text-[var(--color-brand)]")} />
          </button>
        </div>
      </Link>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]/70">
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-medium text-[var(--color-ink)] hover:text-[var(--color-brand)]">
            {product.name}
          </h3>
        </Link>
        {product.scentNotes && (
          <p className="mt-1 line-clamp-1 text-xs text-[var(--color-ink-soft)]/70">
            {product.scentNotes}
          </p>
        )}

        <div className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-ink-soft)]">
          <Star className="size-3.5 fill-[var(--color-gold)] text-[var(--color-gold)]" />
          {product.rating.toFixed(1)} ({product.reviewCount})
        </div>

        <div className="mt-2 flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="font-semibold">{formatINR(product.salePrice)}</span>
              <span className="text-sm text-[var(--color-ink-soft)]/60 line-through">
                {formatINR(product.price)}
              </span>
            </>
          ) : (
            <span className="font-semibold">{formatINR(product.price)}</span>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="mt-3 w-full"
          disabled={product.stock === 0}
          onClick={() => {
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: image ?? "",
              price: product.price,
              salePrice: product.salePrice,
              quantity: 1,
              stock: product.stock,
            });
            toast.success(`${product.name} added to bag`);
          }}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
