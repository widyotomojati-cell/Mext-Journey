import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === "development" &&
    request.nextUrl.hostname === "127.0.0.1"
  ) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.hostname = "localhost";
    return NextResponse.redirect(canonicalUrl);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
