import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Ananya R.",
    product: "Glow Foam Cleanser",
    rating: 5,
    text: "My skin feels so clean but not stripped. This is my third bottle already!",
  },
  {
    name: "Rahul M.",
    product: "Vitamin C Radiance Serum",
    rating: 5,
    text: "Noticed brighter skin within two weeks. Absorbs fast, no sticky feeling.",
  },
  {
    name: "Simran K.",
    product: "Argan Repair Shampoo",
    rating: 4,
    text: "Smells amazing and my hair fall has visibly reduced. Highly recommend.",
  },
];

export function ReviewsSection() {
  return (
    <section className="container-x py-16 md:py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">
          Real people, real reviews
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Loved by thousands</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {REVIEWS.map((r) => (
          <div key={r.name} className="rounded-2xl border border-[var(--color-ink)]/10 bg-white p-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < r.rating ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-[var(--color-ink)]/15"
                  }`}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-[var(--color-ink-soft)]">&ldquo;{r.text}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold">{r.name}</p>
            <p className="text-xs text-[var(--color-ink-soft)]/70">on {r.product}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
