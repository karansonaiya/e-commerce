import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Customers — Admin" };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Customers</h1>

      <Card className="mt-6">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ink)]/10 text-left text-[var(--color-ink-soft)]">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-[var(--color-ink)]/5 last:border-0">
                  <td className="p-4 font-medium">{c.name ?? "—"}</td>
                  <td className="p-4 text-[var(--color-ink-soft)]">{c.email}</td>
                  <td className="p-4">
                    <Badge variant={c.role === "admin" ? "default" : "soft"}>{c.role}</Badge>
                  </td>
                  <td className="p-4">{c._count.orders}</td>
                  <td className="p-4 text-[var(--color-ink-soft)]">
                    {c.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
