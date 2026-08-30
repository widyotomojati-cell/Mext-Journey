const QUEST_DAY_CUTOFF_HOUR = 3;

type LocalDateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
};

function getLocalDateTime(now: Date, timeZone: string): LocalDateTime {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
  };
}

function toIsoDate({ year, month, day }: LocalDateTime): string {
  return [year, month, day]
    .map((value, index) =>
      index === 0 ? String(value) : String(value).padStart(2, "0"),
    )
    .join("-");
}

function previousIsoDate({ year, month, day }: LocalDateTime): string {
  const previousDay = new Date(Date.UTC(year, month - 1, day - 1));
  return previousDay.toISOString().slice(0, 10);
}

export function getEffectiveQuestDate(now: Date, timeZone: string): string {
  const localDateTime = getLocalDateTime(now, timeZone);

  if (localDateTime.hour < QUEST_DAY_CUTOFF_HOUR) {
    return previousIsoDate(localDateTime);
  }

  return toIsoDate(localDateTime);
}
