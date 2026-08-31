"use server";

import { createClient } from "@/lib/supabase/server";

export type LoginState = { message: string; error: boolean };

export async function sendMagicLink(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) {
    return { message: "Masukkan alamat email yang valid.", error: true };
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  });

  if (error) {
    return {
      message: "Magic link belum terkirim. Coba lagi sebentar.",
      error: true,
    };
  }

  return {
    message: "Magic link terkirim. Buka inbox lalu klik link-nya.",
    error: false,
  };
}
