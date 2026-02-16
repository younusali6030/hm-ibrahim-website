"use server";

import { Resend } from "resend";
import { site } from "@/content/site";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_TO_EMAIL || site.email;

  const body = `
New contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone || "(not provided)"}

Message:
${message}
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Contact form: ${name} — HM Ibrahim & Co`,
      text: body,
    });

    if (error) {
      console.error("Resend contact error:", error);
      return { error: "Failed to send. Please try again or call us." };
    }
  } catch (e) {
    console.error("Contact submit error:", e);
    return { error: "Failed to send. Please try again or call us." };
  }

  return { success: true };
}
