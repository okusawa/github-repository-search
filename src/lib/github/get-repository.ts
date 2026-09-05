import { cacheLife } from "next/cache";

import { githubFetchSafe } from "@/lib/github/client";
import {
  type GitHubApiErrorData,
  isGitHubApiError,
} from "@/lib/github/errors";
import { repositoryDetailSchema } from "@/lib/github/schema";
import type { RepositoryDetail } from "@/lib/github/schema";

export async function getRepository(
  owner: string,
  repo: string,
): Promise<RepositoryDetail | GitHubApiErrorData> {
  "use cache";
  cacheLife("minutes");

  const response = await githubFetchSafe(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
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

  return repositoryDetailSchema.parse(data);
}
