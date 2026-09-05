export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

// 絶対時刻は Server Component ではサーバーのタイムゾーンで描画されるため、
// UTC のサーバーだと日本のユーザーに意味が伝わらない。相対表記にして依存を断つ。
// now を引数にしているのはテストで固定するため。
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

// Server Component で描画するため、タイムゾーンを固定しないと
// サーバーの設定で表示日が前後する。UTC に固定して環境依存を断つ。
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
