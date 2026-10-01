"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { ProductCard as ProductCardType } from "@/types";

export function WishlistView() {
  const productIds = useWishlistStore((s) => s.productIds);
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [loading, setLoading] = useState(productIds.length > 0);

  useEffect(() => {
    if (productIds.length === 0) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- marks the start of the fetch this effect performs, resolved in the .then/.finally below
    setLoading(true);
    fetch("/api/products/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: productIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  if (productIds.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
        <Heart className="size-10 text-[var(--color-ink-soft)]/30" />
        <p className="text-[var(--color-ink-soft)]">Your wishlist is empty.</p>
        <Link href="/collections/all" className="font-medium text-[var(--color-brand-dark)]">
          Start shopping
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="mt-8 text-sm text-[var(--color-ink-soft)]">Loading...</p>;
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
