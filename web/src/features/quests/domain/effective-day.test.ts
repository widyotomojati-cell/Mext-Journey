import { describe, expect, it } from "vitest";

import { getEffectiveQuestDate } from "./effective-day";

describe("getEffectiveQuestDate", () => {
  it("keeps 02:59 WIB inside the previous quest day", () => {
    const now = new Date("2026-08-30T19:59:00.000Z");

    expect(getEffectiveQuestDate(now, "Asia/Jakarta")).toBe("2026-08-30");
  });

  it("opens the new quest day at 03:00 WIB", () => {
    const now = new Date("2026-08-30T20:00:00.000Z");

    expect(getEffectiveQuestDate(now, "Asia/Jakarta")).toBe("2026-08-31");
  });
});
