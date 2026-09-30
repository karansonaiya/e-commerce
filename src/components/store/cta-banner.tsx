import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CtaBanner() {
  return (
    <section className="container-x py-16">
      <Reveal variant="zoom" className="relative overflow-hidden rounded-2xl">
        <div className="relative h-72 sm:h-80">
          <Image src="/images/hero-2.svg" alt="Limited time offer" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
            Limited Time Offer
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Get 10% Off Your First Order</h2>
          <p className="mt-2 text-white/85">Use code WEST10 at checkout</p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/collections/all">Shop the Sale</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
