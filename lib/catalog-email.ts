/**
 * Build HTML catalog and send it to the customer.
 * Email is sent FROM younusali6030@gmail.com (or QUOTE_FROM_EMAIL) TO the customer's email,
 * using Gmail SMTP (Nodemailer). Requires GMAIL_APP_PASSWORD for the sender Gmail account.
 * Logo is embedded as base64 so it displays in Gmail and other clients that block external images.
 */

import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { site } from "@/content/site";
import type { CatalogData } from "./catalog";

/** From address for quote catalog — the customer sees this as the sender */
const QUOTE_FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "younusali6030@gmail.com";

let cachedLogoDataUrl: string | null | undefined = undefined;

/** Inline logo as base64 so it shows in Gmail without loading from a URL */
function getLogoDataUrl(): string | null {
  if (cachedLogoDataUrl !== undefined) return cachedLogoDataUrl;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo-dark.png");
    const buffer = fs.readFileSync(logoPath);
    cachedLogoDataUrl = "data:image/png;base64," + buffer.toString("base64");
  } catch {
    cachedLogoDataUrl = null;
  }
  return cachedLogoDataUrl;
}

function buildCatalogHtml(data: CatalogData): string {
  const { productName, categoryName, shortDesc, classifications, tentativeRates, indicativeRateRange, searchContext } = data;
  const hasRates = tentativeRates.length > 0;
  const hasIndicative = !hasRates && indicativeRateRange?.trim();

  const logoSrc = getLogoDataUrl();
  const logoHtml = logoSrc
    ? `
    <div style="margin-bottom:20px;text-align:center;">
      <img src="${logoSrc}" alt="HM Ibrahim &amp; Co" width="200" height="69" style="height:auto;max-width:200px;display:inline-block;" />
    </div>`
    : "";


  const specsHtml =
    classifications.specs.length > 0
      ? `
    <h3 style="margin:0 0 8px 0;font-size:14px;color:#374151;">Specifications</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      ${classifications.specs.map((s) => `<tr><td style="padding:4px 8px 4px 0;color:#6b7280;">${escapeHtml(s.label)}</td><td style="padding:4px 0;">${escapeHtml(s.value)}</td></tr>`).join("")}
    </table>`
      : "";
  const sizesHtml =
    classifications.sizes.length > 0
      ? `<p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#374151;">Sizes / Thickness:</strong> ${escapeHtml(classifications.sizes.join(", "))}</p>`
      : "";
  const materialsHtml =
    classifications.materials.length > 0
      ? `<p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#374151;">Materials:</strong> ${escapeHtml(classifications.materials.join(", "))}</p>`
      : "";
  const useCasesHtml =
    classifications.useCases.length > 0
      ? `<p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#374151;">Common uses:</strong> ${escapeHtml(classifications.useCases.join(", "))}</p>`
      : "";
  const variantsHtml =
    classifications.variants.length > 0
      ? `<p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#374151;">Variants:</strong> ${escapeHtml(classifications.variants.join(", "))}</p>`
      : "";
  const notesHtml = classifications.notes
    ? `<p style="margin:0 0 12px 0;font-size:13px;color:#6b7280;">${escapeHtml(classifications.notes)}</p>`
    : "";

  const ratesSection = hasRates
    ? `
    <div style="margin-top:20px;padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
      <h3 style="margin:0 0 10px 0;font-size:14px;color:#166534;">Live indicative range (Indore / Siyaganj)</h3>
      <p style="margin:0 0 10px 0;font-size:12px;color:#6b7280;">From recent web search for: ${escapeHtml(searchContext)}. Confirm with us for current price and availability.</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="border-bottom:1px solid #bbf7d0;"><th style="text-align:left;padding:6px 8px 6px 0;">Source</th><th style="text-align:left;padding:6px 0;">Rate</th><th style="text-align:left;padding:6px 0;">Note</th></tr>
        ${tentativeRates.map((r) => `<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px 8px 6px 0;">${escapeHtml(r.supplier ?? "—")}</td><td style="padding:6px 0;">${escapeHtml(r.rate ?? "—")}</td><td style="padding:6px 0;color:#6b7280;">${escapeHtml(r.note ?? "")}</td></tr>`).join("")}
      </table>
    </div>`
    : hasIndicative
      ? `
    <div style="margin-top:20px;padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
      <h3 style="margin:0 0 8px 0;font-size:14px;color:#166534;">Indicative rate (Indore / Siyaganj)</h3>
      <p style="margin:0;font-size:13px;color:#166534;">${escapeHtml(indicativeRateRange!.trim())}</p>
      <p style="margin:10px 0 0 0;font-size:12px;color:#6b7280;">Confirm with us for current price and availability.</p>
    </div>`
      : `
    <div style="margin-top:20px;padding:14px;background:#fefce8;border:1px solid #fef08a;border-radius:8px;">
      <p style="margin:0;font-size:13px;color:#854d0e;">Tentative rates for <strong>${escapeHtml(productName)}</strong> in Indore / Siyaganj depend on quantity and current market. We will confirm exact price and availability when you contact us.</p>
    </div>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f9fafb;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
    ${logoHtml}
    <div style="padding:0 24px 16px;border-bottom:1px solid #e5e7eb;">
      <p style="margin:0 0 16px 0;font-size:15px;color:#374151;">Thanks for contacting us. Please refer to the reference prices below. You can call us for immediate assistance or wait for us to reach back to you.</p>
      <h1 style="margin:0 0 4px 0;font-size:20px;color:#111827;">${escapeHtml(productName)}</h1>
      <p style="margin:0;font-size:13px;color:#6b7280;">${escapeHtml(categoryName)} — HM Ibrahim & Co, Siyaganj, Indore</p>
    </div>
    <div style="padding:24px;">
      ${shortDesc ? `<p style="margin:0 0 16px 0;font-size:14px;color:#374151;">${escapeHtml(shortDesc)}</p>` : ""}
      ${specsHtml}
      ${sizesHtml}
      ${materialsHtml}
      ${useCasesHtml}
      ${variantsHtml}
      ${notesHtml}
      ${ratesSection}
    </div>
    <div style="padding:20px 24px;background:#eff6ff;border-top:1px solid #bfdbfe;">
      <p style="margin:0 0 12px 0;font-size:14px;font-weight:600;color:#1e40af;">Call us ASAP at <a href="tel:+919826053563" style="color:#2563eb;">+91 9826053563</a> to book the best available rate.</p>
      <p style="margin:0;font-size:12px;color:#6b7280;">This catalog was sent in response to your quote request. For current prices and orders, contact us:</p>
      <p style="margin:8px 0 0 0;font-size:13px;"><a href="tel:${site.phone.replace(/\s/g, "")}" style="color:#2563eb;">${site.phone}</a> · <a href="mailto:${QUOTE_FROM_EMAIL}" style="color:#2563eb;">${QUOTE_FROM_EMAIL}</a></p>
    </div>
    <div style="padding:20px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:13px;color:#374151;">
      <p style="margin:0 0 8px 0;font-weight:600;color:#111827;">${escapeHtml(site.name)}</p>
      <p style="margin:0 0 4px 0;">${escapeHtml(site.fullAddress)}</p>
      <p style="margin:0 0 4px 0;">Landmark: ${escapeHtml(site.landmark)}</p>
      <p style="margin:0 0 4px 0;">Phone: <a href="tel:${site.phone.replace(/\s/g, "")}" style="color:#2563eb;">${site.phone}</a> (${escapeHtml(site.phoneLabel)}) · <a href="tel:${site.phoneAlt.replace(/\s/g, "")}" style="color:#2563eb;">${site.phoneAlt}</a> (${escapeHtml(site.phoneAltLabel)})</p>
      <p style="margin:0 0 4px 0;">Email: <a href="mailto:${site.email}" style="color:#2563eb;">${site.email}</a> (${escapeHtml(site.emailLabel)}) · <a href="mailto:${site.emailAlt}" style="color:#2563eb;">${site.emailAlt}</a> (${escapeHtml(site.emailAltLabel)})</p>
      <p style="margin:0 0 4px 0;">WhatsApp: <a href="https://wa.me/${site.whatsapp}" style="color:#2563eb;">${site.phone}</a></p>
      <p style="margin:8px 0 0 0;font-size:12px;color:#6b7280;">${escapeHtml(site.hours.weekdays)} · ${escapeHtml(site.hours.sunday)} · ${escapeHtml(site.hours.note)}</p>
      ${site.gstin ? `<p style="margin:6px 0 0 0;font-size:12px;color:#6b7280;">GSTIN: ${escapeHtml(site.gstin)}</p>` : ""}
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type SendCatalogResult = { success: true } | { success: false; error: string };

/**
 * Send the product catalog to the customer's email.
 * Sent FROM younusali6030@gmail.com (QUOTE_FROM_EMAIL) TO the customer's address via Gmail SMTP.
 * Requires GMAIL_APP_PASSWORD for the Gmail account (create at myaccount.google.com/apppasswords).
 */
export async function sendCatalogToCustomer(
  toEmail: string,
  catalogData: CatalogData
): Promise<SendCatalogResult> {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    return { success: false, error: "Email is not configured (GMAIL_APP_PASSWORD missing)." };
  }

  const html = buildCatalogHtml(catalogData);
  const subject = `Your catalog: ${catalogData.productName} — HM Ibrahim & Co, Indore`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: QUOTE_FROM_EMAIL,
        pass: appPassword,
      },
    });

    await transporter.sendMail({
      from: `"HM Ibrahim & Co" <${QUOTE_FROM_EMAIL}>`,
      to: toEmail,
      subject,
      html,
    });

    return { success: true };
  } catch (e) {
    console.error("Send catalog error:", e);
    return { success: false, error: "Failed to send catalog email." };
  }
}
