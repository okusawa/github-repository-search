import { cacheLife } from "next/cache";

import { githubFetchSafe } from "@/lib/github/client";
import { isGitHubApiError } from "@/lib/github/errors";
import { searchIssuesResponseSchema } from "@/lib/github/schema";

// open_issues_count を使わないのは、あの値が Pull Request を含むため。
// github.com の Issues タブの数字に合わせるには search/issues で type:issue を絞る。
export async function getOpenIssueCount(
  owner: string,
  repo: string,
): Promise<number | null> {
  "use cache";
  cacheLife("minutes");

  // 修飾子の区切りはスペース。ここに '+' を書くと URLSearchParams が %2B に
  // エンコードし、GitHub がリポジトリ名の一部と解釈して 422 を返す。
  // owner / repo も encodeURIComponent しない（repo: 修飾子は生の owner/name を期待する）。
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
