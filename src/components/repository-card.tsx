import Image from "next/image";
import Link from "next/link";

import { formatDate, formatNumber } from "@/lib/format";
import type { SearchRepositoryItem } from "@/lib/github/schema";

type RepositoryCardProps = {
  repository: SearchRepositoryItem;
  returnTo: string;
};

export function RepositoryCard({ repository, returnTo }: RepositoryCardProps) {
  const owner = repository.owner.login;
  const repo = repository.full_name.slice(owner.length + 1);
  const updatedAt = formatDate(repository.updated_at);
  const detailHref = `/repositories/${owner}/${repo}?from=${encodeURIComponent(returnTo)}`;

  return (
    <article className="relative rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50">
      <div className="flex items-start gap-3">
        <Image
          src={repository.owner.avatar_url}
          alt={`${repository.owner.login} avatar`}
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-zinc-900">
            <Link
              href={detailHref}
              className="after:absolute after:inset-0 after:rounded-lg after:content-[''] hover:underline"
            >
              {repository.full_name}
            </Link>
          </h2>

          {repository.description ? (
            <p className="mt-1 min-h-[3.75rem] line-clamp-3 text-sm leading-5 text-zinc-600">
              {repository.description}
            </p>
          ) : (
            <p className="mt-1 min-h-[3.75rem] text-sm leading-5 text-zinc-400">No description</p>
          )}

          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
            <div className="flex gap-1">
              <dt className="font-medium">Language</dt>
              <dd>{repository.language ?? "Unknown"}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-medium">Stars</dt>
              <dd>{formatNumber(repository.stargazers_count)}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-medium">Forks</dt>
              <dd>{formatNumber(repository.forks_count)}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-medium">Updated</dt>
              <dd>{updatedAt}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
