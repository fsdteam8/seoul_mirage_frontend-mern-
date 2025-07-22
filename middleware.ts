// middleware.ts

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const defaultLocale = "en";
const locales = ["en", "ar"];

function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("preferredLocale")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  const headers = { "accept-language": acceptedLanguage };

  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
}

export async function middleware(req: NextRequest) {
  // get the pathname from request url

  const pathName = req.nextUrl.pathname;
  // ✅ Ignore API routes early
  if (pathName.startsWith("/api")) {
    return NextResponse.next();
  }
  const pathNameIsMissingLocale = locales.every(
    (locale) =>
      !pathName.startsWith(`/${locale}`) && !pathName.startsWith(`/${locale}/`)
  );

  if (pathNameIsMissingLocale) {
    // detech users preference locale & redirect with a locale with a path
    const locale = getLocale(req);

    return NextResponse.redirect(new URL(`/${locale}/${pathName}`, req.url));
  }

  return NextResponse.next();
}

// Match the exact route or paths you want to protect
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
