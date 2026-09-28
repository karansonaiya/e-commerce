"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster } from "sonner";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster
        position="top-center"
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
