import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
  }
  if (subtotal < coupon.minOrderValue) {
    return NextResponse.json(
      { error: `Minimum order value of ₹${coupon.minOrderValue} required` },
      { status: 400 }
    );
  }

  const discount =
    coupon.discountType === "percent"
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : coupon.discountValue;

  return NextResponse.json({ code: coupon.code, discount: Math.min(discount, subtotal) });
}
