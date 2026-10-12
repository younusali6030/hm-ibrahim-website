"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "@/content/faqs";
import type { ReactNode } from "react";
import { T } from "@/lib/i18n";

type Props = {
  faqs: FAQ[];
  title?: ReactNode;
  description?: ReactNode;
  /** When true, renders just the accordion (no outer section/heading). */
  inline?: boolean;
};

export function FAQAccordion({
  faqs,
  title = <T en="Frequently Asked Questions" hi="अक्सर पूछे जाने वाले सवाल" />,
  description,
  inline = false,
}: Props) {
  const accordion = (
    <Accordion type="single" collapsible className="mx-auto mt-10 w-full max-w-3xl border-t border-foreground/40">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="min-h-[56px] text-left text-base font-semibold">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  if (inline) {
    return accordion;
  }

  return (
    <section className="py-14 md:py-20" aria-labelledby="faq-heading">
      <div className="page-container section-padding">
        <h2 id="faq-heading" className="mx-auto max-w-3xl text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">
            {description}
          </p>
        )}
        {accordion}
      </div>
    </section>
  );
}
