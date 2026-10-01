"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { totalItems, openCart } = useCartStore();
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-mount flag to avoid SSR/CSR cart-count mismatch
    setMounted(true);
  }, []);

  const isAdmin = session?.user?.isAdmin;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-ink)]/10 bg-[var(--color-cream)]/95 backdrop-blur">
      <div className="container-x flex h-18 items-center justify-between py-3">
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="p-2">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-2 py-3 text-sm font-medium hover:bg-[var(--color-cream-dark)]"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-2 py-3 text-sm font-medium text-[var(--color-brand)]"
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="font-display text-2xl font-bold tracking-wide text-[var(--color-ink)]">
          {SITE_NAME.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-base font-medium tracking-wide text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-brand)]",
                pathname === link.href && "text-[var(--color-brand)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="hidden items-center sm:flex">
            {searchOpen ? (
              <form
                action="/search"
                className="flex items-center gap-1 rounded-full border border-[var(--color-ink)]/15 bg-white px-3"
              >
                <input
                  autoFocus
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="h-9 w-44 bg-transparent text-sm outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X className="size-4 text-[var(--color-ink-soft)]" />
                </button>
              </form>
            ) : (
              <button aria-label="Search" className="p-2" onClick={() => setSearchOpen(true)}>
                <Search className="size-5" />
              </button>
            )}
          </div>

          {isAdmin && (
            <Button asChild size="sm" variant="dark" className="hidden sm:inline-flex">
              <Link href="/admin">Admin</Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Account" className="p-2">
                <User className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session?.user ? (
                <>
                  <DropdownMenuLabel>{session.user.name ?? session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/wishlist" aria-label="Wishlist" className="relative p-2">
            <Heart className="size-5" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-semibold text-[var(--color-ink)]">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button aria-label="Open cart" className="relative p-2" onClick={openCart}>
            <ShoppingBag className="size-5" />
            {mounted && totalItems() > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-semibold text-[var(--color-ink)]">
                {totalItems()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
