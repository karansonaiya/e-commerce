import { Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-72 w-full overflow-hidden bg-[var(--color-ink)] sm:h-96">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[var(--color-brand)]/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 size-80 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Our Story</h1>
          <p className="mt-2 max-w-lg px-4 text-white/85">
            Building premium, honest skincare and haircare for modern India.
          </p>
        </div>
      </section>

      <section className="container-x py-16">
        <Reveal className="mx-auto max-w-3xl space-y-6 text-[var(--color-ink-soft)]">
          <p>
            Westoria was founded on a simple belief: everyday self-care rituals deserve
            premium formulations without the premium confusion. We started with three
            categories — face wash, serum, and shampoo — because we wanted to master
            the essentials before expanding.
          </p>
          <p>
            Every Westoria formula is developed with dermatologists, tested for safety
            and efficacy, and packaged thoughtfully so it feels as good to use as it
            looks on your shelf. We source clean, effective ingredients and never
            compromise on quality to hit a price point.
          </p>
          <p>
            Today, thousands of customers trust Westoria as part of their daily
            routine. We&apos;re just getting started.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: Sparkles, title: "Premium Formulas", desc: "Clinically-inspired, effective ingredients." },
            { icon: ShieldCheck, title: "Dermat Tested", desc: "Safe for all skin & hair types." },
            { icon: Leaf, title: "Cruelty Free", desc: "Never tested on animals." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                <item.icon className="size-5" />
              </div>
              <h3 className="mt-3 font-display font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
