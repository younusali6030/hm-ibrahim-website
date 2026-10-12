import type { ReactNode } from "react";
import { ClosingBand } from "@/components/site/ClosingBand";
import { T } from "@/lib/i18n";

type Props = {
  title?: ReactNode;
  description?: ReactNode;
  quoteLabel?: ReactNode;
  whatsAppMessage?: string;
};

/** Closing band: same component as ContactStrip, so every page ends the same way. */
export function CTASection({
  title = <T en="Ready to order?" hi="ऑर्डर देने के लिए तैयार?" />,
  description = <T en="Send the list. We confirm stock and call back with the rate." hi="अपनी सूची भेजिए। हम स्टॉक देखकर रेट के साथ वापस कॉल करेंगे।" />,
  quoteLabel = <T en="Request a quote" hi="कोटेशन माँगें" />,
  whatsAppMessage,
}: Props) {
  return (
    <ClosingBand heading={title} sub={description} quoteLabel={quoteLabel} waMessage={whatsAppMessage} headingId="cta-heading" />
  );
}
