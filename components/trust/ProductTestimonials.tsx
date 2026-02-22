import Link from "next/link";
import { Star } from "lucide-react";
import { getTestimonialsForProduct } from "@/content/trust";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  categorySlug?: string;
  productSlug?: string;
  max?: number;
  className?: string;
};

export function ProductTestimonials({
  categorySlug,
  productSlug,
  max = 3,
  className = "",
}: Props) {
  const items = getTestimonialsForProduct(categorySlug, productSlug, max);
  if (items.length === 0) return null;

  return (
    <section className={className} aria-labelledby="product-testimonials-heading">
      <h2 id="product-testimonials-heading" className="text-h3 font-heading font-semibold text-foreground">
        What buyers say
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4">
              {t.rating != null && (
                <div className="flex gap-1 text-primary" aria-hidden>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              )}
              <blockquote className="mt-2 text-small text-foreground leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-2">
                <p className="font-medium text-small text-foreground">{t.name}</p>
                <p className="text-small text-muted-foreground">
                  {t.companyType}
                  {t.city && ` • ${t.city}`}
                </p>
              </footer>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-4">
        <Button asChild size="sm" variant="outline">
          <Link href="/quote">Request a Quote</Link>
        </Button>
      </p>
    </section>
  );
}
