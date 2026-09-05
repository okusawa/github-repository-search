import Link from "next/link";

import { MAX_PAGE, PER_PAGE } from "@/lib/constants";
import {
  buildSearchQuery,
  type ParsedSearchParams,
} from "@/lib/search-params";

type PaginationProps = {
  searchParams: ParsedSearchParams;
  totalCount: number;
};

function getTotalPages(totalCount: number): number {
  const calculatedPages = Math.ceil(totalCount / PER_PAGE);
  return Math.min(calculatedPages, MAX_PAGE);
}

export function Pagination({ searchParams, totalCount }: PaginationProps) {
  const totalPages = getTotalPages(totalCount);

  if (totalPages <= 1) {
    return null;
  }

  const previousPage = searchParams.page - 1;
  const nextPage = searchParams.page + 1;
  const canGoPrevious = searchParams.page > 1;
  const canGoNext = searchParams.page < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-4"
    >
      {canGoPrevious ? (
        <Link
          href={`/?${buildSearchQuery({ ...searchParams, page: previousPage })}`}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-400"
        >
          Previous
        </span>
      )}

      <p className="text-sm text-zinc-600">
        Page {searchParams.page} of {totalPages}
      </p>

      {canGoNext ? (
        <Link
          href={`/?${buildSearchQuery({ ...searchParams, page: nextPage })}`}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          Next
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-400"
        >
          Next
        </span>
      )}
    </nav>
  );
}
