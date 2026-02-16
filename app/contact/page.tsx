import type { Metadata } from "next";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} — address, phone, WhatsApp, hours. Siyaganj, Indore.`,
  alternates: { canonical: `${baseUrl}/contact` },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-4xl font-bold text-foreground md:text-5xl">Contact Us</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Visit our store, call, or send a message. We&apos;re here to help.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Get in touch</h2>
          <ul className="mt-4 space-y-4 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Address:</span> {site.fullAddress}
            </li>
            <li>
              <span className="font-medium text-foreground">Landmark:</span> {site.landmark}
            </li>
            <li>
              <span className="font-medium text-foreground">Phone:</span>{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-primary hover:underline">
                {site.phone}
              </a>
              {site.phoneAlt && (
                <> / <a href={`tel:${String(site.phoneAlt).replace(/\s/g, "")}`} className="text-primary hover:underline">{site.phoneAlt}</a></>
              )}
            </li>
            <li>
              <span className="font-medium text-foreground">WhatsApp:</span>{" "}
              <a
                href={getWhatsAppLink(site.whatsapp, "Hi, I'd like to inquire about your products.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Chat with us
              </a>
            </li>
            <li>
              <span className="font-medium text-foreground">Email:</span>{" "}
              <a href={`mailto:${site.email}`} className="text-primary hover:underline">
                {site.email}
              </a>
            </li>
            <li>
              <span className="font-medium text-foreground">Hours:</span>
              <br />
              {site.hours.weekdays}
              <br />
              {site.hours.sunday}
              <br />
              {site.hours.note}
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            How to reach: We are on Siyaganj Main Road, opposite Tijori Gali. Siyaganj is well
            connected by road; you can ask for &quot;HM Ibrahim & Co&quot; or &quot;Tijori Gali&quot;.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Call now
            </a>
            <a
              href={getWhatsAppLink(site.whatsapp, "Hi, I'd like to inquire about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>

      <section className="mt-16" aria-label="Map">
        <h2 className="text-xl font-semibold text-foreground">Map</h2>
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          <iframe
            title="Location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.fullAddress)}&output=embed`}
            className="h-full w-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          Open in Google Maps →
        </a>
      </section>
    </div>
  );
}
