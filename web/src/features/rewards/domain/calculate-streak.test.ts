import { describe, expect, it } from "vitest";

import { calculateCurrentStreak } from "./calculate-streak";

describe("calculateCurrentStreak", () => {
  it("counts consecutive completed eligible quests", () => {
    expect(
      calculateCurrentStreak([
        { status: "completed", questType: "standard" },
        { status: "completed", questType: "standard" },
      ]),
    ).toBe(2);
  });

  it("resets after a missed eligible quest", () => {
    expect(
      calculateCurrentStreak([
        { status: "completed", questType: "standard" },
        { status: "missed", questType: "standard" },
      ]),
    ).toBe(0);
  });

  it("ignores an optional review day", () => {
    expect(
      calculateCurrentStreak([
        { status: "completed", questType: "standard" },
        { status: "missed", questType: "optional-review" },
      ]),
    ).toBe(1);
  });
});
