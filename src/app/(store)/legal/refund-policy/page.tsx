import { LegalPage } from "@/components/store/legal-page";

export const metadata = { title: "Refund & Return Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund & Return Policy" updated="September 28, 2026">
      <p>
        We want you to love your Westoria products. If something isn&apos;t right,
        here&apos;s how our refund and return process works.
      </p>
      <h2>Returns</h2>
      <p>
        For hygiene and safety reasons, opened face wash, serum, and shampoo products
        cannot be returned unless they arrived damaged or defective. Unopened
        products may be returned within 7 days of delivery.
      </p>
      <h2>Damaged or Incorrect Items</h2>
      <p>
        If you receive a damaged, defective, or incorrect item, contact us within 48
        hours of delivery with photos of the product and packaging. We will arrange a
        replacement or full refund.
      </p>
      <h2>Refund Process</h2>
      <p>
        Approved refunds are processed to the original payment method within 5–7
        business days. Refunds for Cashfree payments are initiated via the same
        gateway.
      </p>
      <h2>Cancellations</h2>
      <p>
        Orders can be cancelled free of charge before they are shipped. Once shipped,
        please refer to our return process above.
      </p>
      <h2>Contact Us</h2>
      <p>Reach out at westoriastore@gmail.com for any refund or return request.</p>
    </LegalPage>
  );
}
