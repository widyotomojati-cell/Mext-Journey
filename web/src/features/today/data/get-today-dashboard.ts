import { redirect } from "next/navigation";

import { ensureJourneyEnrollment } from "@/features/journey/ensure-enrollment";
import { calculateCurrentStreak } from "@/features/rewards/domain/calculate-streak";
import { createClient } from "@/lib/supabase/server";

type QuestDefinition = {
  day_number: number | null;
  quest_type: "standard" | "recovery" | "optional-review";
  theme: string;
  title: string;
  instructions: string;
  evidence_prompt: string;
  duration_minutes: number;
  xp_value: number;
};

type Assignment = {
  id: string;
  assignment_date: string;
  quest_definition_id: string;
  status: "available" | "started" | "completed" | "missed";
};

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${date}T12:00:00+07:00`));
}

export async function getTodayDashboard() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) redirect("/login");

  const enrollment = await ensureJourneyEnrollment(supabase, userId);
  const { data: assignments, error: assignmentError } = await supabase.rpc(
    "get_or_create_today_assignment",
  );

  if (assignmentError) throw assignmentError;
  const assignment = (assignments?.[0] ?? null) as Assignment | null;

  if (!assignment) {
    return { kind: "waiting" as const, startDate: enrollment.start_date };
  }

  const [questResult, packResult, rewardResult, historyResult] = await Promise.all([
    supabase
      .from("quest_definitions")
      .select(
        "day_number, quest_type, theme, title, instructions, evidence_prompt, duration_minutes, xp_value",
      )
      .eq("id", assignment.quest_definition_id)
      .single(),
    supabase
      .from("journey_enrollments")
      .select("quest_packs(title, total_days)")
      .eq("id", enrollment.id)
      .single(),
    supabase.from("reward_ledger").select("xp"),
    supabase
      .from("daily_assignments")
      .select("status, quest_definitions(quest_type)")
      .in("status", ["completed", "missed"])
      .order("assignment_date", { ascending: true }),
  ]);

  if (questResult.error) throw questResult.error;
  if (packResult.error) throw packResult.error;
  if (rewardResult.error) throw rewardResult.error;
  if (historyResult.error) throw historyResult.error;

  const quest = questResult.data as QuestDefinition;
  const pack = packResult.data.quest_packs as unknown as {
    title: string;
    total_days: number;
  };
  const history = historyResult.data.map((entry) => ({
    status: entry.status as "completed" | "missed",
    questType: (
      entry.quest_definitions as unknown as {
        quest_type: QuestDefinition["quest_type"];
      }
    ).quest_type,
  }));

  return {
    kind: "ready" as const,
    assignment,
    quest: {
      day: quest.day_number ?? 1,
      totalDays: pack.total_days,
      dateLabel: formatDateLabel(assignment.assignment_date),
      sprintLabel: pack.title,
      theme: quest.theme,
      title: quest.title,
      description: quest.instructions,
      durationMinutes: quest.duration_minutes,
      rewardXp: quest.xp_value,
      evidenceLabel: quest.evidence_prompt,
      researchFocus: "Passive design · Hot-humid landed housing",
    },
    totalXp: rewardResult.data.reduce((sum, entry) => sum + entry.xp, 0),
    streak: calculateCurrentStreak(history),
  };
}
