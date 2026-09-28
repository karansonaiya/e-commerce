import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { deleteProduct } from "@/actions/products";
import { DeleteButton } from "@/components/admin/delete-button";

export const metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ink)]/10 text-left text-[var(--color-ink-soft)]">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Tags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const image = p.images.split(",")[0]?.trim();
                return (
                  <tr key={p.id} className="border-b border-[var(--color-ink)]/5 last:border-0">
                    <td className="flex items-center gap-3 p-4">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-[var(--color-cream-dark)]">
                        {image && <Image src={image} alt={p.name} fill className="object-cover" />}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="p-4 text-[var(--color-ink-soft)]">{p.category.name}</td>
                    <td className="p-4">
                      {formatINR(p.salePrice ?? p.price)}
                      {p.salePrice && (
                        <span className="ml-1 text-[var(--color-ink-soft)]/60 line-through">
                          {formatINR(p.price)}
                        </span>
                      )}
                    </td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {p.featured && <Badge variant="soft">Featured</Badge>}
                        {p.isBestseller && <Badge variant="gold">Bestseller</Badge>}
                        {p.isNewArrival && <Badge variant="outline">New</Badge>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="rounded-md p-1.5 text-[var(--color-ink-soft)] transition hover:bg-[var(--color-cream-dark)]"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <DeleteButton action={deleteProduct.bind(null, p.id)} confirmText={`Delete "${p.name}"?`} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-[var(--color-ink-soft)]">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
