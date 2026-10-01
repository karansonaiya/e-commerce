"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { formatINR } from "@/lib/utils";
import { subscribeRealtime } from "@/lib/realtime-client";

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
  items: { id: string; name: string; quantity: number; image: string | null }[];
};

export function OrderHistoryLive({ userId, initialOrders }: { userId: string; initialOrders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    function handleUpdate(payload: unknown) {
      const p = payload as { orderId: string; userId: string; status: string };
      if (p.userId !== userId) return;
      setOrders((prev) =>
        prev.map((o) => (o.id === p.orderId ? { ...o, status: p.status } : o))
      );
    }

    return subscribeRealtime("order:update", handleUpdate);
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
      {orders.map((order, idx) => (
        <Reveal key={order.id} delay={idx * 0.06}>
          <Link
            href={`/account/orders/${order.id}`}
            className="group block rounded-xl border border-[var(--color-ink)]/10 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-brand)]/40 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-[var(--color-ink-soft)]/70">{order.createdAtLabel}</p>
              </div>
              <Badge variant={STATUS_VARIANT[order.status] ?? "soft"}>{order.status}</Badge>
            </div>
            <ul className="mt-3 space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 text-sm text-[var(--color-ink-soft)]">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-[var(--color-ink)]/10 bg-[var(--color-cream-dark)]">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    )}
                  </div>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-semibold">{formatINR(order.total)}</p>
              <span className="text-xs font-medium text-[var(--color-brand)] transition-transform duration-300 group-hover:translate-x-1">
                Track order →
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
