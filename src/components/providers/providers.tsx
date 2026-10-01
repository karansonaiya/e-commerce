"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster, toast } from "sonner";

const SIGNED_OUT_FLAG = "westoria:just-signed-out";

// signOut() does a full hard navigation (so a toast fired right before it
// never has time to render) — the sign-out button sets this flag just before
// calling it, and this reads it back once the next page has loaded.
function SignOutToast() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SIGNED_OUT_FLAG)) {
        sessionStorage.removeItem(SIGNED_OUT_FLAG);
        toast.success("Signed out successfully");
      }
    } catch {
      // sessionStorage can throw in restricted contexts (private browsing, etc.)
    }
  }, []);
  return null;
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <SignOutToast />
      {children}
      <Toaster
        position="top-right"
        duration={4500}
        closeButton
        toastOptions={{
          style: {
            background: "#1a1512",
            color: "#fdf6ec",
            border: "1px solid #b5121b",
          },
        }}
      />
    </SessionProvider>
  );
}
