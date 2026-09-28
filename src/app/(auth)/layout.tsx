import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-cream)] px-4 py-12">
      <Link href="/" className="font-display mb-8 text-3xl font-bold tracking-wide text-[var(--color-ink)]">
        {SITE_NAME.toUpperCase()}
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-ink)]/10 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
