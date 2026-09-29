"use client";

import { Badge } from "@/components/ui/badge";
import { AddToCartForm } from "@/components/store/add-to-cart-form";
import { useProductLive } from "@/hooks/use-product-live";
import { formatINR, discountPercent } from "@/lib/utils";

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

      <div className="mt-6">
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
    </>
  );
}
