import { cacheLife } from "next/cache";

import { githubFetch } from "@/lib/github/client";
import { repositoryDetailSchema } from "@/lib/github/schema";

export async function getRepository(owner: string, repo: string) {
  "use cache";
  cacheLife("minutes");

  const response = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
  );
  const data: unknown = await response.json();

  return repositoryDetailSchema.parse(data);
}
