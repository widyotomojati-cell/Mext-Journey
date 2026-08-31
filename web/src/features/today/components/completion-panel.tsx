import Link from "next/link";
import { ArrowRight, BarChart3, Map, Sparkles, Trophy } from "lucide-react";

type CompletionPanelProps = {
  rewardXp: number;
  streak: number;
  completedDay: number;
  totalDays: number;
};

export function CompletionPanel({
  rewardXp,
  streak,
  completedDay,
  totalDays,
}: CompletionPanelProps) {
  const nextDay = Math.min(completedDay + 1, totalDays);

  return (
    <section className="completion-panel" aria-labelledby="completion-title">
      <span className="completion-panel__trophy" aria-hidden="true">
        <Trophy size={27} strokeWidth={1.8} />
      </span>
      <div className="completion-panel__copy">
        <p className="eyebrow text-primary">Daily win unlocked</p>
        <h2 id="completion-title">Hari ini sudah cukup.</h2>
        <p>
          Lo hadir, menyimpan satu bukti, dan menjaga perjalanan ini tetap
          bergerak. Nggak perlu menambah beban baru malam ini.
        </p>
      </div>

      <div className="completion-panel__metrics" aria-label="Reward hari ini">
        <span>
          <Sparkles size={17} aria-hidden="true" />
          <strong>+{rewardXp} XP</strong>
          <small>reward</small>
        </span>
        <span>
          <strong>{streak} hari</strong>
          <small>streak aktif</small>
        </span>
        <span>
          <strong>{completedDay}/{totalDays}</strong>
          <small>sprint</small>
        </span>
      </div>

      <div className="completion-panel__actions">
        <Link href="/journey" className="completion-cta completion-cta--primary">
          <Map size={17} aria-hidden="true" />
          Lihat Journey Map
          <ArrowRight className="ml-auto" size={17} aria-hidden="true" />
        </Link>
        <Link href="/progress" className="completion-cta">
          <BarChart3 size={17} aria-hidden="true" />
          Buka progress
        </Link>
      </div>

      {completedDay < totalDays ? (
        <p className="completion-panel__preview">
          Preview: Day {String(nextDay).padStart(2, "0")} sudah terlihat di map,
          tapi baru perlu dikerjakan pada waktunya.
        </p>
      ) : null}
    </section>
  );
}
