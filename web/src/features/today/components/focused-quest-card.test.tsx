import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FocusedQuestCard } from "./focused-quest-card";
import { dayOneQuest } from "../fixtures/day-one";

describe("FocusedQuestCard", () => {
  it("keeps the first daily action specific and visible", () => {
    render(<FocusedQuestCard quest={dayOneQuest} />);

    expect(
      screen.getByRole("heading", { name: "Kenapa sekarang?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("15 menit")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mulai quest 15 menit/i }),
    ).toBeVisible();
    expect(screen.getByText("+20 XP setelah selesai")).toBeInTheDocument();
  });
});
