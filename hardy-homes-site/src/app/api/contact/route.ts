import { NextResponse } from "next/server";

const RESEND_API_URL = "https://api.resend.com/emails";

function text(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();

  if (text(formData.get("bot-field"))) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return NextResponse.json({ error: "Contact email is not configured." }, { status: 503 });
  }

  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const property = text(formData.get("property"));
  const plan = text(formData.get("plan")) || "General";
  const message = text(formData.get("message"));

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email || undefined,
      subject: `Hardy Homes inquiry — ${plan}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Property: ${property || "Not provided"}`,
        `Plan: ${plan}`,
        "",
        message || "No message provided.",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json({ error: "Unable to send contact email.", details }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
