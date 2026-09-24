import { Resend } from "resend";
import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";
import { portfolioData } from "@/data/portfolio";

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Contact form is not configured yet." }, { status: 503 });
  }

  let input: unknown;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const result = validateContact(input);
  if (result.data === undefined) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { name, email, message } = result.data;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: portfolioData.personal.email,
      replyTo: email,
      subject: `[Portfolio] New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
