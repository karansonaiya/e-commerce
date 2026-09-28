import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const categories = await Promise.all(
    [
      { name: "Face Wash", slug: "face-wash", description: "Gentle, effective cleansers for every skin type.", image: "/images/category-face-wash.svg" },
      { name: "Serum", slug: "serum", description: "Targeted actives for visible, lasting results.", image: "/images/category-serum.svg" },
      { name: "Shampoo", slug: "shampoo", description: "Sulphate-free formulas for strong, shiny hair.", image: "/images/category-shampoo.svg" },
    ].map((c) =>
      prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c })
    )
  );

  const [faceWash, serum, shampoo] = categories;

  const products = [
    {
      name: "Glow Foam Cleanser",
      slug: "glow-foam-cleanser",
      description:
        "A soft, foaming face wash that lifts away dirt and excess oil without stripping your skin's natural moisture. Formulated with niacinamide and aloe vera for a fresh, radiant finish every morning.",
      shortTagline: "Foaming cleanser for radiant, balanced skin",
      images: "/images/products/face-wash-1.svg",
      price: 499,
      salePrice: 399,
      stock: 60,
      categoryId: faceWash.id,
      featured: true,
      isBestseller: true,
      ingredients: "Aqua, Niacinamide, Aloe Vera Extract, Glycerin, Coco Glucoside, Panthenol.",
      scentNotes: "Citrus · Aloe · Light Floral",
      rating: 4.8,
      reviewCount: 214,
    },
    {
      name: "Charcoal Detox Wash",
      slug: "charcoal-detox-wash",
      description:
        "Activated charcoal deep-cleans pores and draws out impurities, leaving skin visibly clearer and matte. Ideal for oily and combination skin types prone to breakouts.",
      shortTagline: "Deep pore cleanse for oily & combination skin",
      images: "/images/products/face-wash-2.svg",
      price: 549,
      salePrice: null,
      stock: 40,
      categoryId: faceWash.id,
      featured: true,
      isBestseller: false,
      isNewArrival: true,
      ingredients: "Aqua, Activated Charcoal, Salicylic Acid, Tea Tree Oil, Glycerin.",
      scentNotes: "Tea Tree · Eucalyptus · Mint",
      rating: 4.6,
      reviewCount: 132,
    },
    {
      name: "Rose Hydra Wash",
      slug: "rose-hydra-wash",
      description:
        "A creamy, sulphate-free cleanser infused with rose water and hyaluronic acid to hydrate as it cleans. Perfect for dry and sensitive skin.",
      shortTagline: "Hydrating cleanser with rose water",
      images: "/images/products/face-wash-3.svg",
      price: 449,
      salePrice: 349,
      stock: 55,
      categoryId: faceWash.id,
      featured: false,
      isBestseller: false,
      isNewArrival: true,
      ingredients: "Aqua, Rose Water, Hyaluronic Acid, Shea Butter, Glycerin.",
      scentNotes: "Rose · Vanilla · Musk",
      rating: 4.7,
      reviewCount: 98,
    },
    {
      name: "Vitamin C Radiance Serum",
      slug: "vitamin-c-radiance-serum",
      description:
        "A potent 15% Vitamin C serum that brightens dull skin, fades dark spots, and boosts collagen production for a firmer, more even complexion.",
      shortTagline: "15% Vitamin C for brighter, even-toned skin",
      images: "/images/products/serum-1.svg",
      price: 899,
      salePrice: 699,
      stock: 45,
      categoryId: serum.id,
      featured: true,
      isBestseller: true,
      ingredients: "Aqua, Ascorbic Acid (15%), Vitamin E, Ferulic Acid, Hyaluronic Acid.",
      scentNotes: "Citrus · Orange Peel",
      rating: 4.9,
      reviewCount: 301,
    },
    {
      name: "Hyaluronic Glow Serum",
      slug: "hyaluronic-glow-serum",
      description:
        "Multi-molecular hyaluronic acid delivers deep, long-lasting hydration for plump, dewy skin — suitable for all skin types, even the most sensitive.",
      shortTagline: "Deep hydration with multi-weight hyaluronic acid",
      images: "/images/products/serum-2.svg",
      price: 799,
      salePrice: null,
      stock: 50,
      categoryId: serum.id,
      featured: false,
      isBestseller: false,
      isNewArrival: true,
      ingredients: "Aqua, Sodium Hyaluronate, Panthenol, Glycerin, Allantoin.",
      scentNotes: "Fragrance-free",
      rating: 4.8,
      reviewCount: 176,
    },
    {
      name: "Niacinamide Clear Serum",
      slug: "niacinamide-clear-serum",
      description:
        "10% Niacinamide + Zinc regulates oil production, minimizes pores, and calms redness — a daily essential for acne-prone and combination skin.",
      shortTagline: "10% Niacinamide + Zinc for clearer skin",
      images: "/images/products/serum-3.svg",
      price: 649,
      salePrice: 549,
      stock: 65,
      categoryId: serum.id,
      featured: true,
      isBestseller: true,
      ingredients: "Aqua, Niacinamide (10%), Zinc PCA, Glycerin, Panthenol.",
      scentNotes: "Fragrance-free",
      rating: 4.7,
      reviewCount: 245,
    },
    {
      name: "Argan Repair Shampoo",
      slug: "argan-repair-shampoo",
      description:
        "Sulphate-free shampoo enriched with Moroccan argan oil to repair damaged, frizzy hair while restoring natural shine and softness.",
      shortTagline: "Sulphate-free repair with Moroccan argan oil",
      images: "/images/products/shampoo-1.svg",
      price: 599,
      salePrice: 449,
      stock: 70,
      categoryId: shampoo.id,
      featured: true,
      isBestseller: true,
      ingredients: "Aqua, Argan Oil, Cocamidopropyl Betaine, Keratin, Panthenol.",
      scentNotes: "Argan · Sandalwood",
      rating: 4.8,
      reviewCount: 289,
    },
    {
      name: "Volume Boost Shampoo",
      slug: "volume-boost-shampoo",
      description:
        "Lightweight, volumizing formula that lifts hair from the root without weighing it down — ideal for fine or flat hair.",
      shortTagline: "Root-lifting volume for fine hair",
      images: "/images/products/shampoo-2.svg",
      price: 549,
      salePrice: null,
      stock: 48,
      categoryId: shampoo.id,
      featured: false,
      isBestseller: false,
      isNewArrival: true,
      ingredients: "Aqua, Biotin, Wheat Protein, Cocamidopropyl Betaine.",
      scentNotes: "Citrus · Green Apple",
      rating: 4.5,
      reviewCount: 87,
    },
    {
      name: "Anti-Dandruff Shampoo",
      slug: "anti-dandruff-shampoo",
      description:
        "Clinically-proven anti-dandruff formula with zinc pyrithione that calms an itchy, flaky scalp while keeping hair soft and manageable.",
      shortTagline: "Clinically-proven relief from dandruff & itch",
      images: "/images/products/shampoo-3.svg",
      price: 499,
      salePrice: 399,
      stock: 58,
      categoryId: shampoo.id,
      featured: false,
      isBestseller: false,
      isNewArrival: true,
      ingredients: "Aqua, Zinc Pyrithione, Tea Tree Oil, Menthol.",
      scentNotes: "Tea Tree · Mint",
      rating: 4.6,
      reviewCount: 154,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WEST10" },
    update: {},
    create: {
      code: "WEST10",
      description: "10% off your first order",
      discountType: "percent",
      discountValue: 10,
      minOrderValue: 0,
      isActive: true,
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL ?? "sonaiyakaran339@gmail.com";
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin" },
    create: {
      email: adminEmail,
      name: "Westoria Admin",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login → email: ${adminEmail} / password: Admin@123 (or use Google Sign-In)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
