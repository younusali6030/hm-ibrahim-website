/**
 * Send a notification email to the business when someone
 * requests a quote, including all form fields and a CSV attachment.
 */

import nodemailer from "nodemailer";

/**
 * Sender and recipient come only from env (QUOTE_FROM_EMAIL, QUOTE_NOTIFY_EMAIL, GMAIL_APP_PASSWORD).
 * There are deliberately no defaults: if any is unset the email is skipped and logged, never sent anywhere else.
 */

export type QuoteSubmission = {
  name: string;
  phone: string;
  email: string;
  customerType: string;
  productCategory: string;
  items: string;
  quantity: string;
  delivery: string;
  additionalNotes: string;
  /** Lead reference shown to the customer, e.g. HM-261011-4F7K */
  reference?: string;
};

/** Escape a CSV field (wrap in quotes if needed, escape " as "") */
function csvEscape(value: string): string {
  const s = value.replace(/"/g, '""');
  if (/[",\r\n]/.test(s)) return `"${s}"`;
  return s;
}

/** Build CSV content: header row + one data row */
function buildQuoteCsv(data: QuoteSubmission): string {
  const header = [
    "name",
    "phone number",
    "email",
    "customer type",
    "product category",
    "items/products needed",
    "quantity",
    "delivery",
    "additional notes",
  ].join(",");

  const row = [
    csvEscape(data.name),
    csvEscape(data.phone),
    csvEscape(data.email),
    csvEscape(data.customerType),
    csvEscape(data.productCategory),
    csvEscape(data.items),
    csvEscape(data.quantity),
    csvEscape(data.delivery),
    csvEscape(data.additionalNotes),
  ].join(",");

  return `${header}\r\n${row}`;
}

const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  retail: "Retail",
  wholesale: "Wholesale",
  contractor: "Contractor / Builder",
  other: "Other",
};

const DELIVERY_LABELS: Record<string, string> = {
  pickup: "Pickup from warehouse",
  delivery: "Delivery required",
  flexible: "Flexible",
};

export type SendQuoteNotificationResult =
  | { success: true }
  | { success: false; error: string; /** Email is not configured: nothing was attempted. */ skipped?: boolean };

/**
 * Email the shop (QUOTE_NOTIFY_EMAIL) the quote details, the rate shared with the customer, and a CSV attachment.
 * Fail-soft: when email env is not set this logs once and returns `skipped`, it never throws and never sends.
 */
export async function sendQuoteNotification(
  data: QuoteSubmission,
  rateSharedWithCustomer?: string
): Promise<SendQuoteNotificationResult> {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const QUOTE_FROM_EMAIL = process.env.QUOTE_FROM_EMAIL?.trim();
  const QUOTE_NOTIFY_EMAIL = process.env.QUOTE_NOTIFY_EMAIL?.trim();
  if (!appPassword || !QUOTE_FROM_EMAIL || !QUOTE_NOTIFY_EMAIL) {
    console.warn("[quote] email not configured (QUOTE_FROM_EMAIL / QUOTE_NOTIFY_EMAIL / GMAIL_APP_PASSWORD): notification skipped");
    return { success: false, error: "Email is not configured.", skipped: true };
  }

  const csvContent = buildQuoteCsv(data);
  const customerTypeLabel = data.customerType ? (CUSTOMER_TYPE_LABELS[data.customerType] ?? data.customerType) : "—";
  const deliveryLabel = data.delivery ? (DELIVERY_LABELS[data.delivery] ?? data.delivery) : "—";

  const lines = [
    "New quote request from website" + (data.reference ? " (" + data.reference + ")" : ""),
    "",
    "Name: " + data.name,
    "Phone number: " + data.phone,
    "Email: " + data.email,
    "Customer type: " + customerTypeLabel,
    "Product category: " + (data.productCategory || "—"),
    "Items/products needed: " + data.items,
    "Quantity: " + (data.quantity || "—"),
    "Delivery: " + deliveryLabel,
    "Additional notes: " + (data.additionalNotes || "—"),
    "",
    "Call back: tel:+91" + data.phone.replace(/\D/g, "").slice(-10),
    "WhatsApp: https://wa.me/91" + data.phone.replace(/\D/g, "").slice(-10),
  ];
  if (rateSharedWithCustomer?.trim()) {
    lines.push("", "---", "Price/rate shared with customer (in their catalog email):", "", rateSharedWithCustomer.trim());
  }
  const text = lines.join("\n");

  const filename = `quote-${Date.now()}-${data.name.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 20)}.csv`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
      auth: {
        user: QUOTE_FROM_EMAIL,
        pass: appPassword.replace(/\s/g, ""),
      },
    });

    await transporter.sendMail({
      from: `"HM Ibrahim & Co" <${QUOTE_FROM_EMAIL}>`,
      to: QUOTE_NOTIFY_EMAIL,
      replyTo: data.email || undefined,
      subject: `${data.reference ? "[" + data.reference + "] " : ""}New quote: ${data.name}, ${data.phone} — ${data.items.slice(0, 50)}${data.items.length > 50 ? "…" : ""}`,
      text,
      attachments: [
        {
          filename,
          content: csvContent,
        },
      ],
    });

    return { success: true };
  } catch (e) {
    console.error("Quote notification email error:", e);
    return { success: false, error: "Failed to send notification email." };
  }
}
