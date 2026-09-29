import { LegalPage } from "@/components/store/legal-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 28, 2026">
      <p>
        Westoria (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains what
        information we collect, how we use it, and the choices you have.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly, such as your name, email, phone
        number, and shipping address when you create an account or place an order.
        We also collect basic usage data (pages visited, device type) to improve our
        site.
      </p>
      <h2>How We Use Your Information</h2>
      <p>
        We use your information to process orders, provide customer support, send
        order updates, and — with your consent — send marketing communications. We
        never sell your personal data to third parties.
      </p>
      <h2>Payment Information</h2>
      <p>
        Payments are processed securely by Cashfree. Westoria does not store your
        card, UPI, or bank details on our servers.
      </p>
      <h2>Cookies</h2>
      <p>
        We use cookies to keep you signed in, remember your cart, and understand how
        our site is used.
      </p>
      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data
        by contacting us at support@westoria.in.
      </p>
    </LegalPage>
  );
}
