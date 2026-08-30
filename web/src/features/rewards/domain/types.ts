import type { QuestType } from "@/features/quests/domain/types";

export type FinalizedStreakEntry = {
  status: "completed" | "missed";
  questType: QuestType;
};

export type RewardEventType = "daily-xp" | "weekly-badge" | "journey-stamp";

export type RewardEvent = {
  assignmentId: string;
  eventType: RewardEventType;
  xp: number;
};
