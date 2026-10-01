import { TrackOrderForm } from "@/components/store/track-order-form";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

export const metadata = { title: "Track Your Order" };

export default function TrackOrderPage() {
  return (
    <div className="container-x py-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand-dark)]">
          Order Status
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold">
          <TextReveal text="Track Your Order" />
        </h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Enter your Order ID (from your confirmation email or SMS) and the phone number used at
          checkout to see your order&apos;s status.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mx-auto mt-10 max-w-2xl">
        <TrackOrderForm />
      </Reveal>
    </div>
  );
}
