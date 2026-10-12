import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/dictionaries";

/**
 * Locale routing.
 *
 * Renamed from middleware.ts — Next 16 deprecates that convention in favour of
 * proxy.ts, and the exported function is `proxy` rather than `middleware`.
 *
 * Send bare paths to a locale. Preference order: what the visitor's browser
 * asks for, then French — the brief is written in French and France, Belgium
 * and Switzerland are the named shipping markets.
 */
function pick(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  for (const tag of header.split(",")) {
    const code = tag.split(";")[0].trim().slice(0, 2).toLowerCase();
    if ((locales as readonly string[]).includes(code)) return code;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  const locale = pick(request);
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  /*
    SEO audit (11 Oct): to the default French a PERMANENT redirect, so Google
    treats /fr as the home of therootscorner.com rather than keeping the bare
    domain as a page that has no content of its own. A visitor whose browser
    asks for English still gets a temporary one. The answer depends on
    Accept-Language, so it must never be cached for everyone.

    301/302, not 308/307: Meta's link crawler (Facebook, Instagram, WhatsApp)
    follows a 301 and stops at a 308, so a shared "therootscorner.com" had no
    preview. Measured on Cloudflare, 12 Oct: 315 crawler requests for / in a
    day, 3 followed on to /fr. Google treats 301 and 308 the same.
  */
  const res = NextResponse.redirect(url, locale === defaultLocale ? 301 : 302);
  res.headers.set("Vary", "Accept-Language");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  // Everything except Next internals, the API, and anything with a file extension.
  matcher: ["/((?!_next|api|.*\..*).*)"],
};
