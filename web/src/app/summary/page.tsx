import { BookOpenText, CheckCircle2, Clock3, Sparkles, Target } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getWeeklySummaries } from "@/features/summary/data/get-weekly-summaries";

export default async function SummaryPage() {
  const summaries = await getWeeklySummaries();
  const latest = summaries[0];

  return (
    <AppShell
      activeNav="summary"
      aside={
        <section className="progress-card">
          <p className="eyebrow">Cumulative journey</p>
          <h2 className="mt-2 text-xl font-semibold">
            {latest ? `${latest.cumulative.completedCount} quest terkumpul` : "Belum ada review"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Summary ini tumbuh setiap minggu dari quest yang benar-benar Dio selesaikan.
          </p>
        </section>
      }
    >
      <section className="page-intro" aria-labelledby="summary-title">
        <div>
          <p className="eyebrow text-primary">Weekly reflection</p>
          <h1 id="summary-title" className="page-title">Jejak habit yang mulai membentuk arah.</h1>
          <p className="page-lede">
            Bukan sekadar checklist. Di sini Dio bisa melihat apa yang sudah dibangun minggu ini dan total persiapan yang sudah terkumpul.
          </p>
        </div>
      </section>

      {summaries.length ? (
        <section className="weekly-summary-list" aria-label="Ringkasan per minggu">
          {summaries.map((summary, index) => (
            <article key={summary.key} className="weekly-summary-card">
              <header className="weekly-summary-card__header">
                <div>
                  <p className="eyebrow">Minggu {summaries.length - index} · {summary.label}</p>
                  <h2>{summary.completedCount} quest jadi bukti hadir</h2>
                </div>
                <span className="weekly-summary-card__badge">
                  <Sparkles size={15} aria-hidden="true" /> +{summary.xp} XP
                </span>
              </header>

              <div className="weekly-summary-card__metrics">
                <span><CheckCircle2 size={16} aria-hidden="true" /><strong>{summary.completedCount}</strong> quest selesai</span>
                <span><Clock3 size={16} aria-hidden="true" /><strong>{summary.minutes}</strong> menit fokus</span>
                <span><Target size={16} aria-hidden="true" /><strong>{summary.themes.length}</strong> area disentuh</span>
              </div>

              <div className="weekly-summary-card__section">
                <p className="eyebrow">Yang lo bangun</p>
                <div className="weekly-summary-card__themes">
                  {summary.themes.map((theme) => <span key={theme}>{theme}</span>)}
                </div>
              </div>

              <div className="weekly-summary-card__section">
                <p className="eyebrow">Highlight quest</p>
                <ul className="weekly-summary-card__highlights">
                  {summary.highlights.map((item) => (
                    <li key={item.id}>
                      <BookOpenText size={15} aria-hidden="true" />
                      <span><strong>{item.title}</strong>{item.evidence?.value ? <small>{item.evidence.value}</small> : null}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <footer className="weekly-summary-card__cumulative">
                <span>Akumulasi sampai minggu ini</span>
                <strong>{summary.cumulative.completedCount} quest · {summary.cumulative.minutes} menit · {summary.cumulative.xp} XP</strong>
              </footer>
            </article>
          ))}
        </section>
      ) : (
        <section className="waiting-card">
          <p className="eyebrow">Weekly reflection</p>
          <h1 className="page-title">Summary pertama menunggu jejak pertama.</h1>
          <p className="page-lede">Selesaikan satu quest, lalu tab ini mulai membangun rangkumannya secara otomatis.</p>
        </section>
      )}
    </AppShell>
  );
}
