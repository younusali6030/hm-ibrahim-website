"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const CUSTOMER_TYPES = ["retail", "wholesale", "contractor", "other"] as const;

const PREFERRED_CONTACT = ["WhatsApp", "Call", "Email"] as const;

export function PostPurchaseForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [preferredContact, setPreferredContact] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (honeypot) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: formData.get("fullName")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      phone: formData.get("phone")?.toString().trim() ?? "",
      address: formData.get("address")?.toString().trim() ?? "",
      customerType,
      notes: formData.get("notes")?.toString().trim() ?? "",
      productCategory,
      itemName: formData.get("itemName")?.toString().trim() ?? "",
      quantity: formData.get("quantity")?.toString().trim() ?? "",
      purchaseDate: formData.get("purchaseDate")?.toString().trim() || undefined,
      invoiceNumber: formData.get("invoiceNumber")?.toString().trim() || undefined,
      preferredContact: preferredContact ?? undefined,
      website: honeypot,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/purchase-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess("Thanks! We saved your details. We’ll contact you soon.");
      form.reset();
      setCustomerType("");
      setProductCategory("");
      setPreferredContact(null);
    } catch (err) {
      console.error("post-purchase submit error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

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

      {/* Customer info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            placeholder="Your full name"
            className="mt-1 w-full min-h-[44px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="10-digit mobile"
            className="mt-1 w-full min-h-[44px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="mt-1 w-full min-h-[44px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          name="address"
          required
          placeholder="Delivery / billing address"
          className="mt-1 w-full min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerType">Customer Type *</Label>
        <Select value={customerType} onValueChange={setCustomerType}>
          <SelectTrigger id="customerType" className="mt-1 w-full min-h-[44px]">
            <SelectValue placeholder="Select customer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="wholesale">Wholesale</SelectItem>
            <SelectItem value="contractor">Contractor / Builder</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any additional details (e.g. site location, next project, feedback)"
          className="mt-1 w-full min-h-[80px]"
        />
      </div>

      {/* Purchase info */}
      <div className="space-y-2 pt-4 border-t border-border">
        <Label htmlFor="productCategory">Product Category *</Label>
        <Select value={productCategory} onValueChange={setProductCategory}>
          <SelectTrigger id="productCategory" className="mt-1 w-full min-h-[44px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="itemName">Item / Product Name *</Label>
        <Input
          id="itemName"
          name="itemName"
          required
          placeholder="e.g. GI wire 10 SWG, TMT 12mm"
          className="mt-1 w-full min-h-[44px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity *</Label>
        <Input
          id="quantity"
          name="quantity"
          required
          type="text"
          placeholder="e.g. 5 bundles, 100 kg"
          className="mt-1 w-full min-h-[44px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            defaultValue={today}
            className="mt-1 w-full min-h-[44px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice / Bill Number</Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            placeholder="Optional"
            className="mt-1 w-full min-h-[44px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preferred Contact (optional)</Label>
        <div className="mt-1 flex flex-wrap gap-3">
          {PREFERRED_CONTACT.map((option) => (
            <label key={option} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="radio"
                name="preferredContactRadio"
                value={option}
                checked={preferredContact === option}
                onChange={() => setPreferredContact(option)}
                className="h-4 w-4 border-border text-primary"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-500" role="status">
          {success}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full min-h-[48px] text-base">
        {loading ? "Submitting..." : "Submit Purchase Details"}
      </Button>
    </form>
  );
}

