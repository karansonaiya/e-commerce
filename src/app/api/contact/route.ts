import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/checkout";
import { sendContactNotification } from "@/lib/resend";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const message = await prisma.contactMessage.create({ data: parsed.data });
  await sendContactNotification(parsed.data);
  return NextResponse.json({ id: message.id }, { status: 201 });
}
