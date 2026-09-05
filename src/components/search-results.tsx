import { Suspense } from "react";

import { EmptyState } from "@/components/empty-state";
import { ErrorMessage } from "@/components/error-message";
import { Pagination } from "@/components/pagination";
import { RepositoryList } from "@/components/repository-list";
import { MAX_RESULTS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { isGitHubApiError } from "@/lib/github/errors";
import { searchRepositories } from "@/lib/github/search-repositories";
import type { ParsedSearchParams } from "@/lib/search-params";

type SearchResultsProps = {
  searchParams: ParsedSearchParams;
};

async function SearchResultsContent({ searchParams }: SearchResultsProps) {
  const outcome = await searchRepositories(
    searchParams.q,
    searchParams.page,
    searchParams.sort,
  );

  if (isGitHubApiError(outcome)) {
    return <ErrorMessage title="Search failed" error={outcome} />;
  }

  if (outcome.total_count === 0) {
    return <EmptyState variant="no-results" query={searchParams.q} />;
  }

  const isCapped = outcome.total_count > MAX_RESULTS;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-600">
        {formatNumber(outcome.total_count)} repositories found
        {isCapped ? (
          <span className="ml-1 text-zinc-500">
            (showing top {formatNumber(MAX_RESULTS)} results)
          </span>
        ) : null}
      </p>

      <RepositoryList repositories={outcome.items} />
      <Pagination searchParams={searchParams} totalCount={outcome.total_count} />
    </div>
  );
}

export function SearchResults(props: SearchResultsProps) {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-zinc-600" aria-live="polite">
          Loading results...
        </p>
      }
    >
      <SearchResultsContent {...props} />
    </Suspense>
  );
}
