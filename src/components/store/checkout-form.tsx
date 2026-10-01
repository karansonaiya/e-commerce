"use client";

import { useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/ui/reveal";
import { useCartStore } from "@/stores/cart-store";
import { formatINR } from "@/lib/utils";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";

type CashfreeCheckoutOptions = {
  paymentSessionId: string;
  redirectTarget: "_self";
};

declare global {
  interface Window {
    Cashfree: (config: { mode: "sandbox" | "production" }) => {
      checkout: (options: CashfreeCheckoutOptions) => Promise<unknown>;
    };
  }
}

const SHIPPING_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 599;

export function CheckoutForm() {
  const { items, subtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India" },
  });

  const sub = subtotal();
  const shippingFee = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, sub - discount) + shippingFee;

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal: sub }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscount(0);
      setCouponMessage(data.error);
      return;
    }
    setDiscount(data.discount);
    setCouponMessage(`Coupon "${data.code}" applied — you saved ${formatINR(data.discount)}`);
  }

  async function onSubmit(address: AddressInput) {
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    setSubmitting(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: couponCode || undefined,
          discount,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error ?? "Could not place order");

      const cfRes = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });
      const cfData = await cfRes.json();
      if (!cfRes.ok) throw new Error(cfData.error ?? "Payment gateway error");

      if (typeof window.Cashfree === "undefined") {
        throw new Error("Payment gateway failed to load. Please refresh and try again.");
      }

      // Cart is cleared on the return page once payment is confirmed server-side —
      // this navigates the whole tab to Cashfree's hosted checkout.
      const cashfree = window.Cashfree({ mode: cfData.mode });
      await cashfree.checkout({
        paymentSessionId: cfData.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h2 className="font-display text-lg font-semibold">Shipping Address</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} className="mt-1.5" />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone")} className="mt-1.5" />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="line1">Address</Label>
            <Textarea id="line1" {...register("line1")} className="mt-1.5" />
            {errors.line1 && <p className="mt-1 text-xs text-red-600">{errors.line1.message}</p>}
          </div>

          <div>
            <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
            <Input id="line2" {...register("line2")} className="mt-1.5" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} className="mt-1.5" />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} className="mt-1.5" />
              {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register("postalCode")} className="mt-1.5" />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Redirecting to payment..." : `Pay ${formatINR(total)}`}
          </Button>
        </form>
        </Reveal>

        <Reveal delay={0.15} className="rounded-xl border border-[var(--color-ink)]/10 p-6">
          <h2 className="font-display text-lg font-semibold">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-[var(--color-ink-soft)]">
                <span className="line-clamp-1">{item.name} × {item.quantity}</span>
                <span>{formatINR((item.salePrice ?? item.price) * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={applyCoupon}>
              Apply
            </Button>
          </div>
          {couponMessage && <p className="mt-2 text-xs text-[var(--color-ink-soft)]">{couponMessage}</p>}

          <div className="mt-4 space-y-1.5 border-t border-[var(--color-ink)]/10 pt-4 text-sm">
            <div className="flex justify-between text-[var(--color-ink-soft)]">
              <span>Subtotal</span>
              <span>{formatINR(sub)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[var(--color-ink-soft)]">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-ink)]/10 pt-2 text-base font-semibold text-[var(--color-ink)]">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
