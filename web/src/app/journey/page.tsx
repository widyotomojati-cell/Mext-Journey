import { AppShell } from "@/components/app-shell";
import { JourneyMap } from "@/features/journey/components/journey-map";
import { getJourneyOverview } from "@/features/journey/data/get-journey-overview";
import { ProgressSummary } from "@/features/today/components/progress-summary";
import { Map, Route } from "lucide-react";

export default async function JourneyPage() {
  const overview = await getJourneyOverview();

  return (
    <AppShell
      activeNav="journey"
      aside={
        <ProgressSummary
          day={overview.activeDay}
          totalDays={overview.totalDays}
          streak={overview.streak}
          totalXp={overview.totalXp}
        />
      }
    >
      <section className="page-intro" aria-labelledby="journey-title">
        <div>
          <p className="eyebrow text-primary">Foundation sprint · 14 hari</p>
          <h1 id="journey-title" className="page-title">
            Jalurnya kelihatan. Fokusnya tetap satu langkah.
          </h1>
          <p className="page-lede">
            Lihat posisi lo, intip quest berikutnya, lalu balik ke hari ini saat
            waktunya bergerak.
          </p>
        </div>
        <div className="sprint-chip">
          <Route size={15} strokeWidth={1.9} aria-hidden="true" />
          {overview.completedCount} selesai
        </div>
      </section>

      <div className="journey-map__legend" aria-label="Legenda journey map">
        <span><Map size={15} aria-hidden="true" /> Map perjalanan Dio</span>
        <small>Quest masa depan sengaja dikunci agar tetap ringan.</small>
      </div>

      <JourneyMap nodes={overview.nodes} />
    </AppShell>
  );
}
