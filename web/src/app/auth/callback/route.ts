import { NextResponse } from "next/server";

import { ensureJourneyEnrollment } from "@/features/journey/ensure-enrollment";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await ensureJourneyEnrollment(supabase, data.user.id);
      return NextResponse.redirect(new URL("/", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", requestUrl.origin));
}
