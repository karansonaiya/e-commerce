"use client";

import { useEffect, useState } from "react";
import { subscribeRealtime } from "@/lib/realtime-client";

export type ProductLiveState = {
  stock: number;
  price: number;
  salePrice: number | null;
};

type ProductUpdatePayload = {
  id: string;
  stock?: number;
  price?: number;
  salePrice?: number | null;
};

/** Subscribes to realtime stock/price changes for one product (admin edits, or
 * stock decrementing when someone else completes a purchase). */
export function useProductLive(productId: string, initial: ProductLiveState) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    // Resync local state when navigating to a different product (client-side
    // route change reuses this component instance rather than remounting it).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    function handleUpdate(payload: unknown) {
      const p = payload as ProductUpdatePayload;
      if (p.id !== productId) return;
      setState((prev) => ({
        stock: p.stock ?? prev.stock,
        price: p.price ?? prev.price,
        salePrice: p.salePrice !== undefined ? p.salePrice : prev.salePrice,
      }));
    }

    function handleDelete(payload: unknown) {
      const p = payload as { id: string };
      if (p.id !== productId) return;
      setState((prev) => ({ ...prev, stock: 0 }));
    }

    const unsubUpdate = subscribeRealtime("product:update", handleUpdate);
    const unsubDelete = subscribeRealtime("product:delete", handleDelete);
    return () => {
      unsubUpdate();
      unsubDelete();
    };
  }, [productId]);

  return state;
}
