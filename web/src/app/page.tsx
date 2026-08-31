import { AppShell } from "@/components/app-shell";
import { completeQuest, startQuest } from "@/features/today/actions";
import { FocusedQuestCard } from "@/features/today/components/focused-quest-card";
import { ProgressSummary } from "@/features/today/components/progress-summary";
import { getTodayDashboard } from "@/features/today/data/get-today-dashboard";
import { ArrowUpRight, BookOpenText, Leaf } from "lucide-react";

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
          <p className="eyebrow">Foundation sprint</p>
          <h1 className="page-title">Quest pertama segera dibuka.</h1>
          <p className="page-lede">
            Sprint lo mulai Senin, {dashboard.startDate}. Kita jaga pintu
            masuknya tetap kecil: 15 menit saja.
          </p>
        </section>
      </AppShell>
    );
  }

  const { assignment, quest, streak, totalXp } = dashboard;

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
            Siap mulai, Dio?
          </h1>
          <p className="page-lede">
            Hari ini nggak perlu beresin masa depan. Cukup hadir 15 menit.
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

      <section className="next-note" aria-labelledby="next-note-title">
        <BookOpenText size={20} strokeWidth={1.8} aria-hidden="true" />
        <div>
          <p id="next-note-title" className="font-semibold">
            Yang kita bangun hari ini
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Satu kalimat ini akan jadi fondasi cerita aplikasi dan research plan
            lo nanti.
          </p>
        </div>
        <ArrowUpRight
          className="ml-auto hidden text-muted-foreground sm:block"
          size={18}
          aria-hidden="true"
        />
      </section>
    </AppShell>
  );
}
