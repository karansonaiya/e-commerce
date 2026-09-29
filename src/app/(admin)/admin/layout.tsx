import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  ArrowLeft,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { SITE_NAME } from "@/lib/constants";
import { SignOutButton } from "@/components/store/sign-out-button";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || !isAdminEmail(session.user.email)) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-cream)]">
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r border-[var(--color-ink)]/10 bg-white lg:flex">
        <div className="flex items-center px-6 py-5">
          <span className="font-display text-xl font-bold text-[var(--color-ink)]">
            {SITE_NAME.toUpperCase()}
          </span>
          <span className="ml-2 rounded-full bg-[var(--color-brand)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--color-brand)]">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-ink-soft)] transition hover:bg-[var(--color-cream-dark)] hover:text-[var(--color-ink)]"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[var(--color-ink)]/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-cream-dark)]"
          >
            <ArrowLeft className="size-4" />
            Back to App
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--color-ink)]/10 bg-white px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="size-4" />
            Back to App
          </Link>
        </header>
        <header className="hidden shrink-0 items-center justify-between border-b border-[var(--color-ink)]/10 bg-white px-8 py-4 lg:flex">
          <p className="text-sm text-[var(--color-ink-soft)]">
            Signed in as <span className="font-medium text-[var(--color-ink)]">{session.user.email}</span>
          </p>
          <SignOutButton />
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
