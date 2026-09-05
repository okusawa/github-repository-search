import { FormattedStat, Stat } from "@/components/stat";
import { getOpenIssueCount } from "@/lib/github/get-open-issue-count";

type IssueCountProps = {
  owner: string;
  repo: string;
};

async function fetchIssueCount(
  owner: string,
  repo: string,
): Promise<number | null> {
  return getOpenIssueCount(owner, repo);
}

export async function IssueCount({ owner, repo }: IssueCountProps) {
  const count = await fetchIssueCount(owner, repo);

  if (count === null) {
    return <Stat label="Issues" value="Could not retrieve" />;
  }

  return <FormattedStat label="Issues" value={count} />;
}
