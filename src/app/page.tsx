import { EmptyState } from "@/components/empty-state";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { parseSearchParams } from "@/lib/search-params";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const parsedSearchParams = parseSearchParams(await searchParams);
  const hasQuery = parsedSearchParams.q.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">
          GitHub Repository Search
        </h1>
        <p className="text-sm text-zinc-600">
          Search public repositories on GitHub.
        </p>
      </header>

      <SearchForm
        defaultQuery={parsedSearchParams.q}
        defaultSort={parsedSearchParams.sort}
      />

      {hasQuery ? (
        <SearchResults searchParams={parsedSearchParams} />
      ) : (
        <EmptyState variant="initial" />
      )}
    </div>
  );
}
