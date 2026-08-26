import { NextResponse } from "next/server";

const RESEND_API_URL = "https://api.resend.com/emails";

function text(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
    return NextResponse.json(
      { error: "Contact email is not configured." },
      { status: 503 }
    );
  }

  const name = text(formData.get("full-name"));
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  const topic = text(formData.get("help-with")) || "General";
  const message = text(formData.get("message"));

  const lines = [
    `Name: ${name || "Not provided"}`,
    `Email: ${email || "Not provided"}`,
    `Phone: ${phone || "Not provided"}`,
    `Topic: ${topic}`,
    "",
    message || "No message provided.",
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h1 style="font-size:20px;margin:0 0 16px">New HRE website inquiry</h1>
      <p><strong>Name:</strong> ${escapeHtml(name || "Not provided")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
      <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />
      <p style="white-space:pre-wrap">${escapeHtml(message || "No message provided.")}</p>
    </div>
  `;

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
      subject: `New HRE website inquiry — ${topic}`,
      text: lines.join("\n"),
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json(
      { error: "Unable to send contact email.", details },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
