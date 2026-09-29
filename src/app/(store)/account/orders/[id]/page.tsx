import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { OrderDetailLive } from "@/components/store/order-detail-live";

export const metadata = { title: "Order Details" };

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true, address: true },
  });
  if (!order) notFound();

  return (
    <div className="container-x py-12">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
      >
        <ArrowLeft className="size-4" />
        Back to Account
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Placed on{" "}
            {order.createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderDetailLive
            order={{
              id: order.id,
              userId: order.userId,
              status: order.status,
              trackingNumber: order.trackingNumber,
              courierName: order.courierName,
              trackingUrl: order.trackingUrl,
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--color-ink)]/10 p-5">
            <h2 className="font-display font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-[var(--color-ink)]/5">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-2.5 text-sm">
                  <span className="text-[var(--color-ink-soft)]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-[var(--color-ink)]/10 pt-3 font-semibold">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-ink)]/10 p-5">
            <h2 className="font-display font-semibold">Shipping Address</h2>
            <p className="mt-2 text-sm">{order.address.fullName}</p>
            <p className="text-sm text-[var(--color-ink-soft)]">{order.address.phone}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city},{" "}
              {order.address.state} {order.address.postalCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
