"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";

const QUOTE_STORAGE_KEY = "quoteWhatsAppMessage";

export function QuoteSuccessContent() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(QUOTE_STORAGE_KEY);
    if (stored) {
      setMessage(stored);
      sessionStorage.removeItem(QUOTE_STORAGE_KEY);
    }
  }, []);

  if (message) {
    const whatsappUrl = getWhatsAppLink(site.whatsapp, message);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground">Quote request received</h1>
        <p className="mt-4 text-muted-foreground">
          We&apos;ve sent a product catalog with tentative prices to your email. Check your inbox (and spam folder). You can also send your request to us on WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send quote to WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              Send to WhatsApp ({site.phone})
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-foreground">Quote request received</h1>
      <p className="mt-4 text-muted-foreground">
        We&apos;ve sent a product catalog with tentative prices to your email. Check your inbox (and spam folder). We&apos;ll confirm exact rates when you contact us.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
