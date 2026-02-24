import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendPurchaseToSheet } from "@/lib/quote-sheet";

const purchaseSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  customerType: z.string().min(1, "Customer type is required"),
  notes: z.string().optional(),

  productCategory: z.string().min(1, "Product category is required"),
  itemName: z.string().min(1, "Item / Product Name is required"),
  quantity: z
    .union([
      z.number().int().positive("Quantity must be greater than 0"),
      z.string().regex(/^\d+$/, "Quantity must be a number"),
    ])
    .transform((val) => (typeof val === "number" ? val : parseInt(val, 10))),
  unit: z.string().min(1, "Unit is required"),
  purchaseDate: z.string().optional(),
  invoiceNumber: z.string().optional(),
  preferredContact: z.string().optional(),

  website: z.string().optional(), // honeypot
});

type RateEntry = { count: number; first: number };
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateMap = new Map<string, RateEntry>();

function getIp(req: NextRequest): string {
  const header = req.headers.get("x-forwarded-for");
  if (!header) return "unknown";
  return header.split(",")[0]?.trim() || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = rateMap.get(ip);
  if (!existing) {
    rateMap.set(ip, { count: 1, first: now });
    return true;
  }
  if (now - existing.first > RATE_LIMIT_WINDOW_MS) {
    rateMap.set(ip, { count: 1, first: now });
    return true;
  }
  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }
  existing.count += 1;
  rateMap.set(ip, existing);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions from this IP. Please try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = purchaseSchema.safeParse(json);
  if (!parsed.success) {
    const errorMessage =
      parsed.error.issues[0]?.message || "Please check the form fields and try again.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }

  const {
    fullName,
    email,
    phone,
    address,
    customerType,
    notes,
    productCategory,
    itemName,
    quantity,
    unit,
    purchaseDate,
    invoiceNumber,
    preferredContact,
    website,
  } = parsed.data;

  // Honeypot: silently accept but do nothing
  if (website && website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const sheetResult = await appendPurchaseToSheet({
    fullName,
    email,
    phone,
    customerType,
    productCategory,
    itemName,
    quantity,
    unit,
    address,
    purchaseDate,
    invoiceNumber,
    preferredContact,
    notes,
  });

  if (!sheetResult.success) {
    return NextResponse.json(
      { success: false, error: sheetResult.error || "Could not save your details. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

