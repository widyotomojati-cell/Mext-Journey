import { redirect } from "next/navigation";

import { ensureJourneyEnrollment } from "@/features/journey/ensure-enrollment";
import {
  buildJourneyMap,
  type JourneyAssignmentSnapshot,
  type JourneyQuestDefinition,
} from "@/features/journey/domain/build-journey-map";
import { calculateCurrentStreak } from "@/features/rewards/domain/calculate-streak";
import { qualifiesForWeeklyBadge } from "@/features/rewards/domain/weekly-badge";
import type { AssignmentStatus, QuestType } from "@/features/quests/domain/types";
import { createClient } from "@/lib/supabase/server";

type Pack = {
  title: string;
  total_days: number;
};

type DefinitionRow = {
  id: string;
  day_number: number | null;
  quest_type: QuestType;
  theme: string;
  title: string;
  duration_minutes: number;
  xp_value: number;
};

type AssignmentRow = {
  quest_definition_id: string;
  assignment_date: string;
  status: AssignmentStatus;
  quest_definitions:
    | {
        day_number: number | null;
        quest_type: QuestType;
        duration_minutes: number;
      }
    | {
        day_number: number | null;
        quest_type: QuestType;
        duration_minutes: number;
      }[];
};

function firstRelated<T>(value: T | T[]) {
  return Array.isArray(value) ? value[0] : value;
}

export async function getJourneyOverview() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) redirect("/login");

  const ensured = await ensureJourneyEnrollment(supabase, userId);
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("journey_enrollments")
    .select("id, pack_id, start_date, quest_packs(title, total_days)")
    .eq("id", ensured.id)
    .single();

  if (enrollmentError) throw enrollmentError;

  const [definitionsResult, assignmentsResult, rewardsResult] =
    await Promise.all([
      supabase
        .from("quest_definitions")
        .select(
          "id, day_number, quest_type, theme, title, duration_minutes, xp_value",
        )
        .eq("pack_id", enrollment.pack_id)
        .not("day_number", "is", null)
        .order("day_number", { ascending: true }),
      supabase
        .from("daily_assignments")
        .select(
          "quest_definition_id, assignment_date, status, quest_definitions(day_number, quest_type, duration_minutes)",
        )
        .eq("enrollment_id", enrollment.id)
        .order("assignment_date", { ascending: true }),
      supabase.from("reward_ledger").select("xp, event_type, created_at"),
    ]);

  if (definitionsResult.error) throw definitionsResult.error;
  if (assignmentsResult.error) throw assignmentsResult.error;
  if (rewardsResult.error) throw rewardsResult.error;

  const pack = firstRelated(enrollment.quest_packs as unknown as Pack | Pack[]);
  const definitions = (definitionsResult.data as DefinitionRow[])
    .filter(
      (definition): definition is DefinitionRow & { day_number: number } =>
        definition.day_number !== null,
    )
    .map(
      (definition): JourneyQuestDefinition => ({
        id: definition.id,
        dayNumber: definition.day_number,
        questType: definition.quest_type,
        theme: definition.theme,
        title: definition.title,
        durationMinutes: definition.duration_minutes,
        xpValue: definition.xp_value,
      }),
    );

  const assignments = (assignmentsResult.data as AssignmentRow[]).map(
    (assignment) => ({
      ...assignment,
      definition: firstRelated(assignment.quest_definitions),
    }),
  );
  const mapAssignments: JourneyAssignmentSnapshot[] = assignments.map(
    (assignment) => ({
      questDefinitionId: assignment.quest_definition_id,
      status: assignment.status,
    }),
  );
  const nodes = buildJourneyMap(definitions, mapAssignments);
  const finalizedHistory = assignments
    .filter(
      (
        assignment,
      ): assignment is typeof assignment & {
        status: "completed" | "missed";
      } =>
        assignment.status === "completed" || assignment.status === "missed",
    )
    .map((assignment) => ({
      status: assignment.status,
      questType: assignment.definition.quest_type,
    }));
  const firstWeekHistory = assignments
    .filter(
      (assignment) =>
        assignment.definition.day_number !== null &&
        assignment.definition.day_number <= 7 &&
        (assignment.status === "completed" || assignment.status === "missed"),
    )
    .map((assignment) => ({
      status: assignment.status as "completed" | "missed",
      questType: assignment.definition.quest_type,
    }));
  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "completed",
  );
  const completedCount = completedAssignments.length;
  const actionableNode = nodes.find((node) =>
    ["available", "started", "next"].includes(node.state),
  );

  return {
    packTitle: pack.title,
    totalDays: pack.total_days,
    startDate: enrollment.start_date,
    nodes,
    activeDay:
      actionableNode?.dayNumber ??
      Math.min(Math.max(completedCount, 1), pack.total_days),
    completedCount,
    completionPercent: Math.round((completedCount / pack.total_days) * 100),
    streak: calculateCurrentStreak(finalizedHistory),
    totalXp: rewardsResult.data.reduce((sum, reward) => sum + reward.xp, 0),
    completedMinutes: completedAssignments.reduce(
      (sum, assignment) => sum + assignment.definition.duration_minutes,
      0,
    ),
    weeklyBadgeUnlocked: qualifiesForWeeklyBadge(firstWeekHistory),
    weeklyCompleted: firstWeekHistory.filter(
      (entry) =>
        entry.status === "completed" &&
        entry.questType !== "optional-review",
    ).length,
    nextQuest: actionableNode
      ? {
          dayNumber: actionableNode.dayNumber,
          title: actionableNode.title,
          durationMinutes: actionableNode.durationMinutes,
        }
      : null,
  };
}
