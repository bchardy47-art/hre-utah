import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  try {
    const { name, phone, email, service, message } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
    }

    const toEmail = process.env.CONTACT_TO_EMAIL ?? 'Hardyhomesutah@gmail.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

    await resend.emails.send({
      from: `Hardy Real Estate Contact Form <${fromEmail}>`,
      to: toEmail,
      reply_to: email || undefined,
      subject: `New ${service ? service + ' ' : ''}Inquiry from ${name}`,
      text: [
        `New contact form submission from hre-utah.com`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email || 'Not provided'}`,
        `Service: ${service || 'Not specified'}`,
        ``,
        `Message:`,
        message || '(no message)',
      ].join('\n'),
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #1e3a5f;">New Contact Form Submission</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px 0; color: #1f2937;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px 0; color: #1f2937;">${email || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Service:</td><td style="padding: 8px 0; color: #1f2937;">${service || 'Not specified'}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 12px; background: #f8fafc; border-radius: 6px; border-left: 3px solid #d97706;">
            <p style="font-weight: bold; color: #374151; margin: 0 0 6px;">Message:</p>
            <p style="color: #1f2937; margin: 0;">${message || '(no message provided)'}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">Sent from hre-utah.com contact form</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
