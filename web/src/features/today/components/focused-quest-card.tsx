"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  PencilLine,
  Sparkles,
} from "lucide-react";

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
  assignmentId?: string;
  status?: "available" | "started" | "completed" | "missed";
  startAction?: (formData: FormData) => void | Promise<void>;
  completeAction?: (formData: FormData) => void | Promise<void>;
};

export function FocusedQuestCard({
  quest,
  assignmentId = "",
  status = "available",
  startAction,
  completeAction,
}: FocusedQuestCardProps) {
  const isCompleted = status === "completed";
  const isStarted = status === "started";

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

      {isStarted ? (
        <form action={completeAction} className="quest-card__form">
          <input type="hidden" name="assignmentId" value={assignmentId} />
          <label htmlFor="evidence-note" className="quest-form__label">
            {quest.evidenceLabel}
          </label>
          <textarea
            id="evidence-note"
            name="evidenceNote"
            required
            minLength={3}
            rows={3}
            placeholder="Tulis singkat dan jujur. Nggak perlu sempurna."
            className="quest-form__textarea"
          />
          <div className="quest-form__actions">
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-xl bg-accent px-5 text-base font-bold text-accent-foreground shadow-[0_10px_24px_rgba(112,49,31,0.2)] hover:bg-accent/90 sm:w-auto"
            >
              Selesaikan quest +{quest.rewardXp} XP
            </Button>
            <span className="quest-reward">Satu jawaban cukup buat hari ini</span>
          </div>
        </form>
      ) : isCompleted ? (
        <div className="quest-card__complete" role="status">
          <span className="quest-complete__icon" aria-hidden="true">
            <Sparkles size={20} strokeWidth={1.8} />
          </span>
          <span>
            <strong>Quest selesai</strong>
            <small>+{quest.rewardXp} XP masuk. Hari ini lo sudah hadir.</small>
          </span>
        </div>
      ) : (
        <form action={startAction} className="quest-card__footer">
          <input type="hidden" name="assignmentId" value={assignmentId} />
          <Button
            type="submit"
            size="lg"
            disabled={status === "missed"}
            aria-describedby="quest-description"
            className="h-12 w-full justify-between rounded-xl bg-accent px-5 text-base font-bold text-accent-foreground shadow-[0_10px_24px_rgba(112,49,31,0.2)] hover:bg-accent/90 sm:w-auto sm:min-w-56"
          >
            {status === "missed"
              ? "Quest sudah lewat"
              : `Mulai quest ${quest.durationMinutes} menit`}
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Button>
          <span className="quest-reward">+{quest.rewardXp} XP setelah selesai</span>
        </form>
      )}
    </article>
  );
}
