"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/orders";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          try {
            await updateOrderStatus(orderId, next);
            toast.success(`Order status updated to ${next}`);
          } catch {
            toast.error("Could not update order status");
          }
        });
      }}
      className="rounded-md border border-[var(--color-ink)]/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-[var(--color-brand)] disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
