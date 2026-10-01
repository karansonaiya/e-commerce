import { Package, ShoppingCart, Users, IndianRupee } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [orderCount, productCount, userCount, revenue, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "Paid" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { id: true, name: true, image: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total Revenue", value: formatINR(revenue._sum.total ?? 0), icon: IndianRupee },
    { label: "Orders", value: orderCount, icon: ShoppingCart },
    { label: "Products", value: productCount, icon: Package },
    { label: "Customers", value: userCount, icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-11 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand-dark)]">
                <s.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-ink-soft)]">{s.label}</p>
                <p className="font-display text-xl font-semibold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="font-display mt-10 text-lg font-semibold">Recent Orders</h2>
      <Card className="mt-4">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ink)]/10 text-left text-[var(--color-ink-soft)]">
                <th className="p-4">Order</th>
                <th className="p-4">Product</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--color-ink)]/5 last:border-0">
                  <td className="p-4 font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">
                    <div className="flex items-center -space-x-2" title={order.items.map((i) => i.name).join(", ")}>
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="relative size-8 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[var(--color-cream-dark)]"
                        >
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[var(--color-ink)] text-[10px] font-semibold text-white">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-[var(--color-ink-soft)]">
                    {order.user.name ?? order.user.email}
                  </td>
                  <td className="p-4">
                    <Badge variant="soft">{order.status}</Badge>
                  </td>
                  <td className="p-4 font-medium">{formatINR(order.total)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-[var(--color-ink-soft)]">
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
