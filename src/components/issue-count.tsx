import { FormattedStat, Stat } from "@/components/stat";
import { getOpenIssueCount } from "@/lib/github/get-open-issue-count";

type IssueCountProps = {
  owner: string;
  repo: string;
};

// Issue 数は Search API の別枠（未認証 10 req/min）を使うため最初に枯れやすい。
// ここが失敗しても詳細ページの他の項目は残したいので、例外は握って null に倒す。
async function fetchIssueCount(
  owner: string,
  repo: string,
): Promise<number | null> {
  try {
    return await getOpenIssueCount(owner, repo);
  } catch {
    return null;
  }
}

export async function IssueCount({ owner, repo }: IssueCountProps) {
  const count = await fetchIssueCount(owner, repo);

  if (count === null) {
    return <Stat label="Issues" value="Could not retrieve" />;
  }

  return <FormattedStat label="Issues" value={count} />;
}
