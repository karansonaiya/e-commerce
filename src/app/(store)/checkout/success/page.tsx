import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

export const metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const session = await auth();

  if (!orderId || !session?.user?.id) notFound();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { items: true, address: true },
  });

  if (!order) notFound();

  return (
    <div className="container-x flex flex-col items-center py-20 text-center">
      <CheckCircle2 className="size-16 text-emerald-600" />
      <h1 className="font-display mt-4 text-3xl font-semibold">Order Confirmed!</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        Thank you, {order.address.fullName}. Your order #{order.id.slice(-8).toUpperCase()} has been placed.
      </p>

      <div className="mt-8 w-full max-w-md rounded-xl border border-[var(--color-ink)]/10 p-6 text-left">
        <h2 className="font-display font-semibold">Order Summary</h2>
        <ul className="mt-3 space-y-1.5 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-[var(--color-ink-soft)]">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatINR(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-[var(--color-ink)]/10 pt-3 font-semibold">
          <span>Total Paid</span>
          <span>{formatINR(order.total)}</span>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-soft)]/70">
          Shipping to: {order.address.line1}, {order.address.city}, {order.address.state} {order.address.postalCode}
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/account">View Orders</Link>
        </Button>
        <Button asChild>
          <Link href="/collections/all">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
