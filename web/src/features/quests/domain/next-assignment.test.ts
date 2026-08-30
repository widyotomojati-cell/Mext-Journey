import { describe, expect, it } from "vitest";

import { decideNextAssignment } from "./next-assignment";

describe("decideNextAssignment", () => {
  it("replaces one missed standard quest with one Recovery Quest", () => {
    const decision = decideNextAssignment({
      effectiveDate: "2026-08-31",
      currentAssignment: {
        assignmentDate: "2026-08-30",
        status: "available",
        questType: "standard",
      },
    });

    expect(decision).toEqual({
      action: "assign-recovery",
      missedAssignmentDate: "2026-08-30",
    });
  });

  it("does not create several recovery quests after several absent days", () => {
    const decision = decideNextAssignment({
      effectiveDate: "2026-08-31",
      currentAssignment: {
        assignmentDate: "2026-08-27",
        status: "started",
        questType: "standard",
      },
    });

    expect(decision).toEqual({
      action: "assign-recovery",
      missedAssignmentDate: "2026-08-27",
    });
  });

  it("moves forward normally after a completed quest", () => {
    const decision = decideNextAssignment({
      effectiveDate: "2026-08-31",
      currentAssignment: {
        assignmentDate: "2026-08-30",
        status: "completed",
        questType: "standard",
      },
    });

    expect(decision).toEqual({ action: "assign-next-standard" });
  });
});
