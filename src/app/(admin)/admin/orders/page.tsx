import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Orders</h1>

      <Card className="mt-6">
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ink)]/10 text-left text-[var(--color-ink-soft)]">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--color-ink)]/5 last:border-0">
                  <td className="p-4 font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-[var(--color-brand)]">
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="p-4 text-[var(--color-ink-soft)]">
                    {order.user.name ?? order.user.email}
                  </td>
                  <td className="p-4">
                    <Badge variant={order.paymentStatus === "Paid" ? "success" : "soft"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">{formatINR(order.total)}</td>
                  <td className="p-4">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                  <td className="p-4 text-[var(--color-ink-soft)]">
                    {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-[var(--color-ink-soft)]">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
