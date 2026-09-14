"use client";

import {
  CheckCircle2,
  CircleX,
  Clock3,
  ExternalLink,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { HistoryItem } from "@/features/history/data/get-history";

type HistoryFilter = "all" | "completed" | "recovery" | "missed";

const filters: { value: HistoryFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "completed", label: "Selesai" },
  { value: "recovery", label: "Recovery" },
  { value: "missed", label: "Terlewat" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${value}T12:00:00+07:00`));
}

function matchesFilter(item: HistoryItem, filter: HistoryFilter) {
  if (filter === "all") return true;
  if (filter === "recovery") return item.questType === "recovery";
  return item.status === filter;
}

function isWebUrl(value: string) {
  return value.startsWith("https://") || value.startsWith("http://");
}

export function HistoryList({ items }: { items: HistoryItem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");

    return items.filter((item) => {
      if (!matchesFilter(item, filter)) return false;
      if (!normalizedQuery) return true;

      return [
        item.title,
        item.theme,
        item.packTitle,
        item.evidence?.value ?? "",
      ].some((value) =>
        value.toLocaleLowerCase("id-ID").includes(normalizedQuery),
      );
    });
  }, [filter, items, query]);

  return (
    <section aria-labelledby="history-list-title">
      <div className="history-toolbar">
        <label className="history-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Cari riwayat</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari quest atau jawaban..."
          />
        </label>

        <div className="history-filters" aria-label="Filter riwayat">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                filter === item.value
                  ? "history-filter history-filter--active"
                  : "history-filter"
              }
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="history-list">
        <h2 id="history-list-title" className="sr-only">
          Daftar quest terdahulu
        </h2>

        {visibleItems.length ? (
          visibleItems.map((item) => (
            <article
              key={item.id}
              className={`history-item history-item--${item.status}`}
            >
              <header className="history-item__header">
                <span className="history-item__icon" aria-hidden="true">
                  {item.status === "completed" ? (
                    item.questType === "recovery" ? (
                      <RotateCcw size={20} />
                    ) : (
                      <CheckCircle2 size={21} />
                    )
                  ) : (
                    <CircleX size={20} />
                  )}
                </span>
                <div className="history-item__heading">
                  <p className="eyebrow">
                    {item.packTitle} · {formatDate(item.assignmentDate)}
                  </p>
                  <h3>{item.title}</h3>
                </div>
                <span className="history-status">
                  {item.status === "completed" ? "Selesai" : "Terlewat"}
                </span>
              </header>

              <div className="history-item__meta">
                <span>{item.theme}</span>
                <span>
                  <Clock3 size={14} aria-hidden="true" />
                  {item.durationMinutes} menit
                </span>
                {item.status === "completed" ? (
                  <span>
                    <Sparkles size={14} aria-hidden="true" />+{item.xp} XP
                  </span>
                ) : null}
              </div>

              {item.evidence?.value ? (
                <div className="history-evidence">
                  <p className="eyebrow">Jawaban Dio</p>
                  {item.evidence.mode === "url" &&
                  isWebUrl(item.evidence.value) ? (
                    <a
                      href={item.evidence.value}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.evidence.value}
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <p>{item.evidence.value}</p>
                  )}
                </div>
              ) : (
                <p className="history-no-evidence">
                  {item.status === "missed"
                    ? "Quest ini terlewat tanpa evidence."
                    : "Evidence tidak tersedia."}
                </p>
              )}
            </article>
          ))
        ) : (
          <div className="history-empty">
            <Search size={24} aria-hidden="true" />
            <h3>Belum ada yang cocok.</h3>
            <p>Coba kata lain atau pilih filter Semua.</p>
          </div>
        )}
      </div>
    </section>
  );
}
