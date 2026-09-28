"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatINR } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Your Bag ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-[var(--color-ink-soft)]/40" />
            <p className="text-sm text-[var(--color-ink-soft)]">Your bag is empty.</p>
            <Button onClick={closeCart} asChild>
              <Link href="/collections/all">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-[var(--color-cream-dark)]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-brand)]"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          aria-label="Remove item"
                          className="text-[var(--color-ink-soft)]/50 hover:text-[var(--color-brand)]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-semibold">
                        {formatINR((item.salePrice ?? item.price) * item.quantity)}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-[var(--color-ink)]/15">
                          <button
                            className="p-1.5"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            className="p-1.5"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--color-ink)]/10 px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-[var(--color-ink-soft)]">Subtotal</span>
                <span className="font-display text-lg font-semibold">{formatINR(subtotal())}</span>
              </div>
              <Button asChild className="w-full" size="lg" onClick={closeCart}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="mt-2.5 w-full" onClick={closeCart}>
                <Link href="/cart">View Bag</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
