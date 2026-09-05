type EmptyStateVariant = "initial" | "no-results";

type EmptyStateProps = {
  variant: EmptyStateVariant;
  query?: string;
};

export function EmptyState({ variant, query }: EmptyStateProps) {
  if (variant === "initial") {
    return (
      <section
        aria-label="Getting started"
        className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center"
      >
        <h2 className="text-lg font-semibold text-zinc-900">
          Search GitHub repositories
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Enter a keyword above to find public repositories on GitHub.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="No results"
      className="rounded-lg border border-zinc-200 bg-white px-6 py-10 text-center"
    >
      <h2 className="text-lg font-semibold text-zinc-900">No repositories found</h2>
      <p className="mt-2 text-sm text-zinc-600">
        No results for &quot;{query}&quot;. Try a different keyword.
      </p>
    </section>
  );
}
