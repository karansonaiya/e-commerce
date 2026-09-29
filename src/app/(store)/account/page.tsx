import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/store/sign-out-button";
import { OrderHistoryLive } from "@/components/store/order-history-live";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await auth();
  const user = session!.user;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const orderRows = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: order.total,
    createdAtLabel: order.createdAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    items: order.items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
  }));

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

      <OrderHistoryLive userId={user.id!} initialOrders={orderRows} />
    </div>
  );
}
