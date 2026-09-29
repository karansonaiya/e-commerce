import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderCode, phone } = await req.json();

  if (!orderCode || typeof orderCode !== "string" || !phone || typeof phone !== "string") {
    return NextResponse.json({ error: "Order ID and phone number are required" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      id: { endsWith: orderCode.trim(), mode: "insensitive" },
      address: { phone: phone.trim() },
    },
    include: { items: true, address: true },
  });

  if (!order) {
    return NextResponse.json(
      { error: "No order found with that Order ID and phone number." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: order.id,
    userId: order.userId,
    status: order.status,
    total: order.total,
    trackingNumber: order.trackingNumber,
    courierName: order.courierName,
    trackingUrl: order.trackingUrl,
    createdAtLabel: order.createdAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    items: order.items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
  });
}
