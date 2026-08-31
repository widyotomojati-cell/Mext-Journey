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

  it("reveals the lightweight evidence form after the quest starts", () => {
    render(
      <FocusedQuestCard
        quest={dayOneQuest}
        assignmentId="assignment-1"
        status="started"
      />,
    );

    expect(
      screen.getByRole("textbox", { name: /satu kalimat alasan utama/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /selesaikan quest \+20 xp/i }),
    ).toBeVisible();
  });

  it("celebrates a completed quest without offering another submission", () => {
    render(
      <FocusedQuestCard
        quest={dayOneQuest}
        assignmentId="assignment-1"
        status="completed"
      />,
    );

    expect(screen.getByText(/quest selesai/i)).toBeVisible();
    expect(screen.getByText(/\+20 xp masuk/i)).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
