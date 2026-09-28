import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";

const POINTS = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    desc: "Expertly formulated with carefully sourced, high-performance ingredients.",
  },
  {
    icon: ShieldCheck,
    title: "Dermat Tested",
    desc: "Every formula is tested for safety and gentleness on all skin & hair types.",
  },
  {
    icon: Truck,
    title: "Safe & Secure Shipping",
    desc: "Carefully packaged and delivered across India with tracked shipping.",
  },
  {
    icon: Leaf,
    title: "Cruelty Free",
    desc: "Thoughtfully created without animal testing — kind to you and the planet.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-[var(--color-cream-dark)] py-16 md:py-24">
      <div className="container-x">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">
            Why Westoria?
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
            Crafted for real results
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.title} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                <p.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
