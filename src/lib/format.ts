export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatResetIn(date: Date, now: Date = new Date()): string {
  const minutes = Math.max(
    1,
    Math.ceil((date.getTime() - now.getTime()) / 60_000),
  );

  return new Intl.RelativeTimeFormat("en-US", { numeric: "auto" }).format(
    minutes,
    "minute",
  );
}
