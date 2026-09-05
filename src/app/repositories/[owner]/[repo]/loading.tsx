export default function RepositoryLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 animate-pulse rounded-full bg-zinc-200" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-8 w-64 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100"
          />
        ))}
      </div>
    </div>
  );
}
