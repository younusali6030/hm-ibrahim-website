"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { trustTestimonials } from "@/content/trust";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  /** Max testimonials to show; default 6 */
  max?: number;
  /** Show CTA below grid */
  showCta?: boolean;
  title?: string;
  className?: string;
};

export function TestimonialsGrid({
  max = 6,
  showCta = true,
  title = "What our customers say",
  className = "",
}: Props) {
  const items = trustTestimonials.slice(0, max);

  return (
    <section className={className} aria-labelledby="testimonials-grid-heading">
      <h2 id="testimonials-grid-heading" className="text-h2 font-heading font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4 sm:p-5">
              {t.rating != null && (
                <div className="flex gap-1 text-primary" aria-hidden>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              )}
              <blockquote className="mt-2 text-body text-foreground leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-3">
                <p className="font-semibold text-small text-foreground">{t.name}</p>
                <p className="text-small text-muted-foreground">
                  {t.companyType}
                  {t.city && ` • ${t.city}`}
                </p>
              </footer>
            </CardContent>
          </Card>
        ))}
      </div>
      {showCta && (
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/quote">Request a Quote</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
