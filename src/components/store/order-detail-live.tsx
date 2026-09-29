"use client";

import { useEffect, useState } from "react";
import { Truck, Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { OrderTimeline } from "@/components/store/order-timeline";
import { subscribeRealtime } from "@/lib/realtime-client";

const STATUS_VARIANT: Record<string, "soft" | "warning" | "success" | "destructive"> = {
  Pending: "soft",
  Processing: "warning",
  Shipped: "warning",
  Delivered: "success",
  Cancelled: "destructive",
};

export type OrderDetailData = {
  id: string;
  userId: string;
  status: string;
  trackingNumber: string | null;
  courierName: string | null;
  trackingUrl: string | null;
};

export function OrderDetailLive({ order: initial }: { order: OrderDetailData }) {
  const [order, setOrder] = useState(initial);

  useEffect(() => {
    function handleUpdate(payload: unknown) {
      const p = payload as {
        orderId: string;
        userId: string;
        status: string;
        trackingNumber?: string | null;
        courierName?: string | null;
        trackingUrl?: string | null;
      };
      if (p.orderId !== initial.id || p.userId !== initial.userId) return;
      setOrder((prev) => ({
        ...prev,
        status: p.status,
        trackingNumber: p.trackingNumber !== undefined ? p.trackingNumber : prev.trackingNumber,
        courierName: p.courierName !== undefined ? p.courierName : prev.courierName,
        trackingUrl: p.trackingUrl !== undefined ? p.trackingUrl : prev.trackingUrl,
      }));
    }

    return subscribeRealtime("order:update", handleUpdate);
  }, [initial.id, initial.userId]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Badge variant={STATUS_VARIANT[order.status] ?? "soft"} className="text-sm">
          {order.status}
        </Badge>
      </div>

      <div className="mt-6 rounded-xl border border-[var(--color-ink)]/10 p-6">
        <OrderTimeline status={order.status} />
      </div>

      {(order.trackingNumber || order.courierName) && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--color-ink)]/10 p-5">
          <Truck className="mt-0.5 size-5 shrink-0 text-[var(--color-brand)]" />
          <div className="flex-1">
            <h3 className="font-display font-semibold">Shipment Tracking</h3>
            {order.courierName && (
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Courier: {order.courierName}</p>
            )}
            {order.trackingNumber && (
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="text-[var(--color-ink-soft)]">Tracking No: </span>
                <span className="font-medium">{order.trackingNumber}</span>
                <button
                  type="button"
                  aria-label="Copy tracking number"
                  onClick={() => {
                    navigator.clipboard.writeText(order.trackingNumber ?? "");
                    toast.success("Tracking number copied");
                  }}
                  className="text-[var(--color-ink-soft)]/60 hover:text-[var(--color-brand)]"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
            )}
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-[var(--color-brand)] hover:underline"
              >
                Track on courier website →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
