import type { FinalizedStreakEntry } from "./types";

export function calculateCurrentStreak(
  history: FinalizedStreakEntry[],
): number {
  const eligibleHistory = history.filter(
    (entry) => entry.questType !== "optional-review",
  );

  let streak = 0;

  for (let index = eligibleHistory.length - 1; index >= 0; index -= 1) {
    if (eligibleHistory[index].status === "missed") {
      break;
    }

    streak += 1;
  }

  return streak;
}
