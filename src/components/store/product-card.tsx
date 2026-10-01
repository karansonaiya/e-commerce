"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, discountPercent, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useProductLive } from "@/hooks/use-product-live";
import type { ProductCard as ProductCardType } from "@/types";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ProductCardType }) {
  const image = product.images.split(",")[0]?.trim();
  const live = useProductLive(product.id, {
    stock: product.stock,
    price: product.price,
    salePrice: product.salePrice,
  });
  const percent = discountPercent(live.price, live.salePrice);
  const addItem = useCartStore((s) => s.addItem);
  const { has, toggle } = useWishlistStore();
  const wished = has(product.id);

  return (
    <div className="group relative transition-transform duration-500 ease-out hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-cream-dark)] shadow-sm transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-black/10">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:from-black/25 group-hover:opacity-100" />
          {percent > 0 && (
            <Badge className="absolute left-3 top-3">-{percent}%</Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              const willBeWished = !wished;
              toggle(product.id);
              toast.success(willBeWished ? "Added to wishlist" : "Removed from wishlist");
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 transition-all duration-300 hover:scale-110 hover:bg-white active:scale-90"
          >
            <Heart
              className={cn(
                "size-4 transition-transform",
                wished && "fill-[var(--color-brand)] text-[var(--color-brand-dark)] scale-110"
              )}
            />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              if (live.stock === 0) return;
              addItem({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: image ?? "",
                price: live.price,
                salePrice: live.salePrice,
                quantity: 1,
                stock: live.stock,
              });
              toast.success(`${product.name} added to bag`);
            }}
            disabled={live.stock === 0}
            aria-label="Quick add to cart"
            className="absolute inset-x-3 bottom-3 flex translate-y-4 items-center justify-center gap-1.5 rounded-full bg-white/95 py-2.5 text-xs font-semibold text-[var(--color-ink)] opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-0"
          >
            <Plus className="size-3.5" />
            {live.stock === 0 ? "Out of Stock" : "Quick Add"}
          </button>
        </div>
      </Link>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]/70">
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-medium text-[var(--color-ink)] hover:text-[var(--color-brand-dark)]">
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
          {live.salePrice ? (
            <>
              <span className="font-semibold">{formatINR(live.salePrice)}</span>
              <span className="text-sm text-[var(--color-ink-soft)]/60 line-through">
                {formatINR(live.price)}
              </span>
            </>
          ) : (
            <span className="font-semibold">{formatINR(live.price)}</span>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="mt-3 w-full"
          disabled={live.stock === 0}
          onClick={() => {
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: image ?? "",
              price: live.price,
              salePrice: live.salePrice,
              quantity: 1,
              stock: live.stock,
            });
            toast.success(`${product.name} added to bag`);
          }}
        >
          {live.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
