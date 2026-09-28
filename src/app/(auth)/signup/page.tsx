import { Suspense } from "react";
import { SignupForm } from "@/components/store/signup-form";

export const metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
