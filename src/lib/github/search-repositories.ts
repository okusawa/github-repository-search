import { cacheLife } from "next/cache";

import { PER_PAGE } from "@/lib/constants";
import { githubFetchSafe } from "@/lib/github/client";
import {
  type GitHubApiErrorData,
  isGitHubApiError,
} from "@/lib/github/errors";
import { searchRepositoriesResponseSchema } from "@/lib/github/schema";
import type { SearchRepositoriesResponse } from "@/lib/github/schema";
import type { SortOption } from "@/lib/search-params";

export async function searchRepositories(
  q: string,
  page: number,
  sort: SortOption,
): Promise<SearchRepositoriesResponse | GitHubApiErrorData> {
  "use cache";
  cacheLife("minutes");

  const params = new URLSearchParams({
    q,
    page: String(page),
    per_page: String(PER_PAGE),
  });

  // best-match は GitHub 側の既定。sort と order を送ると明示指定になるため送らない。
  if (sort !== "best-match") {
    params.set("sort", sort);
    params.set("order", "desc");
  }

  const response = await githubFetchSafe(
    `/search/repositories?${params.toString()}`,
  );

  // 'use cache' の中で throw すると例外がキャッシュ境界でシリアライズされ、
  // 呼び出し側で種別を判定できずに `error.tsx` へ落ちる。エラーは値として返す。
  if (isGitHubApiError(response)) {
    return {
      kind: response.kind,
      message: response.message,
      ...(response.resetAt
        ? { resetAt: response.resetAt.toISOString() }
        : {}),
    };
  }

  const data: unknown = await response.json();

  return searchRepositoriesResponseSchema.parse(data);
}
