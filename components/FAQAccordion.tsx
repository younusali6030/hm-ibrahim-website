"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "@/content/faqs";

type Props = {
  faqs: FAQ[];
  title?: string;
  description?: string;
};

export function FAQAccordion({
  faqs,
  title = "Frequently Asked Questions",
  description,
}: Props) {
  return (
    <section className="py-16 md:py-20" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <h2 id="faq-heading" className="text-center text-3xl font-bold text-foreground md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            {description}
          </p>
        )}
        <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
