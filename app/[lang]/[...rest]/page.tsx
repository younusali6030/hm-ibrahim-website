import { notFound } from "next/navigation";

/** Any URL that matches no page lands here, so the localized not-found page (with the site chrome) is rendered. */
export default function CatchAll() {
  notFound();
}
