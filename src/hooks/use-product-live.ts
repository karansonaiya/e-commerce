"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket-client";

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
    const socket = getSocket();

    function handleUpdate(payload: ProductUpdatePayload) {
      if (payload.id !== productId) return;
      setState((prev) => ({
        stock: payload.stock ?? prev.stock,
        price: payload.price ?? prev.price,
        salePrice: payload.salePrice !== undefined ? payload.salePrice : prev.salePrice,
      }));
    }

    function handleDelete(payload: { id: string }) {
      if (payload.id !== productId) return;
      setState((prev) => ({ ...prev, stock: 0 }));
    }

    socket.on("product:update", handleUpdate);
    socket.on("product:delete", handleDelete);
    return () => {
      socket.off("product:update", handleUpdate);
      socket.off("product:delete", handleDelete);
    };
  }, [productId]);

  return state;
}
