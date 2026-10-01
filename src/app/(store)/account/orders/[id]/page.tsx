import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { OrderDetailLive } from "@/components/store/order-detail-live";
import { Reveal } from "@/components/ui/reveal";

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
        <Reveal className="lg:col-span-2">
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
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1} className="rounded-xl border border-[var(--color-ink)]/10 p-5">
            <h2 className="font-display font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-[var(--color-ink)]/5">
              {order.items.map((item) => (
                <li key={item.id} className="group flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="flex items-center gap-3">
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
                    <span className="text-[var(--color-ink-soft)]">
                      {item.name} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-[var(--color-ink)]/10 pt-3 font-semibold">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="rounded-xl border border-[var(--color-ink)]/10 p-5">
            <h2 className="font-display font-semibold">Shipping Address</h2>
            <p className="mt-2 text-sm">{order.address.fullName}</p>
            <p className="text-sm text-[var(--color-ink-soft)]">{order.address.phone}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city},{" "}
              {order.address.state} {order.address.postalCode}
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
