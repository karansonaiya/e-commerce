import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/store/contact-form";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="container-x py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">Get in touch</p>
        <h1 className="font-display mt-2 text-4xl font-semibold">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--color-ink-soft)]">
          Have a question about an order, our products, or anything else? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <ContactInfo icon={Mail} title="Email" value="westoriastore@gmail.com" />
          <ContactInfo icon={Phone} title="Phone" value="+91 8780656181" />
          <ContactInfo icon={MapPin} title="Address" value="Surat, Gujarat India" />
        </div>
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactInfo({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-[var(--color-ink-soft)]">{value}</p>
      </div>
    </div>
  );
}
