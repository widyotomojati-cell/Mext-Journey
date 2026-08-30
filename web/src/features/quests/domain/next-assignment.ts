import type { AssignmentSnapshot } from "./types";

type NextAssignmentInput = {
  effectiveDate: string;
  currentAssignment: AssignmentSnapshot;
};

export type NextAssignmentDecision =
  | { action: "keep-current" }
  | { action: "assign-next-standard" }
  | { action: "assign-recovery"; missedAssignmentDate: string };

export function decideNextAssignment({
  effectiveDate,
  currentAssignment,
}: NextAssignmentInput): NextAssignmentDecision {
  if (currentAssignment.assignmentDate >= effectiveDate) {
    return { action: "keep-current" };
  }

  if (
    currentAssignment.status === "completed" ||
    currentAssignment.questType === "optional-review"
  ) {
    return { action: "assign-next-standard" };
  }

  return {
    action: "assign-recovery",
    missedAssignmentDate: currentAssignment.assignmentDate,
  };
}
