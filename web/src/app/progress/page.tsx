import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  Clock3,
  Flame,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getJourneyOverview } from "@/features/journey/data/get-journey-overview";
import { Progress } from "@/components/ui/progress";

export default async function ProgressPage() {
  const overview = await getJourneyOverview();

  return (
    <AppShell
      activeNav="progress"
      aside={
        <section className="progress-card">
          <p className="eyebrow">Next checkpoint</p>
          <h2 className="mt-2 text-xl font-semibold">
            {overview.nextQuest
              ? `Day ${String(overview.nextQuest.dayNumber).padStart(2, "0")}`
              : "Sprint selesai"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {overview.nextQuest?.title ??
              "Semua fondasi sprint pertama sudah lo tuntaskan."}
          </p>
          <Link href="/journey" className="text-link mt-5">
            Buka Journey Map <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      }
    >
      <section className="page-intro" aria-labelledby="progress-title">
        <div>
          <p className="eyebrow text-primary">Progress, bukan tekanan</p>
          <h1 id="progress-title" className="page-title">
            Bukti kecil yang mulai terkumpul.
          </h1>
          <p className="page-lede">
            Angka di sini bukan nilai diri lo. Ini cuma jejak bahwa lo terus
            muncul untuk tujuan yang penting.
          </p>
        </div>
      </section>

      <section className="progress-hero" aria-label="Ringkasan progress">
        <div className="progress-hero__metric">
          <Sparkles size={20} aria-hidden="true" />
          <strong>{overview.totalXp}</strong>
          <span>Total XP</span>
        </div>
        <div className="progress-hero__metric">
          <Flame size={20} aria-hidden="true" />
          <strong>{overview.streak}</strong>
          <span>Hari streak</span>
        </div>
        <div className="progress-hero__metric">
          <Clock3 size={20} aria-hidden="true" />
          <strong>{overview.completedMinutes}</strong>
          <span>Menit fokus</span>
        </div>
      </section>

      <section className="progress-detail">
        <div className="progress-detail__header">
          <div>
            <p className="eyebrow">Foundation sprint</p>
            <h2>{overview.completedCount} dari {overview.totalDays} quest</h2>
          </div>
          <strong>{overview.completionPercent}%</strong>
        </div>
        <Progress
          value={overview.completionPercent}
          aria-label={`${overview.completionPercent}% sprint selesai`}
          className="mt-5"
        />
        <div className="activity-grid" aria-label="Aktivitas 14 hari">
          {overview.nodes.map((node) => (
            <span
              key={node.id}
              className={`activity-cell activity-cell--${node.state}`}
              title={`Day ${node.dayNumber}: ${node.title}`}
            >
              {node.state === "completed" ? (
                <Check size={15} aria-hidden="true" />
              ) : (
                node.dayNumber
              )}
            </span>
          ))}
        </div>
      </section>

      <section
        className={
          overview.weeklyBadgeUnlocked
            ? "badge-card badge-card--unlocked"
            : "badge-card"
        }
      >
        <span className="badge-card__icon" aria-hidden="true">
          {overview.weeklyBadgeUnlocked ? (
            <Award size={24} strokeWidth={1.8} />
          ) : (
            <LockKeyhole size={21} strokeWidth={1.8} />
          )}
        </span>
        <div>
          <p className="eyebrow">Weekly badge</p>
          <h2>
            {overview.weeklyBadgeUnlocked
              ? "Foundation Week terbuka"
              : "Foundation Week masih dikunci"}
          </h2>
          <p>
            {overview.weeklyCompleted}/5 quest utama minggu pertama selesai.
            Review hari Minggu tetap opsional.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
