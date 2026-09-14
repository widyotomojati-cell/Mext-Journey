import Link from "next/link";
import { ArrowLeft, BookOpenText, Clock3, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { HistoryList } from "@/features/history/components/history-list";
import { getHistory } from "@/features/history/data/get-history";

export default async function HistoryPage() {
  const history = await getHistory();
  const completed = history.filter((item) => item.status === "completed");
  const totalMinutes = completed.reduce(
    (total, item) => total + item.durationMinutes,
    0,
  );
  const totalXp = completed.reduce((total, item) => total + item.xp, 0);

  return (
    <AppShell
      activeNav="progress"
      aside={
        <section className="progress-card">
          <BookOpenText size={21} className="text-primary" aria-hidden="true" />
          <p className="eyebrow mt-4">Jejak yang tersimpan</p>
          <h2 className="mt-2 text-xl font-semibold">
            {completed.length} quest selesai
          </h2>
          <div className="history-aside__metrics">
            <span>
              <Clock3 size={15} aria-hidden="true" />
              {totalMinutes} menit fokus
            </span>
            <span>
              <Sparkles size={15} aria-hidden="true" />
              {totalXp} XP tercatat
            </span>
          </div>
          <Link href="/progress" className="text-link mt-5">
            <ArrowLeft size={15} aria-hidden="true" />
            Kembali ke Progress
          </Link>
        </section>
      }
    >
      <section className="page-intro" aria-labelledby="history-title">
        <div>
          <p className="eyebrow text-primary">Riwayat perjalanan</p>
          <h1 id="history-title" className="page-title">
            Semua langkah yang sudah lo kerjakan.
          </h1>
          <p className="page-lede">
            Cari ulang jawaban, ide riset, paper, dan keputusan kecil dari
            seluruh level MEXT Journey.
          </p>
        </div>
      </section>

      <HistoryList items={history} />
    </AppShell>
  );
}
