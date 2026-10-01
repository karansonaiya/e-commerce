"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { useCartStore } from "@/stores/cart-store";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container-x flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Reveal variant="pop">
          <ShoppingBag className="size-14 text-[var(--color-ink-soft)]/30" />
        </Reveal>
        <h1 className="font-display text-2xl font-semibold">Your bag is empty</h1>
        <p className="text-[var(--color-ink-soft)]">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/collections/all">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <h1 className="font-display text-3xl font-semibold">
        <TextReveal text="Your Bag" />
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {items.map((item, idx) => (
            <Reveal
              key={item.productId}
              delay={idx * 0.06}
              className="flex gap-4 rounded-xl border border-[var(--color-ink)]/10 p-4 transition-all duration-300 hover:border-[var(--color-brand)]/30 hover:shadow-md"
            >
              <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-[var(--color-cream-dark)]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-medium hover:text-[var(--color-brand-dark)]">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                      {formatINR(item.salePrice ?? item.price)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove item"
                    className="text-[var(--color-ink-soft)]/50 transition-all duration-300 hover:scale-110 hover:text-[var(--color-brand-dark)] active:scale-90"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-[var(--color-ink)]/15">
                    <button
                      className="p-2 transition-colors hover:text-[var(--color-brand-dark)]"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      className="p-2 transition-colors hover:text-[var(--color-brand-dark)]"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold">{formatINR((item.salePrice ?? item.price) * item.quantity)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade" delay={0.2} className="rounded-xl border border-[var(--color-ink)]/10 p-6">
          <h2 className="font-display text-lg font-semibold">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-[var(--color-ink-soft)]">
            <span>Subtotal</span>
            <span>{formatINR(subtotal())}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-[var(--color-ink-soft)]">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-[var(--color-ink)]/10 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>{formatINR(subtotal())}</span>
          </div>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
