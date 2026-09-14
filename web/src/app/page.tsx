import Link from "next/link";
import { ArrowUpRight, BookOpenText, Leaf } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { completeQuest, startQuest } from "@/features/today/actions";
import { CompletionPanel } from "@/features/today/components/completion-panel";
import { FocusedQuestCard } from "@/features/today/components/focused-quest-card";
import { ProgressSummary } from "@/features/today/components/progress-summary";
import { getTodayDashboard } from "@/features/today/data/get-today-dashboard";

function ResearchFocusCard() {
  return (
    <section className="focus-note" aria-labelledby="research-focus-title">
      <div className="focus-note__icon" aria-hidden="true">
        <Leaf size={18} strokeWidth={1.8} />
      </div>
      <div>
        <p className="eyebrow">Arah riset v0.1</p>
        <h2 id="research-focus-title" className="mt-2 text-lg font-semibold">
          Passive design untuk rumah tropis
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Thermal comfort dan pengurangan ketergantungan pada pendinginan di
          landed house Jabodetabek.
        </p>
      </div>
    </section>
  );
}

export default async function Home() {
  const dashboard = await getTodayDashboard();

  if (dashboard.kind === "waiting") {
    return (
      <AppShell aside={<ResearchFocusCard />}>
        <section className="waiting-card">
          <p className="eyebrow">
            {dashboard.completed ? "Level selesai" : "Level berikutnya"}
          </p>
          <h1 className="page-title">
            {dashboard.completed
              ? "Semua quest di level ini sudah beres."
              : "Quest pertama segera dibuka."}
          </h1>
          <p className="page-lede">
            {dashboard.completed
              ? "Progress lo tetap aman. Sambil menunggu level berikutnya, semua jawaban lama masih bisa dibuka di Riwayat."
              : `Sprint lo mulai Senin, ${dashboard.startDate}. Kita jaga pintu masuknya tetap kecil: 15 menit saja.`}
          </p>
          {dashboard.completed ? (
            <Link href="/history" className="text-link mt-6">
              Buka Riwayat
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ) : null}
        </section>
      </AppShell>
    );
  }

  const { assignment, quest, streak, totalXp } = dashboard;
  const isCompleted = assignment.status === "completed";

  return (
    <AppShell
      aside={
        <div className="grid gap-4">
          <ProgressSummary
            day={quest.day}
            totalDays={quest.totalDays}
            streak={streak}
            totalXp={totalXp}
          />
          <ResearchFocusCard />
        </div>
      }
    >
      <section className="page-intro" aria-labelledby="today-title">
        <div>
          <p className="eyebrow text-primary">Today · {quest.dateLabel}</p>
          <h1 id="today-title" className="page-title">
            {isCompleted ? "Hari ini beres, Dio." : "Siap mulai, Dio?"}
          </h1>
          <p className="page-lede">
            {isCompleted
              ? "Nikmati win kecilnya. Besok kita lanjut satu langkah lagi."
              : "Hari ini nggak perlu beresin masa depan. Cukup hadir 15 menit."}
          </p>
        </div>
        <div className="sprint-chip">
          <span className="sprint-chip__dot" aria-hidden="true" />
          {quest.sprintLabel}
        </div>
      </section>

      <FocusedQuestCard
        quest={quest}
        assignmentId={assignment.id}
        status={assignment.status}
        startAction={startQuest}
        completeAction={completeQuest}
      />

      {isCompleted ? (
        <CompletionPanel
          rewardXp={quest.rewardXp}
          streak={streak}
          completedDay={quest.day}
          totalDays={quest.totalDays}
        />
      ) : (
        <section className="next-note" aria-labelledby="next-note-title">
          <BookOpenText size={20} strokeWidth={1.8} aria-hidden="true" />
          <div>
            <p id="next-note-title" className="font-semibold">
              Yang kita bangun hari ini
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Satu langkah kecil ini akan memperjelas research plan, strategi
              MEXT, atau fondasi IELTS lo.
            </p>
          </div>
          <ArrowUpRight
            className="ml-auto hidden text-muted-foreground sm:block"
            size={18}
            aria-hidden="true"
          />
        </section>
      )}
    </AppShell>
  );
}
