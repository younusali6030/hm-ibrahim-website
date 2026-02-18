"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/content/products";
import { getBrandById, type BrandId } from "@/content/brands";
import { submitQuote } from "@/app/quote/actions";

const QUOTE_STORAGE_KEY = "quoteWhatsAppMessage";

function buildQuoteMessage(formData: FormData): string {
  const name = formData.get("name")?.toString()?.trim() ?? "";
  const phone = formData.get("phone")?.toString()?.trim() ?? "";
  const email = formData.get("email")?.toString()?.trim() ?? "";
  const customerType = formData.get("customerType")?.toString() ?? "";
  const category = formData.get("category")?.toString() ?? "";
  const items = formData.get("items")?.toString()?.trim() ?? "";
  const quantity = formData.get("quantity")?.toString()?.trim() ?? "";
  const delivery = formData.get("delivery")?.toString() ?? "";
  const notes = formData.get("notes")?.toString()?.trim() ?? "";
  const brand = formData.get("brand")?.toString() ?? "";

  const lines = [
    "Quote request from website",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    customerType ? `Customer type: ${customerType}` : null,
    category ? `Category: ${category}` : null,
    `Items: ${items}`,
    quantity ? `Quantity: ${quantity}` : null,
    delivery ? `Delivery: ${delivery}` : null,
    brand ? `Brand: ${brand}` : null,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function QuoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCategory = searchParams.get("category") ?? "";
  const prefilledProduct = searchParams.get("product") ?? "";
  const prefilledBrand = searchParams.get("brand") ?? "";

  const selectedBrand = prefilledBrand ? getBrandById(prefilledBrand as BrandId) : null;
  const itemsDefault = prefilledProduct
    ? (selectedBrand ? `${prefilledProduct} (${selectedBrand.name} brand)` : prefilledProduct)
    : "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [category, setCategory] = useState(prefilledCategory);
  const [delivery, setDelivery] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (honeypot) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("customerType", customerType);
    formData.set("category", category);
    formData.set("delivery", delivery);
    setLoading(true);
    try {
      const result = await submitQuote(formData);
      if (result?.success) {
        const message = buildQuoteMessage(formData);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(QUOTE_STORAGE_KEY, message);
        }
        router.push("/quote/success");
        return;
      }
      setError(result?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 w-full max-w-2xl space-y-6">
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px]"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      {prefilledBrand && <input type="hidden" name="brand" value={prefilledBrand} />}
      {prefilledProduct && <input type="hidden" name="product" value={prefilledProduct} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required placeholder="Your name" className="mt-1 w-full min-h-[44px]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="10-digit mobile" className="mt-1 w-full min-h-[44px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" className="mt-1 w-full min-h-[44px]" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerType">Customer type</Label>
        <Select value={customerType} onValueChange={setCustomerType}>
          <SelectTrigger id="customerType" className="mt-1 w-full min-h-[44px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="wholesale">Wholesale</SelectItem>
            <SelectItem value="contractor">Contractor / Builder</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedBrand && (
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <p className="text-sm font-medium text-foreground">Selected brand</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="relative h-10 w-20">
              <Image src={selectedBrand.logo} alt={selectedBrand.name} width={80} height={40} className="object-contain" />
            </span>
            <span className="text-muted-foreground">{selectedBrand.name}</span>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="category">Product category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="mt-1 w-full min-h-[44px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="items">Items / products needed *</Label>
        <Textarea
          id="items"
          name="items"
          required
          placeholder="e.g. TMT bars 12mm, MS angles 50x50, binding wire"
          className="mt-1 w-full min-h-[100px]"
          defaultValue={itemsDefault}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity (approx.)</Label>
        <Input id="quantity" name="quantity" placeholder="e.g. 5 tonnes, 100 kg" className="mt-1 w-full min-h-[44px]" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="delivery">Delivery / pickup preference</Label>
        <Select value={delivery} onValueChange={setDelivery}>
          <SelectTrigger id="delivery" className="mt-1 w-full min-h-[44px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pickup">Pickup from warehouse</SelectItem>
            <SelectItem value="delivery">Delivery required</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Additional notes</Label>
        <Textarea id="notes" name="notes" placeholder="Any other details" className="mt-1 w-full min-h-[80px]" />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full min-h-[48px] text-base">
        {loading ? "Sending..." : "Submit quote request"}
      </Button>
    </form>
  );
}
