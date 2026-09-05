import { cacheLife } from "next/cache";

import { githubFetch } from "@/lib/github/client";
import { searchIssuesResponseSchema } from "@/lib/github/schema";

export async function getOpenIssueCount(owner: string, repo: string) {
  "use cache";
  cacheLife("minutes");

  const params = new URLSearchParams({
    q: `repo:${owner}/${repo} type:issue state:open`,
    per_page: "1",
  });

  const response = await githubFetch(`/search/issues?${params.toString()}`);
  const data: unknown = await response.json();

  return searchIssuesResponseSchema.parse(data).total_count;
}
