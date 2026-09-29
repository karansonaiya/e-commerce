"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { getSocket } from "@/lib/socket-client";

const STATUS_VARIANT: Record<string, "soft" | "warning" | "success" | "destructive"> = {
  Pending: "soft",
  Processing: "warning",
  Shipped: "warning",
  Delivered: "success",
  Cancelled: "destructive",
};

export type OrderRow = {
  id: string;
  status: string;
  total: number;
  createdAtLabel: string;
  items: { id: string; name: string; quantity: number }[];
};

export function OrderHistoryLive({ userId, initialOrders }: { userId: string; initialOrders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    const socket = getSocket();

    function handleUpdate(payload: { orderId: string; userId: string; status: string }) {
      if (payload.userId !== userId) return;
      setOrders((prev) =>
        prev.map((o) => (o.id === payload.orderId ? { ...o, status: payload.status } : o))
      );
    }

    socket.on("order:update", handleUpdate);
    return () => {
      socket.off("order:update", handleUpdate);
    };
  }, [userId]);

  if (orders.length === 0) {
    return (
      <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
        You haven&apos;t placed any orders yet.{" "}
        <Link href="/collections/all" className="font-medium text-[var(--color-brand)]">
          Start shopping
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block rounded-xl border border-[var(--color-ink)]/10 p-5 transition hover:border-[var(--color-brand)]/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-[var(--color-ink-soft)]/70">{order.createdAtLabel}</p>
            </div>
            <Badge variant={STATUS_VARIANT[order.status] ?? "soft"}>{order.status}</Badge>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-[var(--color-ink-soft)]">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-semibold">{formatINR(order.total)}</p>
            <span className="text-xs font-medium text-[var(--color-brand)]">Track order →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
