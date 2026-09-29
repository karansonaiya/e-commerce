import Link from "next/link";
import { Camera, MessageCircle, Share2 } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-24 bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="container-x grid gap-12 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <span className="font-display text-2xl font-semibold tracking-wide text-white">
            {SITE_NAME.toUpperCase()}
          </span>
          <p className="mt-4 max-w-sm text-sm text-[var(--color-cream)]/70">
            Premium face wash, serums, and shampoos made with clean, effective
            ingredients — crafted for skin and hair that glow.
          </p>
          <div className="mt-6 flex gap-3">
            {[Camera, MessageCircle, Share2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex size-9 items-center justify-center rounded-full border border-white/20 transition hover:bg-[var(--color-brand)] hover:border-[var(--color-brand)]"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Shop" links={FOOTER_LINKS.shop} />
        <FooterCol title="Company" links={FOOTER_LINKS.company} />
        <FooterCol title="Legal" links={FOOTER_LINKS.legal} />
      </div>

      <Separator className="bg-white/10" />

      <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-[var(--color-cream)]/60 md:flex-row">
        <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        <p>Made with care in India · Secure payments via Cashfree</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
      <ul className="space-y-2.5 text-sm text-[var(--color-cream)]/70">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
