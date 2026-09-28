import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/actions/products";

export const metadata = { title: "Add Product — Admin" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Add Product</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} categories={categories} />
      </div>
    </div>
  );
}
