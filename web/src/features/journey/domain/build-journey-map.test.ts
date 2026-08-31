import { describe, expect, it } from "vitest";

import {
  buildJourneyMap,
  type JourneyQuestDefinition,
} from "./build-journey-map";

const definitions: JourneyQuestDefinition[] = [1, 2, 3].map((dayNumber) => ({
  id: `quest-${dayNumber}`,
  dayNumber,
  questType: "standard",
  theme: "Foundation",
  title: `Quest ${dayNumber}`,
  durationMinutes: 15,
  xpValue: 20,
}));

describe("buildJourneyMap", () => {
  it("marks the first unassigned quest as next", () => {
    const nodes = buildJourneyMap(definitions, [
      { questDefinitionId: "quest-1", status: "completed" },
    ]);

    expect(nodes.map((node) => node.state)).toEqual([
      "completed",
      "next",
      "locked",
    ]);
  });

  it("keeps an active assignment as the actionable node", () => {
    const nodes = buildJourneyMap(definitions, [
      { questDefinitionId: "quest-1", status: "started" },
    ]);

    expect(nodes.map((node) => node.state)).toEqual([
      "started",
      "next",
      "locked",
    ]);
  });

  it("preserves missed history while opening the next step", () => {
    const nodes = buildJourneyMap(definitions, [
      { questDefinitionId: "quest-1", status: "missed" },
    ]);

    expect(nodes.map((node) => node.state)).toEqual([
      "missed",
      "next",
      "locked",
    ]);
  });
});
