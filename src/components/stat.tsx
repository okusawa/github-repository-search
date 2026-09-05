import { formatNumber } from "@/lib/format";

type StatProps = {
  label: string;
  value: string;
};

export function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <p className="text-sm font-medium text-zinc-600">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

export function FormattedStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return <Stat label={label} value={formatNumber(value)} />;
}
