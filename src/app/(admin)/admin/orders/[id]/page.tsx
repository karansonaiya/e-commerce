import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { OrderTrackingForm } from "@/components/admin/order-tracking-form";
import { OrderTimeline } from "@/components/store/order-timeline";

export const metadata = { title: "Order Details — Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true, user: true },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <Card className="mt-6">
        <CardContent className="p-5">
          <OrderTimeline status={order.status} />
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h2 className="font-display font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-[var(--color-ink)]/5">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-5 py-5 text-sm">
                  <div className="relative size-36 shrink-0 overflow-hidden rounded-lg border border-[var(--color-ink)]/10 bg-[var(--color-cream-dark)] w-[220px] h-[250px]">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <span className="flex-1 text-base font-medium">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-[var(--color-ink)]/10 pt-4 text-sm">
              <div className="flex justify-between text-[var(--color-ink-soft)]">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--color-ink-soft)]">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? "Free" : formatINR(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-ink)]/10 pt-2 font-semibold">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display font-semibold">Customer</h2>
              <p className="mt-2 text-sm">{order.user.name ?? "—"}</p>
              <p className="text-sm text-[var(--color-ink-soft)]">{order.user.email}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display font-semibold">Shipping Address</h2>
              <p className="mt-2 text-sm">{order.address.fullName}</p>
              <p className="text-sm text-[var(--color-ink-soft)]">{order.address.phone}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city},{" "}
                {order.address.state} {order.address.postalCode}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display font-semibold">Shipping & Tracking</h2>
              <div className="mt-3">
                <OrderTrackingForm
                  orderId={order.id}
                  trackingNumber={order.trackingNumber}
                  courierName={order.courierName}
                  trackingUrl={order.trackingUrl}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display font-semibold">Payment</h2>
              <Badge variant={order.paymentStatus === "Paid" ? "success" : "soft"} className="mt-2">
                {order.paymentStatus}
              </Badge>
              {order.cfPaymentId && (
                <p className="mt-2 break-all text-xs text-[var(--color-ink-soft)]/70">
                  Payment ID: {order.cfPaymentId}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
