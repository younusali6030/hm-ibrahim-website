"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/content/products";
import { getBrandById, type BrandId } from "@/content/brands";
import { site } from "@/content/site";
import { baseUrl } from "@/lib/site";
import { stockedBrands } from "@/content/stockedBrands";
import { submitQuote } from "./actions";
import { trackQuoteRequest, trackContactSubmit, trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { getWhatsAppLink } from "@/lib/utils";
import { T, useT, useLang } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { ShopStatus } from "@/components/visit/VisitUs";

export const QUOTE_STORAGE_KEY = "hmQuoteSuccess";
const DRAFT_KEY = "hmQuoteDraft";

type FieldKey = "name" | "phone" | "email" | "items";
type FieldErrors = Partial<Record<FieldKey, string>>;

/** Resolve ?brand= to a display name: our own brands by id (old "boarder" id included), or a stocked brand by name. */
function resolveBrand(raw: string): { key: string; name: string; id?: BrandId } | null {
  const clean = raw.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 60);
  if (!clean) return null;
  // Exact stocked-brand names win, so the stocked "Tata" (steel) is not mistaken for our "tata" (Tata Wiron) id.
  const exact = stockedBrands.find((b) => b.name === clean);
  if (exact) return { key: exact.name, name: exact.name };
  const id = (clean.toLowerCase() === "boarder" ? "border" : clean.toLowerCase()) as BrandId;
  const own = getBrandById(id);
  if (own) return { key: own.id, name: own.name, id: own.id };
  const stocked = stockedBrands.find((b) => b.name.toLowerCase() === clean.toLowerCase());
  return stocked ? { key: stocked.name, name: stocked.name } : null;
}

/** Same rule as the server: 10 digits starting 6-9, with an optional +91 / 0 prefix. */
function validPhone(raw: string): boolean {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d);
}

function buildQuoteMessage(v: Record<string, string>, categoryName: string, reference?: string, brandName?: string, hi = false): string {
  return [
    hi
      ? `कोटेशन अनुरोध${reference ? ` ${reference}` : ""}, ${new URL(baseUrl).hostname} से`
      : `Quote request${reference ? ` ${reference}` : ""} from ${new URL(baseUrl).hostname}`,
    ...(brandName ? [hi ? `ब्रांड: ${brandName}` : `Brand: ${brandName}`] : []),
    "",
    v.name && (hi ? `नाम: ${v.name}` : `Name: ${v.name}`),
    v.phone && (hi ? `फ़ोन: ${v.phone}` : `Phone: ${v.phone}`),
    v.email && (hi ? `ईमेल: ${v.email}` : `Email: ${v.email}`),
    categoryName && (hi ? `श्रेणी: ${categoryName}` : `Category: ${categoryName}`),
    v.items && (hi ? `माल: ${v.items}` : `Items: ${v.items}`),
    v.quantity && (hi ? `मात्रा: ${v.quantity}` : `Quantity: ${v.quantity}`),
    v.notes && (hi ? `टिप्पणी: ${v.notes}` : `Notes: ${v.notes}`),
  ]
    .filter(Boolean)
    .join("\n");
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

const Req = () => (
  <span aria-hidden="true" className="text-primary">
    {" "}
    *
  </span>
);

export function QuoteForm({ tx = {} }: { tx?: Record<string, string> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();
  const { lang } = useLang();
  const hi = lang === "hi";
  const L = (s: string) => tx[s] ?? s;

  const prefilledCategory = searchParams.get("category") ?? "";
  const productParam = (searchParams.get("product") ?? "").slice(0, 120);
  // Product links carry the slug; the customer should see the name ("GI Wire", not "gi-wire").
  const prefilledProduct =
    L(categories.flatMap((c) => c.products).find((p) => p.slug === productParam)?.name ?? productParam);
  const prefilledQty = (searchParams.get("qty") ?? searchParams.get("quantity") ?? "").replace(/[\u0000-\u001f]/g, "").slice(0, 60);
  // Resolves our own brand ids (old "boarder" links included) and stocked-brand names.
  const brand = resolveBrand(searchParams.get("brand") ?? "");
  const prefilledBrand = brand?.key ?? "";
  const selectedBrand = brand?.id ? getBrandById(brand.id) : null;
  const categoryName = L(categories.find((c) => c.slug === prefilledCategory)?.name ?? "");
  const brandName = brand ? L(brand.name) : "";
  const brandPrefix = brand ? (hi ? `${brandName} ब्रांड: ` : `${brandName} brand: `) : "";
  const subject = prefilledProduct || categoryName;
  const itemsDefault = subject ? (brand ? (hi ? `${subject} (${brandName} ब्रांड)` : `${subject} (${brandName} brand)`) : subject) : brandPrefix;

  const [values, setValues] = useState<Record<string, string>>({
    name: "",
    phone: "",
    email: "",
    items: itemsDefault,
    quantity: prefilledQty,
  });
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [failed, setFailed] = useState(false);

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
        quantity: prev.quantity || d.quantity || "",
        items: prev.items || d.items || "",
      }));
    } catch {
      /* storage unavailable: the form still works */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    } catch {
      /* ignore */
    }
  }, [values]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  /** What we actually send as the list: a brand-only prefill ("CM brand: ") is not a list. */
  const cleanItems = () => {
    const raw = values.items.trim();
    return brandPrefix && raw === brandPrefix.trim() ? "" : raw;
  };
  const sendValues = () => ({ ...values, items: cleanItems() });
  const waMessage = buildQuoteMessage(sendValues(), categoryName, undefined, brand ? brandName : undefined, hi);

  const msg: Record<FieldKey, string> = {
    name: t("Please enter your name.", "कृपया अपना नाम लिखिए।"),
    phone: t("Enter a 10-digit mobile number, like 98260 53563.", "10 अंकों का मोबाइल नंबर लिखिए, जैसे 98260 53563।"),
    email: t("That email looks incomplete.", "यह ईमेल अधूरा लग रहा है।"),
    items: t("Please tell us what you need, or leave it and call us.", "कृपया बताइए आपको क्या चाहिए, या खाली छोड़कर हमें कॉल कीजिए।"),
  };

  function focusField(id: string) {
    const el = document.getElementById(id);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || honeypot) return;
    setError(null);
    setFailed(false);

    // Check on the phone first: no network round trip for a typo.
    const local: FieldErrors = {};
    if (values.name.trim().length < 2) local.name = msg.name;
    if (!validPhone(values.phone)) local.phone = msg.phone;
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) local.email = msg.email;
    if (Object.keys(local).length) {
      setFieldErrors(local);
      setError(t("Please check the highlighted fields.", "कृपया लाल निशान वाले खाने देख लीजिए।"));
      focusField(Object.keys(local)[0]);
      return;
    }
    setFieldErrors({});

    const sv = sendValues();
    const fd = new FormData();
    Object.entries(sv).forEach(([k, v]) => fd.set(k, v));
    if (brand && !sv.items.toLowerCase().includes(brandName.toLowerCase())) {
      fd.set("notes", `Brand enquired: ${brand.name}`);
    }
    fd.set("category", prefilledCategory);
    fd.set("website", honeypot);
    if (prefilledProduct) fd.set("product", prefilledProduct);
    if (prefilledBrand) fd.set("brand", prefilledBrand);

    setLoading(true);
    try {
      const res = await submitQuote(fd);
      if (res.success) {
        if (sv.items) trackQuoteRequest("quote_form");
        else trackContactSubmit("quote_form");
        try {
          sessionStorage.setItem(
            QUOTE_STORAGE_KEY,
            JSON.stringify({
              reference: res.reference,
              catalogSent: res.catalogSent,
              name: values.name,
              message: buildQuoteMessage(sv, categoryName, res.reference, brand ? brandName : undefined, hi),
            })
          );
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        router.push(localePath(lang, "/contact/success"));
        return;
      }
      if (res.code === "invalid" && res.fieldErrors) {
        const fe: FieldErrors = {};
        (Object.keys(res.fieldErrors) as FieldKey[]).forEach((k) => {
          fe[k] = msg[k] || res.fieldErrors?.[k];
        });
        setFieldErrors(fe);
        setError(t("Please check the highlighted fields.", "कृपया लाल निशान वाले खाने देख लीजिए।"));
        const first = Object.keys(fe)[0];
        if (first) focusField(first);
      } else if (res.code === "rate_limited") {
        setError(
          t(
            "Too many requests from this connection. Please call or WhatsApp us, or try again in a few minutes.",
            "इस कनेक्शन से बहुत सारे अनुरोध आ गए। कृपया कॉल या व्हाट्सएप करें, या कुछ मिनट बाद फिर कोशिश करें।"
          )
        );
        setFailed(true);
      } else {
        setError(
          t(
            "We could not register your request just now. Please call us or send it on WhatsApp, it takes a minute.",
            "अभी आपका अनुरोध दर्ज नहीं हो पाया। कृपया कॉल करें या व्हाट्सएप पर भेज दें, एक मिनट लगेगा।"
          )
        );
        setFailed(true);
      }
    } catch {
      setError(
        t(
          "Your connection dropped before we could confirm. Your details are still here.",
          "कनेक्शन टूट गया, पक्का नहीं हो पाया। आपकी जानकारी यहीं रखी है।"
        )
      );
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  const inputCls = "mt-1.5 w-full min-h-[48px] text-base scroll-mb-32";
  const describe = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        data-hide-sticky
        data-track="quote_form"
        className="w-full space-y-6 rounded-[10px] border border-border bg-card p-5 shadow-sm sm:p-8"
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

        {brand && !selectedBrand && (
          <div className="rounded-sm border border-border bg-secondary/60 p-3 text-sm text-muted-foreground">
            <T en="Quote for" hi="कोटेशन:" /> <span className="font-semibold text-foreground">{brandName}</span>
          </div>
        )}
        {selectedBrand && (
          <div className="flex items-center gap-3 rounded-sm border border-border bg-secondary/60 p-3">
            <span className="relative h-10 w-20">
              <Image src={selectedBrand.logo} alt={L(selectedBrand.name)} width={80} height={40} className="h-10 w-auto object-contain" />
            </span>
            <span className="text-sm text-muted-foreground">
              <T en="Quote for" hi="कोटेशन:" /> {L(selectedBrand.name)}
            </span>
          </div>
        )}

        <fieldset className="space-y-5">
          <legend className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <T en="1. What you need" hi="1. आपको क्या चाहिए" />
          </legend>
          <div>
            <Label htmlFor="items">
              <T en="What do you need?" hi="आपको क्या चाहिए?" />
            </Label>
            <p id="items-hint" className="mt-0.5 text-sm text-muted-foreground">
              <T
                en="Product, size, how much. Skip it if you would rather just talk."
                hi="माल, साइज़, कितना चाहिए। सीधे बात करनी हो तो खाली छोड़ दें।"
              />
            </p>
            <Textarea
              id="items"
              name="items"
              value={values.items}
              onChange={set("items")}
              placeholder={t(
                "e.g. Welded wire mesh 4x4, 2.5 mm, 5 rolls. Binding wire 20 kg.",
                "जैसे: वेल्डेड जाली 4x4, 2.5 mm, 5 रोल। बाइंडिंग तार 20 kg।"
              )}
              className="mt-1.5 min-h-[112px] w-full scroll-mb-32 text-base"
              aria-describedby="items-hint"
            />
          </div>
          <div>
            <Label htmlFor="quantity">
              <T en="Quantity" hi="मात्रा" />
            </Label>
            <Input
              id="quantity"
              name="quantity"
              value={values.quantity}
              onChange={set("quantity")}
              placeholder={t("e.g. 5 rolls, 2 tonnes", "जैसे 5 रोल, 2 टन")}
              className={inputCls}
              autoComplete="off"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <T en="2. How to reach you" hi="2. आपसे बात कैसे हो" />
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">
                <T en="Your name" hi="आपका नाम" />
                <Req />
              </Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={set("name")}
                autoComplete="name"
                enterKeyHint="next"
                className={inputCls}
                aria-required="true"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={describe(fieldErrors.name && "name-error")}
              />
              <FieldError id="name-error" message={fieldErrors.name} />
            </div>
            <div>
              <Label htmlFor="phone">
                <T en="Mobile number" hi="मोबाइल नंबर" />
                <Req />
              </Label>
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
                  className="min-h-[48px] w-full scroll-mb-32 pl-12 text-base"
                  aria-required="true"
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={describe(fieldErrors.phone && "phone-error")}
                />
              </div>
              <FieldError id="phone-error" message={fieldErrors.phone} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">
              <T en="Email (optional)" hi="ईमेल (ज़रूरी नहीं)" />
            </Label>
            <p id="email-hint" className="mt-0.5 text-sm text-muted-foreground">
              <T en="Add it if you want the product catalog by email." hi="प्रोडक्ट कैटलॉग ईमेल पर चाहिए तो डालिए।" />
            </p>
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
              aria-describedby={describe("email-hint", fieldErrors.email && "email-error")}
            />
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>
        </fieldset>

        {error && (
          <div id="quote-error" role="alert" className="rounded-sm border border-destructive/40 bg-destructive/10 p-4">
            <p className="text-sm font-semibold text-foreground">{error}</p>
            {failed && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href={tel}
                  onClick={() => trackCallClick("quote_fallback")}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-input bg-card px-4 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" aria-hidden /> <T en="Call" hi="कॉल करें" /> {site.phone}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-[54px] w-full items-center justify-center rounded-sm bg-primary px-6 text-base font-bold text-primary-foreground transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? t("Sending your request…", "आपका अनुरोध भेज रहे हैं…") : t("Get my quote", "मेरा कोटेशन भेजें")}
          </button>
          <a
            href={getWhatsAppLink(site.whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("quote_form_whatsapp")}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm border border-input bg-background px-6 text-base font-semibold text-foreground hover:border-foreground/50"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            <T en="Or send this on WhatsApp" hi="या इसे व्हाट्सएप पर भेजें" />
          </a>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          <T
            en="* required. We only use your number to call you about this quote. No spam, no sharing."
            hi="* ज़रूरी। आपका नंबर सिर्फ़ इसी कोटेशन पर कॉल करने के लिए इस्तेमाल होगा। स्पैम नहीं, किसी को देना नहीं।"
          />
        </p>
      </form>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label={t("What happens next", "आगे क्या होगा")}>
        <div className="rounded-[10px] bg-nav p-6 text-white">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/70">
            <T en="What happens next" hi="आगे क्या होगा" />
          </p>
          <ol className="mt-4 space-y-4 text-sm leading-relaxed text-white/90">
            <li className="flex gap-3">
              <span className="font-display text-2xl leading-none text-primary" aria-hidden>1</span>
              <span>
                <T en="We read your list and check stock at the Siyaganj shop." hi="हम आपकी लिस्ट देखकर सियागंज की दुकान पर स्टॉक चेक करते हैं।" />
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-2xl leading-none text-primary" aria-hidden>2</span>
              <span>
                <T en="We call or WhatsApp you back with the rate, during shop hours." hi="दुकान के समय में हम रेट के साथ आपको कॉल या व्हाट्सएप करते हैं।" />
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-2xl leading-none text-primary" aria-hidden>3</span>
              <span>
                <T en="You decide. Pick up from the shop, or ask us about delivery." hi="फैसला आपका। दुकान से ले जाइए, या डिलीवरी के बारे में पूछिए।" />
              </span>
            </li>
          </ol>
        </div>
        <div className="rounded-[10px] border border-border bg-card p-6">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <T en="Faster, if urgent" hi="जल्दी हो तो" />
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={tel}
              onClick={() => trackCallClick("quote_aside")}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input font-semibold text-foreground hover:border-foreground/50"
            >
              <Phone className="h-4 w-4" aria-hidden /> {site.phone}
            </a>
            <a
              href={getWhatsAppLink(site.whatsapp, t("Hi, I need a quote for iron and hardware items.", "नमस्ते, मुझे लोहे और हार्डवेयर के सामान का कोटेशन चाहिए।"))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("quote_aside")}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input font-semibold text-foreground hover:border-foreground/50"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> <T en="WhatsApp us" hi="व्हाट्सएप करें" />
            </a>
          </div>
          <ShopStatus className="mt-4 text-sm" />
        </div>
      </aside>
    </div>
  );
}
