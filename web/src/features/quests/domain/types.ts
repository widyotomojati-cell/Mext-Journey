export type QuestType = "standard" | "recovery" | "optional-review";

export type AssignmentStatus =
  | "available"
  | "started"
  | "completed"
  | "missed";

export type AssignmentSnapshot = {
  assignmentDate: string;
  status: AssignmentStatus;
  questType: QuestType;
};

export type EvidenceMode = "note" | "url" | "file";
