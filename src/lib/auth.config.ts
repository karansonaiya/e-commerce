import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/lib/admin";

// Edge-safe config: no Prisma adapter, no bcrypt-based Credentials provider,
// so this can be imported from middleware (Edge runtime).
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.role = isAdminEmail(user.email) ? "admin" : "customer";
      } else if (token.email) {
        token.role = isAdminEmail(token.email as string) ? "admin" : "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) ?? "customer";
        session.user.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
  },
};
