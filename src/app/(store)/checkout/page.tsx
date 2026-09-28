import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <div className="container-x py-12">
      <h1 className="font-display text-3xl font-semibold">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
