import { cacheLife } from "next/cache";

import { PER_PAGE } from "@/lib/constants";
import { githubFetch } from "@/lib/github/client";
import { searchRepositoriesResponseSchema } from "@/lib/github/schema";
import type { SortOption } from "@/lib/search-params";

export async function searchRepositories(
  q: string,
  page: number,
  sort: SortOption,
) {
  "use cache";
  cacheLife("minutes");

  const params = new URLSearchParams({
    q,
    page: String(page),
    per_page: String(PER_PAGE),
  });

  if (sort !== "best-match") {
    params.set("sort", sort);
    params.set("order", "desc");
  }

  const response = await githubFetch(
    `/search/repositories?${params.toString()}`,
  );
  const data: unknown = await response.json();

  return searchRepositoriesResponseSchema.parse(data);
}
