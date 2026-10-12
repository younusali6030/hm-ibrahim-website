"use client";

import NextLink from "next/link";
import { forwardRef, type ComponentProps } from "react";
import { useLang } from "@/lib/i18n";
import { localePath } from "@/lib/locale";

type Props = ComponentProps<typeof NextLink>;

/**
 * Drop-in for next/link that keeps visitors in their language: in Hindi, "/products" becomes "/hi/products".
 * External, hash, mailto and tel links pass through untouched.
 */
const LocaleLink = forwardRef<HTMLAnchorElement, Props>(function LocaleLink({ href, ...rest }, ref) {
  const { lang } = useLang();
  let to = href;
  if (typeof href === "string") {
    if (href.startsWith("/") && !href.startsWith("//")) to = localePath(lang, href);
  } else if (href && typeof href.pathname === "string" && href.pathname.startsWith("/")) {
    to = { ...href, pathname: localePath(lang, href.pathname) };
  }
  return <NextLink ref={ref} href={to} {...rest} />;
});

export default LocaleLink;
