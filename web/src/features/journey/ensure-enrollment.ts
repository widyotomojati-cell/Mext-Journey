import type { SupabaseClient } from "@supabase/supabase-js";

function nextMonday(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  const daysUntilMonday = (8 - value.getUTCDay()) % 7;
  value.setUTCDate(value.getUTCDate() + daysUntilMonday);
  return value.toISOString().slice(0, 10);
}

export async function ensureJourneyEnrollment(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data: existing, error: enrollmentError } = await supabase
    .from("journey_enrollments")
    .select("id, start_date")
    .eq("status", "active")
    .maybeSingle();

  if (enrollmentError) throw enrollmentError;
  if (existing) return existing;

  const [packResult, dateResult] = await Promise.all([
    supabase
      .from("quest_packs")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .single(),
    supabase.rpc("effective_quest_date"),
  ]);

  if (packResult.error) throw packResult.error;
  if (dateResult.error) throw dateResult.error;

  const { data: created, error: createError } = await supabase
    .from("journey_enrollments")
    .insert({
      user_id: userId,
      pack_id: packResult.data.id,
      start_date: nextMonday(String(dateResult.data)),
    })
    .select("id, start_date")
    .single();

  if (createError) throw createError;
  return created;
}
