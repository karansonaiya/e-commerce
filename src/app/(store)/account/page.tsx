import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { SignOutButton } from "@/components/store/sign-out-button";

export const metadata = { title: "My Account" };

const STATUS_VARIANT: Record<string, "soft" | "warning" | "success" | "destructive"> = {
  Pending: "soft",
  Processing: "warning",
  Shipped: "warning",
  Delivered: "success",
  Cancelled: "destructive",
};

export default async function AccountPage() {
  const session = await auth();
  const user = session!.user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-x py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.image && (
            <Image src={user.image} alt={user.name ?? ""} width={56} height={56} className="rounded-full" />
          )}
          <div>
            <h1 className="font-display text-2xl font-semibold">{user.name ?? "Your Account"}</h1>
            <p className="text-sm text-[var(--color-ink-soft)]">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </div>

      <h2 className="font-display mt-10 text-xl font-semibold">Order History</h2>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/collections/all" className="font-medium text-[var(--color-brand)]">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-[var(--color-ink)]/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-[var(--color-ink-soft)]/70">
                    {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[order.status] ?? "soft"}>{order.status}</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-[var(--color-ink-soft)]">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold">{formatINR(order.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
