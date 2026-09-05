"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent } from "react";

import {
  buildSearchQuery,
  sortOptions,
  type SortOption,
} from "@/lib/search-params";

type SearchFormProps = {
  defaultQuery: string;
  defaultSort: SortOption;
};

function parseSort(value: string): SortOption {
  return sortOptions.find((option) => option === value) ?? "best-match";
}

export function SearchForm({ defaultQuery, defaultSort }: SearchFormProps) {
  const router = useRouter();

  function navigateToSearch(form: HTMLFormElement, sort: SortOption) {
    const formData = new FormData(form);
    const query = String(formData.get("q") ?? "").trim();
    if (!query) {
      return;
    }

    router.push(`/?${buildSearchQuery({ q: query, page: 1, sort })}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    navigateToSearch(
      form,
      parseSort(String(new FormData(form).get("sort") ?? "best-match")),
    );
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    navigateToSearch(event.currentTarget.form!, parseSort(event.target.value));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      aria-label="Search repositories"
    >
      <div className="flex flex-1 flex-col gap-1">
        <label htmlFor="search-query" className="text-sm font-medium">
          Search query
        </label>
        <input
          id="search-query"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="e.g. next.js"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1 sm:w-40">
        <label htmlFor="search-sort" className="text-sm font-medium">
          Sort by
        </label>
        <select
          id="search-sort"
          name="sort"
          defaultValue={defaultSort}
          onChange={handleSortChange}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option === "best-match"
                ? "Best match"
                : option === "stars"
                  ? "Stars"
                  : "Recently updated"}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        Search
      </button>
    </form>
  );
}
