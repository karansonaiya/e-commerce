import { LegalPage } from "@/components/store/legal-page";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <LegalPage title="Shipping Policy" updated="September 28, 2026">
      <h2>Shipping Coverage</h2>
      <p>We currently ship across all serviceable pin codes within India.</p>
      <h2>Shipping Charges</h2>
      <p>
        Free shipping on all prepaid orders above ₹599. Orders below this amount
        incur a flat shipping fee of ₹49.
      </p>
      <h2>Processing Time</h2>
      <p>
        Orders are processed within 1–2 business days of payment confirmation. You
        will receive an email once your order ships.
      </p>
      <h2>Delivery Time</h2>
      <p>
        Standard delivery typically takes 3–7 business days depending on your
        location.
      </p>
      <h2>Order Tracking</h2>
      <p>
        Once your order ships, you can track its status from your Account &gt; Orders
        page.
      </p>
      <h2>Delays</h2>
      <p>
        Delivery timelines may be affected by weather, courier delays, or regional
        restrictions beyond our control. We appreciate your patience.
      </p>
    </LegalPage>
  );
}
