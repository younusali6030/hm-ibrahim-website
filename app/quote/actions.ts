"use server";

import { getCatalogData } from "@/lib/catalog";
import { sendCatalogToCustomer } from "@/lib/catalog-email";

/**
 * Submit quote request: validate form, build product catalog (with optional
 * Indore/Siyaganj rate search), and email the catalog to the customer.
 * Replies to quotes go to younusali6030@gmail.com (or QUOTE_REPLY_TO_EMAIL).
 */
export async function submitQuote(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const honeypot = formData.get("website")?.toString();
  if (honeypot) return { success: true };

  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();
  const items = formData.get("items")?.toString()?.trim();
  const productSlug = formData.get("product")?.toString()?.trim() || null;

  if (!name || !phone || !email || !items) {
    return { error: "Please fill in name, phone, email, and items." };
  }

  if (phone.length < 10) {
    return { error: "Please enter a valid phone number." };
  }

  try {
    const catalogData = await getCatalogData(productSlug, items);
    const result = await sendCatalogToCustomer(email, catalogData);
    if (!result.success) {
      return { error: result.error };
    }
  } catch (e) {
    console.error("Quote submit error:", e);
    return { error: "Something went wrong. Please try again or contact us directly." };
  }

  return { success: true };
}
