import { ClosingBand } from "@/components/site/ClosingBand";

/**
 * The page-closing call to action. Kept under its old name so every page that ends with it stays in step:
 * one line and three ways in (quote, WhatsApp, call). Address, hours and phone numbers are in the footer.
 */
export function ContactStrip({
  heading = "Come to the counter",
  quoteHref = "/contact",
  waMessage = "Hi, I'd like a rate. Product, size and quantity: ",
  headingId = "visit-strip-heading",
  sub,
}: {
  heading?: string;
  quoteHref?: string;
  waMessage?: string;
  headingId?: string;
  sub?: string;
  /** Retained for existing call sites; the band no longer carries bottom padding of its own. */
  tightBottom?: boolean;
}) {
  return <ClosingBand heading={heading} sub={sub} quoteHref={quoteHref} waMessage={waMessage} headingId={headingId} />;
}
