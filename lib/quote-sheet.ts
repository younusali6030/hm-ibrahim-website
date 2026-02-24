/**
 * Append each quote request to a Google Sheet so all submissions are stored
 * in one place (like an Excel file that keeps growing). Export to Excel from Google Sheets anytime.
 */

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import type { QuoteSubmission } from "./quote-notification";

type PurchaseSubmissionForSheet = {
  fullName: string;
  email: string;
  phone: string;
  customerType: string;
  productCategory: string;
  itemName: string;
  quantity: number;
  address: string;
  purchaseDate?: string;
  invoiceNumber?: string;
  preferredContact?: string;
  notes?: string;
};

const SHEET_HEADERS = [
  "date",
  "time",
  "name",
  "phone number",
  "email",
  "customer type",
  "product category",
  "items/products needed",
  "quantity",
  "delivery",
  "additional notes",
] as const;

function getNormalizedPrivateKey(raw: string | undefined | null): string | null {
  if (!raw) return null;

  let key = raw.trim();

  // If the key was pasted with surrounding quotes (e.g. from JSON), strip them
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Convert escaped newlines (\n) to real newlines (PEM format)
  key = key.replace(/\\n/g, "\n");

  return key;
}

function formatSubmissionDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" });
}

function formatSubmissionTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function submissionToRow(data: QuoteSubmission, submittedAt: Date): Record<string, string> {
  return {
    "date": formatSubmissionDate(submittedAt),
    "time": formatSubmissionTime(submittedAt),
    "name": data.name,
    "phone number": data.phone,
    "email": data.email,
    "customer type": data.customerType,
    "product category": data.productCategory,
    "items/products needed": data.items,
    "quantity": data.quantity,
    "delivery": data.delivery,
    "additional notes": data.additionalNotes,
  };
}

function purchaseSubmissionToRow(data: PurchaseSubmissionForSheet, submittedAt: Date): Record<string, string> {
  const baseNotes: string[] = [];
  if (data.address) baseNotes.push(`Address: ${data.address}`);
  if (data.invoiceNumber) baseNotes.push(`Invoice: ${data.invoiceNumber}`);
  if (data.preferredContact) baseNotes.push(`Preferred: ${data.preferredContact}`);
  if (data.purchaseDate) baseNotes.push(`Purchase date: ${data.purchaseDate}`);
  if (data.notes) baseNotes.push(`Notes: ${data.notes}`);

  return {
    date: formatSubmissionDate(submittedAt),
    time: formatSubmissionTime(submittedAt),
    name: data.fullName,
    "phone number": data.phone,
    email: data.email,
    "customer type": `${data.customerType} (post-purchase)`,
    "product category": data.productCategory,
    "items/products needed": data.itemName,
    quantity: String(data.quantity),
    delivery: "",
    "additional notes": baseNotes.join(" | "),
  };
}

export type AppendQuoteToSheetResult = { success: true } | { success: false; error: string };

/**
 * Append one quote submission as a new row in the configured Google Sheet.
 * If the sheet is empty, the first row is set to headers and the submission is added as row 2.
 * Requires: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY.
 */
export async function appendQuoteToSheet(data: QuoteSubmission): Promise<AppendQuoteToSheetResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getNormalizedPrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  if (!sheetId || !email || !privateKey) {
    return { success: false, error: "Google Sheet not configured (missing GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, or GOOGLE_PRIVATE_KEY)." };
  }

  try {
    const auth = new JWT({
      email,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      return { success: false, error: "Sheet has no worksheets." };
    }

    const rowData = submissionToRow(data, new Date());

    try {
      await sheet.addRow(rowData);
    } catch (headerError: unknown) {
      const msg = headerError instanceof Error ? headerError.message : String(headerError);
      if (
        msg.includes("header") ||
        msg.includes("Header") ||
        msg.includes("blank") ||
        msg.includes("No values")
      ) {
        await sheet.setHeaderRow([...SHEET_HEADERS]);
        await sheet.addRow(rowData);
      } else {
        throw headerError;
      }
    }

    return { success: true };
  } catch (e) {
    console.error("Quote sheet append error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: `Failed to append to sheet: ${message}` };
  }
}

export type AppendPurchaseToSheetResult = { success: true } | { success: false; error: string };

export async function appendPurchaseToSheet(data: PurchaseSubmissionForSheet): Promise<AppendPurchaseToSheetResult> {
  const sheetId = process.env.GOOGLE_PURCHASE_SHEET_ID || process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getNormalizedPrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  if (!sheetId || !email || !privateKey) {
    return {
      success: false,
      error: "Google Sheet not configured (missing GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, or GOOGLE_PRIVATE_KEY).",
    };
  }

  try {
    const auth = new JWT({
      email,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      return { success: false, error: "Sheet has no worksheets." };
    }

    const rowData = purchaseSubmissionToRow(data, new Date());

    try {
      await sheet.addRow(rowData);
    } catch (headerError: unknown) {
      const msg = headerError instanceof Error ? headerError.message : String(headerError);
      if (
        msg.includes("header") ||
        msg.includes("Header") ||
        msg.includes("blank") ||
        msg.includes("No values")
      ) {
        await sheet.setHeaderRow([...SHEET_HEADERS]);
        await sheet.addRow(rowData);
      } else {
        throw headerError;
      }
    }

    return { success: true };
  } catch (e) {
    console.error("Purchase sheet append error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: `Failed to append purchase to sheet: ${message}` };
  }
}

