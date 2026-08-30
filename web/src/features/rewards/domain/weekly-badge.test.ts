import { describe, expect, it } from "vitest";

import { qualifiesForWeeklyBadge } from "./weekly-badge";

describe("qualifiesForWeeklyBadge", () => {
  it("awards the badge after five of six eligible quests", () => {
    expect(
      qualifiesForWeeklyBadge([
        { status: "completed", questType: "standard" },
        { status: "completed", questType: "standard" },
        { status: "completed", questType: "recovery" },
        { status: "completed", questType: "standard" },
        { status: "completed", questType: "standard" },
        { status: "missed", questType: "standard" },
      ]),
    ).toBe(true);
  });

  it("does not count an optional review toward the five required quests", () => {
    expect(
      qualifiesForWeeklyBadge([
        { status: "completed", questType: "standard" },
        { status: "completed", questType: "standard" },
        { status: "completed", questType: "standard" },
        { status: "completed", questType: "standard" },
        { status: "missed", questType: "standard" },
        { status: "missed", questType: "standard" },
        { status: "completed", questType: "optional-review" },
      ]),
    ).toBe(false);
  });
});
