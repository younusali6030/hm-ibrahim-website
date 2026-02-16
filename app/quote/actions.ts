"use server";

import { site } from "@/content/site";

/** Quote requests are sent to business WhatsApp (+919993078654) via a prefilled link; no email required. */

export async function submitQuote(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const honeypot = formData.get("website")?.toString();
  if (honeypot) return { success: true };

  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();
  const items = formData.get("items")?.toString()?.trim();

  if (!name || !phone || !email || !items) {
    return { error: "Please fill in name, phone, email, and items." };
  }

  if (phone.length < 10) {
    return { error: "Please enter a valid phone number." };
  }

  return { success: true };
}
