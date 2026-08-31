"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) redirect("/login");
  return supabase;
}

export async function startQuest(formData: FormData) {
  const assignmentId = String(formData.get("assignmentId") ?? "");
  if (!assignmentId) throw new Error("Quest tidak ditemukan.");

  const supabase = await authenticatedClient();
  const { error } = await supabase.rpc("start_daily_assignment", {
    p_assignment_id: assignmentId,
  });

  if (error) throw new Error("Quest belum bisa dimulai. Coba sekali lagi.");
  revalidatePath("/");
}

export async function completeQuest(formData: FormData) {
  const assignmentId = String(formData.get("assignmentId") ?? "");
  const evidenceNote = String(formData.get("evidenceNote") ?? "").trim();

  if (!assignmentId || evidenceNote.length < 3) {
    throw new Error("Isi minimal tiga karakter sebelum menyelesaikan quest.");
  }

  const supabase = await authenticatedClient();
  const { error } = await supabase.rpc("complete_daily_assignment", {
    p_assignment_id: assignmentId,
    p_mode: "note",
    p_note_text: evidenceNote,
  });

  if (error) throw new Error("Jawaban belum tersimpan. Coba sekali lagi.");
  revalidatePath("/");
}
