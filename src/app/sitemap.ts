import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });

  const staticRoutes = [
    "",
    "/collections/all",
    "/collections/face-wash",
    "/collections/serum",
    "/collections/shampoo",
    "/about",
    "/contact",
    "/legal/privacy-policy",
    "/legal/terms-of-service",
    "/legal/refund-policy",
    "/legal/shipping-policy",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...productRoutes];
}
