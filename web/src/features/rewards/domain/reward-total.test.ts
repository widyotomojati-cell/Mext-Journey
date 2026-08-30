import { describe, expect, it } from "vitest";

import { calculateTotalXp } from "./reward-total";

describe("calculateTotalXp", () => {
  it("counts a reward only once when completion is retried", () => {
    expect(
      calculateTotalXp([
        { assignmentId: "day-1", eventType: "daily-xp", xp: 20 },
        { assignmentId: "day-1", eventType: "daily-xp", xp: 20 },
        { assignmentId: "day-2", eventType: "daily-xp", xp: 20 },
      ]),
    ).toBe(40);
  });
});
