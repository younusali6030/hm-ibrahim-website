/**
 * Send a notification email to the business when someone
 * requests a quote, including all form fields and a CSV attachment.
 */

import nodemailer from "nodemailer";

const QUOTE_FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "younusali6030@gmail.com";
const QUOTE_NOTIFY_EMAIL = process.env.QUOTE_NOTIFY_EMAIL || "hmibrahimco1939@gmail.com";

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

export type SendQuoteNotificationResult = { success: true } | { success: false; error: string };

/**
 * Send an email to younusali6030@gmail.com with the quote details, the price/rate shared with the customer, and a CSV attachment.
 */
export async function sendQuoteNotification(
  data: QuoteSubmission,
  rateSharedWithCustomer?: string
): Promise<SendQuoteNotificationResult> {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    return { success: false, error: "GMAIL_APP_PASSWORD is not set." };
  }

  const csvContent = buildQuoteCsv(data);
  const customerTypeLabel = data.customerType ? (CUSTOMER_TYPE_LABELS[data.customerType] ?? data.customerType) : "—";
  const deliveryLabel = data.delivery ? (DELIVERY_LABELS[data.delivery] ?? data.delivery) : "—";

  const lines = [
    "New quote request from website",
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
  ];
  if (rateSharedWithCustomer?.trim()) {
    lines.push("", "---", "Price/rate shared with customer (in their catalog email):", "", rateSharedWithCustomer.trim());
  }
  const text = lines.join("\n");

  const filename = `quote-${Date.now()}-${data.name.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 20)}.csv`;

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
      to: QUOTE_NOTIFY_EMAIL,
      subject: `New quote request: ${data.name} — ${data.items.slice(0, 50)}${data.items.length > 50 ? "…" : ""}`,
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
