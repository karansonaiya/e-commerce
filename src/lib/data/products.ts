import { prisma } from "@/lib/prisma";

const cardSelect = {
  id: true,
  name: true,
  slug: true,
  images: true,
  price: true,
  salePrice: true,
  rating: true,
  reviewCount: true,
  scentNotes: true,
  stock: true,
  category: { select: { name: true, slug: true } },
} as const;

export async function getBestsellers(take = 5) {
  return prisma.product.findMany({
    where: { isBestseller: true },
    select: cardSelect,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewArrivals(take = 5) {
  return prisma.product.findMany({
    where: { isNewArrival: true },
    select: cardSelect,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { featured: true },
    select: cardSelect,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductsByCategorySlug(slug: string) {
  if (slug === "all") {
    return prisma.product.findMany({
      select: cardSelect,
      orderBy: { createdAt: "desc" },
    });
  }
  return prisma.product.findMany({
    where: { category: { slug } },
    select: cardSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    select: cardSelect,
    take,
  });
}

export async function searchProducts(query: string) {
  if (!query.trim()) return [];
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { scentNotes: { contains: query } },
      ],
    },
    select: cardSelect,
    take: 24,
  });
}
