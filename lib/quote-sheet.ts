/**
 * Append each quote request to a Google Sheet so all submissions are stored
 * in one place (like an Excel file that keeps growing). Export to Excel from Google Sheets anytime.
 */

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import type { QuoteSubmission } from "./quote-notification";

const SHEET_HEADERS = [
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

function submissionToRow(data: QuoteSubmission): Record<string, string> {
  return {
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

export type AppendQuoteToSheetResult = { success: true } | { success: false; error: string };

/**
 * Append one quote submission as a new row in the configured Google Sheet.
 * If the sheet is empty, the first row is set to headers and the submission is added as row 2.
 * Requires: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY.
 */
export async function appendQuoteToSheet(data: QuoteSubmission): Promise<AppendQuoteToSheetResult> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !email || !privateKey) {
    return { success: false, error: "Google Sheet not configured (missing GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, or GOOGLE_PRIVATE_KEY)." };
  }

  const key = privateKey.replace(/\\n/g, "\n");

  try {
    const auth = new JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      return { success: false, error: "Sheet has no worksheets." };
    }

    const rowData = submissionToRow(data);

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
