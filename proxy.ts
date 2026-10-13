import { NextResponse, type NextRequest } from "next/server";

/**
 * Language routing.
 *   /products      -> app/[lang]/products with lang = "en" (URL unchanged, so existing rankings are kept)
 *   /hi/products   -> app/[lang]/products with lang = "hi"
 *   /en/products   -> 308 to /products (one URL per page, no duplicate English)
 * Static files, _next, api and the root sitemap/robots routes are excluded by the matcher.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/hi" || pathname.startsWith("/hi/")) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
