import type { ReactNode } from "react";
import { ClosingBand } from "@/components/site/ClosingBand";
import { T } from "@/lib/i18n";

/**
 * The page-closing call to action. Kept under its old name so every page that ends with it stays in step:
 * one line and three ways in (quote, WhatsApp, call). Address, hours and phone numbers are in the footer.
 */
export function ContactStrip({
  heading,
  quoteHref = "/contact",
  waMessage,
  headingId = "visit-strip-heading",
  sub,
}: {
  heading?: ReactNode;
  quoteHref?: string;
  waMessage?: string;
  headingId?: string;
  sub?: ReactNode;
  /** Retained for existing call sites; the band no longer carries bottom padding of its own. */
  tightBottom?: boolean;
}) {
  return <ClosingBand heading={heading ?? <T en="Come to the counter" hi="काउंटर पर आइए" />} sub={sub} quoteHref={quoteHref} waMessage={waMessage} headingId={headingId} />;
}
