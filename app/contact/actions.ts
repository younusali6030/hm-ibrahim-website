"use server";

import nodemailer from "nodemailer";

const CONTACT_FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "younusali6030@gmail.com";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "younusali6030@gmail.com";

export async function submitContact(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const honeypot = formData.get("website")?.toString();
  if (honeypot) return { success: true };

  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const message = formData.get("message")?.toString()?.trim();

  if (!name || !email || !message) {
    return { error: "Please fill in name, email, and message." };
  }

  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    return { error: "Email is not configured. Please add GMAIL_APP_PASSWORD in your hosting settings." };
  }

  const body = `
New contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone || "(not provided)"}

Message:
${message}
  `.trim();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: CONTACT_FROM_EMAIL,
        pass: appPassword,
      },
    });

    await transporter.sendMail({
      from: `"HM Ibrahim & Co" <${CONTACT_FROM_EMAIL}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Contact form: ${name} — HM Ibrahim & Co`,
      text: body,
    });
  } catch (e) {
    console.error("Contact submit error:", e);
    return { error: "Failed to send. Please try again or call us." };
  }

  return { success: true };
}
