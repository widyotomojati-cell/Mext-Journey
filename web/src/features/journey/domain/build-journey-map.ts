import type {
  AssignmentStatus,
  QuestType,
} from "@/features/quests/domain/types";

export type JourneyNodeState = AssignmentStatus | "next" | "locked";

export type JourneyQuestDefinition = {
  id: string;
  dayNumber: number;
  questType: QuestType;
  theme: string;
  title: string;
  durationMinutes: number;
  xpValue: number;
};

export type JourneyAssignmentSnapshot = {
  questDefinitionId: string;
  status: AssignmentStatus;
};

export type JourneyNode = JourneyQuestDefinition & {
  state: JourneyNodeState;
};

export function buildJourneyMap(
  definitions: JourneyQuestDefinition[],
  assignments: JourneyAssignmentSnapshot[],
): JourneyNode[] {
  const assignmentByQuest = new Map(
    assignments.map((assignment) => [
      assignment.questDefinitionId,
      assignment.status,
    ]),
  );
  const nextQuestId = definitions.find(
    (definition) => !assignmentByQuest.has(definition.id),
  )?.id;

  return definitions.map((definition) => {
    const assignmentState = assignmentByQuest.get(definition.id);

    return {
      ...definition,
      state:
        assignmentState ??
        (definition.id === nextQuestId ? "next" : "locked"),
    };
  });
}
