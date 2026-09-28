import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { createCategory, deleteCategory } from "@/actions/categories";

export const metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Categories</h1>

      <Card className="mt-6 max-w-lg">
        <CardContent className="p-5">
          <h2 className="font-display font-semibold">Add Category</h2>
          <form action={createCategory} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input id="slug" name="slug" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" className="mt-1.5" />
            </div>
            <Button type="submit">Add Category</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ink)]/10 text-left text-[var(--color-ink-soft)]">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Products</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-[var(--color-ink)]/5 last:border-0">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-[var(--color-ink-soft)]">{c.slug}</td>
                  <td className="p-4">{c._count.products}</td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <DeleteButton action={deleteCategory.bind(null, c.id)} confirmText={`Delete "${c.name}"?`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
