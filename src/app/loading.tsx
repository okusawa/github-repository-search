export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="h-8 w-64 animate-pulse rounded bg-zinc-200" />
      <div className="h-24 animate-pulse rounded-lg bg-zinc-100" />
      <p className="text-sm text-zinc-600" aria-live="polite">
        Loading...
      </p>
    </div>
  );
}
