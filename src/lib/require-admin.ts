import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !isAdminEmail(session.user.email)) {
    throw new Error("Unauthorized: admin access required");
  }
  return session;
}
