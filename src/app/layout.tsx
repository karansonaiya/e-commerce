import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { auth } from "@/lib/auth";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Westoria — Premium Skincare & Haircare",
    template: "%s | Westoria",
  },
  description:
    "Westoria crafts premium face wash, serums, and shampoos made with clean, effective ingredients for skin and hair that glow.",
  openGraph: {
    title: "Westoria — Premium Skincare & Haircare",
    description:
      "Westoria crafts premium face wash, serums, and shampoos made with clean, effective ingredients for skin and hair that glow.",
    url: siteUrl,
    siteName: "Westoria",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
