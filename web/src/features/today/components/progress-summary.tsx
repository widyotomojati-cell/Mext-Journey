import { Progress } from "@/components/ui/progress";
import { Flame, Sparkles } from "lucide-react";

type ProgressSummaryProps = {
  day: number;
  totalDays: number;
  streak?: number;
  totalXp?: number;
};

export function ProgressSummary({
  day,
  totalDays,
  streak = 0,
  totalXp = 0,
}: ProgressSummaryProps) {
  const progressValue = Math.round((day / totalDays) * 100);

  return (
    <section className="progress-card" aria-labelledby="journey-progress-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Habit sprint</p>
          <h2 id="journey-progress-title" className="mt-2 text-xl font-semibold">
            Day {String(day).padStart(2, "0")} / {totalDays}
          </h2>
        </div>
        <span className="stamp-preview" aria-label="Foundation stamp locked">
          F
        </span>
      </div>

      <Progress
        value={progressValue}
        aria-label={`${progressValue}% perjalanan sprint`}
        className="mt-5"
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="metric-tile">
          <Flame size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>
            <strong>{streak} hari</strong>
            <small>streak</small>
          </span>
        </div>
        <div className="metric-tile">
          <Sparkles size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>
            <strong>{totalXp} XP</strong>
            <small>terkumpul</small>
          </span>
        </div>
      </div>

      <p className="mt-5 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">
        Selesaikan 5 dari 6 quest minggu ini untuk membuka weekly badge pertama.
      </p>
    </section>
  );
}
