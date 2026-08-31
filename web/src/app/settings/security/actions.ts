"use server";

import { redirect } from "next/navigation";

import { validatePin } from "@/features/auth/domain/pin";
import { createClient } from "@/lib/supabase/server";

export type PinSetupState = {
  message: string;
  error: boolean;
  success: boolean;
};

export async function updatePin(
  _previousState: PinSetupState,
  formData: FormData,
): Promise<PinSetupState> {
  const pin = String(formData.get("pin") ?? "").trim();
  const confirmation = String(formData.get("confirmation") ?? "").trim();
  const validationError = validatePin(pin, confirmation);

  if (validationError) {
    return { message: validationError, error: true, success: false };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password: pin });

  if (error) {
    return {
      message: "PIN belum bisa disimpan. Coba kombinasi angka lain.",
      error: true,
      success: false,
    };
  }

  return {
    message: "PIN aktif. Sekarang PIN yang sama bisa dipakai di device lain.",
    error: false,
    success: true,
  };
}
