import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { finalizeOrderPayment } from "@/lib/finalize-order";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const result = await finalizeOrderPayment(order.id);

  if (!result.success) {
    return NextResponse.json({ success: false, status: result.status }, { status: 200 });
  }

  return NextResponse.json({ success: true, orderId: order.id });
}
