import { LegalPage } from "@/components/store/legal-page";

export const metadata = { title: "Terms of Service" };

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" updated="September 28, 2026">
      <p>
        By accessing or using the Westoria website, you agree to be bound by these
        Terms of Service. Please read them carefully.
      </p>
      <h2>Use of the Site</h2>
      <p>
        You agree to use this site only for lawful purposes and in a way that does
        not infringe the rights of, restrict, or inhibit anyone else&apos;s use of
        the site.
      </p>
      <h2>Products & Pricing</h2>
      <p>
        We strive for accuracy in product descriptions and pricing but do not
        warrant that they are error-free. We reserve the right to correct errors and
        cancel orders placed at an incorrect price.
      </p>
      <h2>Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activity under your account.
      </p>
      <h2>Intellectual Property</h2>
      <p>
        All content on this site, including text, graphics, logos, and images, is
        the property of Westoria and protected by applicable intellectual property
        laws.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        Westoria shall not be liable for any indirect, incidental, or consequential
        damages arising from your use of the site or products.
      </p>
      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India.</p>
    </LegalPage>
  );
}
