import type { FinalizedStreakEntry } from "./types";

const REQUIRED_COMPLETIONS = 5;

export function qualifiesForWeeklyBadge(
  weekHistory: FinalizedStreakEntry[],
): boolean {
  const completedEligibleQuests = weekHistory.filter(
    (entry) =>
      entry.questType !== "optional-review" && entry.status === "completed",
  ).length;

  return completedEligibleQuests >= REQUIRED_COMPLETIONS;
}
