export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "sonaiyakaran339@gmail.com";

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
