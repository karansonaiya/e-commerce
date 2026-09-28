import { Suspense } from "react";
import { LoginForm } from "@/components/store/login-form";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
