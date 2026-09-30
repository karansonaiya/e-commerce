import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations/checkout";

const SHIPPING_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 599;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in to place an order" }, { status: 401 });
  }

  const body = await req.json();
  const { address, items, couponCode, discount = 0 } = body as {
    address: unknown;
    items: { productId: string; quantity: number }[];
    couponCode?: string;
    discount?: number;
  };

  const parsedAddress = addressSchema.safeParse(address);
  if (!parsedAddress.success) {
    return NextResponse.json(
      { error: parsedAddress.error.issues[0]?.message ?? "Invalid address" },
      { status: 400 }
    );
  }

  if (!items?.length) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    let subtotal = 0;
    const orderItemsData = items.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product) throw new Error("One of the items in your cart no longer exists");
      if (product.stock < cartItem.quantity) {
        throw new Error(`${product.name} is out of stock`);
      }
      const unitPrice = product.salePrice ?? product.price;
      subtotal += unitPrice * cartItem.quantity;
      return {
        productId: product.id,
        name: product.name,
        image: product.images.split(",")[0]?.trim(),
        price: unitPrice,
        quantity: cartItem.quantity,
      };
    });

    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount) + shippingFee;

    const savedAddress = await prisma.address.create({
      data: { ...parsedAddress.data, userId: session.user.id },
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: savedAddress.id,
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode: couponCode ?? null,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    return NextResponse.json({ orderId: order.id, total: order.total });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
