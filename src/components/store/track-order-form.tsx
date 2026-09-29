"use client";

import { useState } from "react";
import { Truck, Copy, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { OrderTimeline } from "@/components/store/order-timeline";
import { formatINR } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "soft" | "warning" | "success" | "destructive"> = {
  Pending: "soft",
  Processing: "warning",
  Shipped: "warning",
  Delivered: "success",
  Cancelled: "destructive",
};

type TrackedOrder = {
  id: string;
  status: string;
  total: number;
  createdAtLabel: string;
  trackingNumber: string | null;
  courierName: string | null;
  trackingUrl: string | null;
  items: { id: string; name: string; quantity: number }[];
};

export function TrackOrderForm() {
  const [orderCode, setOrderCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not find that order");
        return;
      }
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="orderCode">Order ID</Label>
          <Input
            id="orderCode"
            placeholder="e.g. A1B2C3D4"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            required
            className="mt-1.5"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="phone">Phone Number (used at checkout)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1.5"
          />
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          <Search className="size-4" />
          {loading ? "Searching..." : "Track"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-10 rounded-xl border border-[var(--color-ink)]/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display font-semibold">Order #{result.id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-[var(--color-ink-soft)]/70">{result.createdAtLabel}</p>
            </div>
            <Badge variant={STATUS_VARIANT[result.status] ?? "soft"}>{result.status}</Badge>
          </div>

          <div className="mt-6">
            <OrderTimeline status={result.status} />
          </div>

          {(result.trackingNumber || result.courierName) && (
            <div className="mt-6 flex items-start gap-3 rounded-lg bg-[var(--color-cream-dark)] p-4">
              <Truck className="mt-0.5 size-5 shrink-0 text-[var(--color-brand)]" />
              <div>
                {result.courierName && (
                  <p className="text-sm text-[var(--color-ink-soft)]">Courier: {result.courierName}</p>
                )}
                {result.trackingNumber && (
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="text-[var(--color-ink-soft)]">Tracking No: </span>
                    <span className="font-medium">{result.trackingNumber}</span>
                    <button
                      type="button"
                      aria-label="Copy tracking number"
                      onClick={() => {
                        navigator.clipboard.writeText(result.trackingNumber ?? "");
                        toast.success("Tracking number copied");
                      }}
                      className="text-[var(--color-ink-soft)]/60 hover:text-[var(--color-brand)]"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                )}
                {result.trackingUrl && (
                  <a
                    href={result.trackingUrl}
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

          <ul className="mt-6 space-y-1.5 divide-y divide-[var(--color-ink)]/5 text-sm">
            {result.items.map((item) => (
              <li key={item.id} className="flex justify-between pt-1.5 text-[var(--color-ink-soft)] first:pt-0">
                <span>{item.name} × {item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-[var(--color-ink)]/10 pt-3 font-semibold">
            <span>Total</span>
            <span>{formatINR(result.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
