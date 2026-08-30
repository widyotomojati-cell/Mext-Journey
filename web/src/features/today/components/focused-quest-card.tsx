"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock3, PencilLine } from "lucide-react";

type Quest = {
  theme: string;
  title: string;
  description: string;
  durationMinutes: number;
  rewardXp: number;
  evidenceLabel: string;
};

type FocusedQuestCardProps = {
  quest: Quest;
};

export function FocusedQuestCard({ quest }: FocusedQuestCardProps) {
  return (
    <article className="quest-card" aria-labelledby="quest-title">
      <div className="quest-card__topline">
        <span className="quest-number">Main quest</span>
        <span className="quest-duration">
          <Clock3 size={16} strokeWidth={1.8} aria-hidden="true" />
          {quest.durationMinutes} menit
        </span>
      </div>

      <div className="quest-card__body">
        <p className="eyebrow text-primary-foreground/65">{quest.theme}</p>
        <h2 id="quest-title" className="quest-title">
          {quest.title}
        </h2>
        <p id="quest-description" className="quest-description">
          {quest.description}
        </p>

        <div className="quest-evidence">
          <PencilLine size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>
            <small>Evidence ringan</small>
            <strong>{quest.evidenceLabel}</strong>
          </span>
          <CheckCircle2
            className="ml-auto text-primary-foreground/45"
            size={19}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="quest-card__footer">
        <Button
          type="button"
          size="lg"
          aria-describedby="quest-description"
          className="h-12 w-full justify-between rounded-xl bg-accent px-5 text-base font-bold text-accent-foreground shadow-[0_10px_24px_rgba(112,49,31,0.2)] hover:bg-accent/90 sm:w-auto sm:min-w-56"
        >
          Mulai quest 15 menit
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Button>
        <span className="quest-reward">+{quest.rewardXp} XP setelah selesai</span>
      </div>
    </article>
  );
}
