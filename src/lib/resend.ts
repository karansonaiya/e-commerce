import { Resend } from "resend";

let client: Resend | undefined;

function getResendClient() {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Email is not configured. Set RESEND_API_KEY.");
    }
    client = new Resend(apiKey);
  }
  return client;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Fire-and-forget: a missing/unreachable email service should never break
// the contact form submission itself (the message is already saved to the DB).
export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) {
    console.error("CONTACT_EMAIL_TO is not configured; skipping contact notification email.");
    return;
  }

  try {
    await getResendClient().emails.send({
      from: "Westoria <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: subject ? `New contact message: ${subject}` : `New contact message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }
}
