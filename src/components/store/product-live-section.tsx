"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartForm } from "@/components/store/add-to-cart-form";
import { useProductLive } from "@/hooks/use-product-live";
import { useCartStore } from "@/stores/cart-store";
import { formatINR, discountPercent, cn } from "@/lib/utils";

export function ProductLiveSection({
  productId,
  name,
  slug,
  image,
  initialPrice,
  initialSalePrice,
  initialStock,
}: {
  productId: string;
  name: string;
  slug: string;
  image: string;
  initialPrice: number;
  initialSalePrice: number | null;
  initialStock: number;
}) {
  const live = useProductLive(productId, {
    stock: initialStock,
    price: initialPrice,
    salePrice: initialSalePrice,
  });
  const percent = discountPercent(live.price, live.salePrice);
  const addItem = useCartStore((s) => s.addItem);

  const anchorRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="mt-4 flex items-center gap-3">
        {live.salePrice ? (
          <>
            <span className="font-display text-3xl font-semibold">{formatINR(live.salePrice)}</span>
            <span className="text-lg text-[var(--color-ink-soft)]/60 line-through">
              {formatINR(live.price)}
            </span>
            {percent > 0 && <Badge>-{percent}%</Badge>}
          </>
        ) : (
          <span className="font-display text-3xl font-semibold">{formatINR(live.price)}</span>
        )}
      </div>

      <p className="mt-2 text-sm">
        {live.stock > 0 ? (
          <span className="text-emerald-700">In Stock ({live.stock} available)</span>
        ) : (
          <span className="text-red-600">Out of Stock</span>
        )}
      </p>

      <div ref={anchorRef} className="mt-6">
        <AddToCartForm
          productId={productId}
          name={name}
          slug={slug}
          image={image}
          price={live.price}
          salePrice={live.salePrice}
          stock={live.stock}
        />
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-ink)]/10 bg-[var(--color-cream)]/95 backdrop-blur transition-transform duration-300",
          showSticky ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[var(--color-cream-dark)]">
              <Image src={image} alt={name} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name}</p>
              <div className="flex items-center gap-2 text-sm">
                {live.salePrice ? (
                  <>
                    <span className="font-semibold">{formatINR(live.salePrice)}</span>
                    <span className="text-[var(--color-ink-soft)]/60 line-through">
                      {formatINR(live.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">{formatINR(live.price)}</span>
                )}
              </div>
            </div>
          </div>
          <Button
            disabled={live.stock === 0}
            onClick={() => {
              addItem({
                productId,
                name,
                slug,
                image,
                price: live.price,
                salePrice: live.salePrice,
                quantity: 1,
                stock: live.stock,
              });
              toast.success(`${name} added to bag`);
            }}
          >
            {live.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </>
  );
}
