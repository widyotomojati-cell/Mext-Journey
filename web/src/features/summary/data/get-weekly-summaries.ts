import { getHistory, type HistoryItem } from "@/features/history/data/get-history";

type CompletedItem = HistoryItem & { completedAt: string };

export type WeeklySummary = {
  key: string;
  label: string;
  completedCount: number;
  minutes: number;
  xp: number;
  themes: string[];
  highlights: CompletedItem[];
  mentorItems: CompletedItem[];
  cumulative: { completedCount: number; minutes: number; xp: number; weeks: number };
};

function mondayKey(value: string) {
  const date = new Date(value);
  const jakarta = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const offset = (jakarta.getDay() + 6) % 7;
  jakarta.setDate(jakarta.getDate() - offset);
  return jakarta.toISOString().slice(0, 10);
}

function formatWeek(key: string) {
  const start = new Date(`${key}T12:00:00+07:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const formatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

export async function getWeeklySummaries(): Promise<WeeklySummary[]> {
  const history = await getHistory();
  const completed = history
    .filter((item): item is CompletedItem => item.status === "completed" && Boolean(item.completedAt))
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

  const byWeek = new Map<string, CompletedItem[]>();
  for (const item of completed) {
    const key = mondayKey(item.completedAt);
    byWeek.set(key, [...(byWeek.get(key) ?? []), item]);
  }

  let runningCount = 0;
  let runningMinutes = 0;
  let runningXp = 0;
  const summaries: WeeklySummary[] = [];

  for (const [key, items] of [...byWeek.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const completedCount = items.length;
    const minutes = items.reduce((total, item) => total + item.durationMinutes, 0);
    const xp = items.reduce((total, item) => total + item.xp, 0);
    runningCount += completedCount;
    runningMinutes += minutes;
    runningXp += xp;

    summaries.push({
      key,
      label: formatWeek(key),
      completedCount,
      minutes,
      xp,
      themes: [...new Set(items.map((item) => item.theme))].slice(0, 4),
      highlights: items.slice(-4).reverse(),
      mentorItems: items,
      cumulative: {
        completedCount: runningCount,
        minutes: runningMinutes,
        xp: runningXp,
        weeks: summaries.length + 1,
      },
    });
  }

  return summaries.reverse();
}
