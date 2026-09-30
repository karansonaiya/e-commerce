import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/data/products";

export async function POST(req: Request) {
  const { ids } = (await req.json()) as { ids?: string[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await getProductsByIds(ids);
  return NextResponse.json({ products });
}
