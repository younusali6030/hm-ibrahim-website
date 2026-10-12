import { ClosingBand } from "@/components/site/ClosingBand";

type Props = {
  title?: string;
  description?: string;
  quoteLabel?: string;
  whatsAppMessage?: string;
};

/** Closing band: same component as ContactStrip, so every page ends the same way. */
export function CTASection({
  title = "Ready to order?",
  description = "Send the list. We confirm stock and call back with the rate.",
  quoteLabel = "Request a quote",
  whatsAppMessage = "Hi, I'm interested in your products. Please share price/availability.",
}: Props) {
  return (
    <ClosingBand heading={title} sub={description} quoteLabel={quoteLabel} waMessage={whatsAppMessage} headingId="cta-heading" />
  );
}
