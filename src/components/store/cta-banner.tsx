import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

export function CtaBanner() {
  return (
    <section className="container-x py-16">
      <Reveal variant="zoom" className="group relative overflow-hidden rounded-2xl bg-[var(--color-ink)]">
        <div className="relative h-72 overflow-hidden sm:h-80">
          <div className="absolute -right-16 -top-16 size-72 animate-pulse rounded-full bg-[var(--color-brand)]/20 blur-3xl [animation-duration:4s]" />
          <div className="absolute -bottom-20 -left-10 size-72 animate-pulse rounded-full bg-white/[0.06] blur-3xl [animation-duration:5s]" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              Limited Time Offer
            </p>
          </Reveal>
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
            <TextReveal text="Get 10% Off Your First Order" delay={0.1} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-2 text-white/85">Use code WEST10 at checkout</p>
          </Reveal>
          <Reveal delay={0.4}>
            <Button asChild size="lg" className="mt-6">
              <Link href="/collections/all">Shop the Sale</Link>
            </Button>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
