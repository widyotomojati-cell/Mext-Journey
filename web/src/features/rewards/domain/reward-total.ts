import type { RewardEvent } from "./types";

export function calculateTotalXp(events: RewardEvent[]): number {
  const countedRewards = new Set<string>();
  let totalXp = 0;

  for (const event of events) {
    const rewardKey = `${event.assignmentId}:${event.eventType}`;

    if (countedRewards.has(rewardKey)) {
      continue;
    }

    countedRewards.add(rewardKey);
    totalXp += event.xp;
  }

  return totalXp;
}
