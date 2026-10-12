"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/content/products";
import { getBrandById, type BrandId } from "@/content/brands";
import { site } from "@/content/site";
import { submitQuote } from "@/app/contact/actions";
import { trackQuoteRequest, trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { getWhatsAppLink } from "@/lib/utils";

export const QUOTE_STORAGE_KEY = "hmQuoteSuccess";
const DRAFT_KEY = "hmQuoteDraft";

const CUSTOMER_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  { value: "contractor", label: "Contractor / Builder" },
  { value: "other", label: "Other" },
];
const DELIVERY = [
  { value: "pickup", label: "I will pick up" },
  { value: "delivery", label: "Deliver to me" },
  { value: "flexible", label: "Either is fine" },
];

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "items", string>>;

function buildQuoteMessage(v: Record<string, string>, categoryName: string, reference?: string): string {
  return [
    `Quote request${reference ? ` ${reference}` : ""} from hmibrahimco.com`,
    "",
    `Name: ${v.name}`,
    `Phone: ${v.phone}`,
    v.email && `Email: ${v.email}`,
    v.customerType && `Customer type: ${v.customerType}`,
    categoryName && `Category: ${categoryName}`,
    `Items: ${v.items}`,
    v.quantity && `Quantity: ${v.quantity}`,
    v.delivery && `Delivery: ${v.delivery}`,
    v.notes && `Notes: ${v.notes}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "min-h-[44px] rounded-sm border px-4 text-sm font-semibold transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-card text-foreground hover:border-foreground/50")
      }
    >
      {children}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

export function QuoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCategory = searchParams.get("category") ?? "";
  const prefilledProduct = searchParams.get("product") ?? "";
  const prefilledBrand = searchParams.get("brand") ?? "";
  const selectedBrand = prefilledBrand ? getBrandById(prefilledBrand as BrandId) : null;
  const itemsDefault = prefilledProduct
    ? selectedBrand
      ? `${prefilledProduct} (${selectedBrand.name} brand)`
      : prefilledProduct
    : "";

  const [values, setValues] = useState<Record<string, string>>({
    name: "",
    phone: "",
    email: "",
    items: itemsDefault,
    quantity: "",
    notes: "",
  });
  const [customerType, setCustomerType] = useState("");
  const [category, setCategory] = useState(prefilledCategory);
  const [delivery, setDelivery] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [failed, setFailed] = useState(false);
  const firstInvalid = useRef<string | null>(null);

  // Restore an unsent draft, so a dropped network never costs the customer their typing.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, string>;
      setValues((prev) => ({
        ...prev,
        name: d.name || prev.name,
        phone: d.phone || prev.phone,
        email: d.email || prev.email,
        quantity: d.quantity || prev.quantity,
        notes: d.notes || prev.notes,
        items: prev.items || d.items || "",
      }));
      if (d.customerType) setCustomerType(d.customerType);
    } catch {
      /* storage unavailable: the form still works */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...values, customerType }));
    } catch {
      /* ignore */
    }
  }, [values, customerType]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const categoryName = categories.find((c) => c.slug === category)?.name ?? "";
  const fallbackMessage = buildQuoteMessage(
    { ...values, customerType, delivery },
    categoryName
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || honeypot) return;
    setError(null);
    setFailed(false);
    setFieldErrors({});

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.set(k, v));
    fd.set("customerType", customerType);
    fd.set("category", category);
    fd.set("delivery", delivery);
    fd.set("website", honeypot);
    if (prefilledProduct) fd.set("product", prefilledProduct);
    if (prefilledBrand) fd.set("brand", prefilledBrand);

    setLoading(true);
    try {
      const res = await submitQuote(fd);
      if (res.success) {
        trackQuoteRequest();
        try {
          sessionStorage.setItem(
            QUOTE_STORAGE_KEY,
            JSON.stringify({
              reference: res.reference,
              catalogSent: res.catalogSent,
              name: values.name,
              message: buildQuoteMessage({ ...values, customerType, delivery }, categoryName, res.reference),
            })
          );
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        router.push("/contact/success");
        return;
      }
      setError(res.error);
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
        firstInvalid.current = Object.keys(res.fieldErrors)[0] ?? null;
        if (firstInvalid.current) document.getElementById(firstInvalid.current)?.focus();
      } else {
        setFailed(true);
      }
    } catch {
      setError("Your connection dropped before we could confirm. Your details are still here.");
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  const inputCls = "mt-1.5 w-full min-h-[48px] text-base";

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full space-y-7 rounded-sm border border-border bg-card p-5 shadow-sm sm:p-8"
        aria-describedby={error ? "quote-error" : undefined}
      >
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

        {selectedBrand && (
          <div className="flex items-center gap-3 rounded-sm border border-border bg-secondary/60 p-3">
            <span className="relative h-10 w-20">
              <Image src={selectedBrand.logo} alt={selectedBrand.name} width={80} height={40} className="h-10 w-auto object-contain" />
            </span>
            <span className="text-sm text-muted-foreground">Quote for {selectedBrand.name}</span>
          </div>
        )}

        <fieldset className="space-y-5">
          <legend className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            1. What you need
          </legend>
          <div>
            <Label htmlFor="items">Items and sizes *</Label>
            <Textarea
              id="items"
              name="items"
              value={values.items}
              onChange={set("items")}
              placeholder="e.g. Welded wire mesh 4x4, 2.5 mm, 5 rolls. Binding wire 20 kg."
              className="mt-1.5 w-full min-h-[120px] text-base"
              aria-invalid={!!fieldErrors.items}
              aria-describedby={fieldErrors.items ? "items-error" : undefined}
            />
            <FieldError id="items-error" message={fieldErrors.items} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Product category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className={inputCls}>
                  <SelectValue placeholder="Choose, if you know" />
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
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                value={values.quantity}
                onChange={set("quantity")}
                placeholder="e.g. 5 rolls, 2 tonnes"
                className={inputCls}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            2. How to reach you
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Your name *</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={set("name")}
                autoComplete="name"
                className={inputCls}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              <FieldError id="name-error" message={fieldErrors.name} />
            </div>
            <div>
              <Label htmlFor="phone">Mobile number *</Label>
              <div className="relative mt-1.5">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base font-semibold text-muted-foreground"
                  aria-hidden="true"
                >
                  +91
                </span>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={values.phone}
                  onChange={set("phone")}
                  placeholder="98260 53563"
                  className="w-full min-h-[48px] pl-12 text-base"
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                />
              </div>
              <FieldError id="phone-error" message={fieldErrors.phone} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">
              Email <span className="font-normal text-muted-foreground">(optional, we send the product catalog here)</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={set("email")}
              className={inputCls}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            3. A little more, if you like
          </legend>
          <div>
            <p className="text-sm font-medium text-foreground" id="ct-label">
              I am a
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="ct-label">
              {CUSTOMER_TYPES.map((t) => (
                <Chip key={t.value} active={customerType === t.value} onClick={() => setCustomerType(customerType === t.value ? "" : t.value)}>
                  {t.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground" id="dl-label">
              Delivery
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="dl-label">
              {DELIVERY.map((t) => (
                <Chip key={t.value} active={delivery === t.value} onClick={() => setDelivery(delivery === t.value ? "" : t.value)}>
                  {t.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Anything else we should know</Label>
            <Textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={set("notes")}
              placeholder="Site location, brand preference, urgency"
              className="mt-1.5 w-full min-h-[84px] text-base"
            />
          </div>
        </fieldset>

        {error && (
          <div id="quote-error" role="alert" className="rounded-sm border border-destructive/40 bg-destructive/10 p-4">
            <p className="text-sm font-semibold text-foreground">{error}</p>
            {failed && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href={getWhatsAppLink(site.whatsapp, fallbackMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("quote_fallback")}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden /> Send this on WhatsApp
                </a>
                <a
                  href={tel}
                  onClick={() => trackCallClick("quote_fallback")}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-input bg-card px-4 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" aria-hidden /> Call {site.phone}
                </a>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[54px] w-full items-center justify-center rounded-sm bg-primary px-6 text-base font-bold text-primary-foreground transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "Sending your request…" : "Get my quote"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          We only use your number to call you about this quote. No spam, no sharing.
        </p>
      </form>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="What happens next">
        <div className="rounded-sm bg-nav p-6 text-white">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/70">What happens next</p>
          <ol className="mt-4 space-y-4 text-sm leading-relaxed text-white/90">
            <li className="flex gap-3">
              <span className="font-display text-2xl leading-none text-primary" aria-hidden>1</span>
              <span>We read your list and check stock at the Siyaganj shop.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-2xl leading-none text-primary" aria-hidden>2</span>
              <span>We call or WhatsApp you with rates and availability during shop hours.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-2xl leading-none text-primary" aria-hidden>3</span>
              <span>You confirm, and we pack it for pickup or delivery.</span>
            </li>
          </ol>
        </div>
        <div className="rounded-sm border border-border bg-card p-6">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Faster, if urgent</p>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={tel}
              onClick={() => trackCallClick("quote_aside")}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input font-semibold text-foreground hover:border-foreground/50"
            >
              <Phone className="h-4 w-4" aria-hidden /> {site.phone}
            </a>
            <a
              href={getWhatsAppLink(site.whatsapp, "Hi, I need a quote for iron and hardware items.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("quote_aside")}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input font-semibold text-foreground hover:border-foreground/50"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp us
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{site.hours.weekdays}. {site.hours.sunday}.</p>
          <p className="mt-2 text-sm text-muted-foreground">{site.address.line1}, {site.address.line2}, {site.address.city}</p>
        </div>
      </aside>
    </div>
  );
}
