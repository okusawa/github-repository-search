import { cacheLife } from "next/cache";

import { githubFetchSafe } from "@/lib/github/client";
import { isGitHubApiError } from "@/lib/github/errors";
import { searchIssuesResponseSchema } from "@/lib/github/schema";

export async function getOpenIssueCount(
  owner: string,
  repo: string,
): Promise<number | null> {
  "use cache";
  cacheLife("minutes");

  const params = new URLSearchParams({
    q: `repo:${owner}/${repo} type:issue state:open`,
    per_page: "1",
  });

  const response = await githubFetchSafe(`/search/issues?${params.toString()}`);

  if (isGitHubApiError(response)) {
    return null;
  }

  const data: unknown = await response.json();

  return searchIssuesResponseSchema.parse(data).total_count;
}
