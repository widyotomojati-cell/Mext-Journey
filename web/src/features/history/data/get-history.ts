import { redirect } from "next/navigation";

import type {
  AssignmentStatus,
  EvidenceMode,
  QuestType,
} from "@/features/quests/domain/types";
import { createClient } from "@/lib/supabase/server";

type Related<T> = T | T[] | null;

type EvidenceRow = {
  mode: EvidenceMode;
  note_text: string | null;
  source_url: string | null;
  storage_path: string | null;
  difficulty: number | null;
};

type MentorReviewRow = {\n  verdict: "strong" | "refine";\n  strengths: string[];\n  focus_area: string;\n  suggestion: string;\n  follow_up_question: string | null;\n};\n\ntype AssignmentRow = {
  id: string;
  assignment_date: string;
  status: AssignmentStatus;
  completed_at: string | null;
  quest_definitions: Related<{
    day_number: number | null;
    quest_type: QuestType;
    theme: string;
    title: string;
    duration_minutes: number;
  }>;
  evidence: Related<EvidenceRow>;
  reward_ledger: Related<{
    xp: number;
    event_type: string;
  }>;
  mentor_reviews: Related<MentorReviewRow>;\n  journey_enrollments: Related<{
    quest_packs: Related<{
      title: string;
    }>;
  }>;
};

export type HistoryItem = {
  id: string;
  assignmentDate: string;
  status: "completed" | "missed";
  completedAt: string | null;
  dayNumber: number | null;
  questType: QuestType;
  theme: string;
  title: string;
  durationMinutes: number;
  evidence: {
    mode: EvidenceMode;
    value: string;
    difficulty: number | null;
  } | null;
  xp: number;
  packTitle: string;
};

function firstRelated<T>(value: Related<T>) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function evidenceValue(evidence: EvidenceRow) {
  if (evidence.mode === "note") return evidence.note_text ?? "";
  if (evidence.mode === "url") return evidence.source_url ?? "";
  return evidence.storage_path ?? "";
}

export async function getHistory(): Promise<HistoryItem[]> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) redirect("/login");

  const { data, error } = await supabase
    .from("daily_assignments")
    .select(
      "id, assignment_date, status, completed_at, quest_definitions(day_number, quest_type, theme, title, duration_minutes), evidence(mode, note_text, source_url, storage_path, difficulty), reward_ledger(xp, event_type), mentor_reviews(verdict, strengths, focus_area, suggestion, follow_up_question), journey_enrollments(quest_packs(title))",
    )
    .eq("user_id", userId)
    .in("status", ["completed", "missed"])
    .order("assignment_date", { ascending: false });

  if (error) throw error;

  return (data as unknown as AssignmentRow[]).flatMap((assignment) => {
    const definition = firstRelated(assignment.quest_definitions);
    const evidence = firstRelated(assignment.evidence);
    const mentorReview = firstRelated(assignment.mentor_reviews);\n    const enrollment = firstRelated(assignment.journey_enrollments);
    const pack = firstRelated(enrollment?.quest_packs ?? null);
    const rewards = Array.isArray(assignment.reward_ledger)
      ? assignment.reward_ledger
      : assignment.reward_ledger
        ? [assignment.reward_ledger]
        : [];

    if (
      !definition ||
      (assignment.status !== "completed" && assignment.status !== "missed")
    ) {
      return [];
    }

    return [
      {
        id: assignment.id,
        assignmentDate: assignment.assignment_date,
        status: assignment.status,
        completedAt: assignment.completed_at,
        dayNumber: definition.day_number,
        questType: definition.quest_type,
        theme: definition.theme,
        title: definition.title,
        durationMinutes: definition.duration_minutes,
        evidence: evidence
          ? {
              mode: evidence.mode,
              value: evidenceValue(evidence),
              difficulty: evidence.difficulty,
            }
          : null,
        xp: rewards
          .filter((reward) => reward.event_type === "daily-xp")
          .reduce((total, reward) => total + reward.xp, 0),
        packTitle: pack?.title ?? "MEXT Journey",\n        mentorReview,
      },
    ];
  });
}
