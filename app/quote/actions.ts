"use server";

import { getCategoryBySlug } from "@/content/products";
import { getCatalogData } from "@/lib/catalog";
import { sendCatalogToCustomer } from "@/lib/catalog-email";
import { sendQuoteNotification } from "@/lib/quote-notification";
import { appendQuoteToSheet } from "@/lib/quote-sheet";

/**
 * Submit quote request: validate form, build product catalog and email to customer,
 * then send you a notification email (younusali6030@gmail.com) with all details + CSV attachment.
 */
export async function submitQuote(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const honeypot = formData.get("website")?.toString();
  if (honeypot) return { success: true };

  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();
  const items = formData.get("items")?.toString()?.trim();
  const productSlug = formData.get("product")?.toString()?.trim() || null;
  const customerType = formData.get("customerType")?.toString()?.trim() || "";
  const categorySlug = formData.get("category")?.toString()?.trim() || "";
  const quantity = formData.get("quantity")?.toString()?.trim() || "";
  const delivery = formData.get("delivery")?.toString()?.trim() || "";
  const additionalNotes = formData.get("notes")?.toString()?.trim() || "";

  if (!name || !phone || !email || !items) {
    return { error: "Please fill in name, phone, email, and items." };
  }

  if (phone.length < 10) {
    return { error: "Please enter a valid phone number." };
  }

  const category = categorySlug ? getCategoryBySlug(categorySlug) : null;
  const productCategory = category?.name ?? (categorySlug || "");

  try {
    const catalogData = await getCatalogData(productSlug, items);
    const result = await sendCatalogToCustomer(email, catalogData);
    if (!result.success) {
      return { error: result.error };
    }

    const notifyResult = await sendQuoteNotification({
      name,
      phone,
      email,
      customerType,
      productCategory,
      items,
      quantity,
      delivery,
      additionalNotes,
    });
    if (!notifyResult.success) {
      console.error("Quote notification failed:", notifyResult.error);
    }

    const sheetResult = await appendQuoteToSheet({
      name,
      phone,
      email,
      customerType,
      productCategory,
      items,
      quantity,
      delivery,
      additionalNotes,
    });
    if (!sheetResult.success) {
      console.error("Quote sheet append failed:", sheetResult.error);
    }
  } catch (e) {
    console.error("Quote submit error:", e);
    return { error: "Something went wrong. Please try again or contact us directly." };
  }

  return { success: true };
}
