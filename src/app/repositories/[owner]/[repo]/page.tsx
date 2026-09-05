import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FormattedStat, Stat } from "@/components/stat";
import { IssueCount } from "@/components/issue-count";
import { getRepository } from "@/lib/github/get-repository";
import { isNotFoundError } from "@/lib/github/errors";

type RepositoryPageProps = {
  params: Promise<{ owner: string; repo: string }>;
};

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const { owner, repo } = await params;

  try {
    const repository = await getRepository(owner, repo);

    return {
      title: `${repository.full_name} | GitHub Repository Search`,
      description: repository.description ?? undefined,
    };
  } catch (error) {
    if (isNotFoundError(error)) {
      return { title: "Repository not found" };
    }

    return { title: `${owner}/${repo} | GitHub Repository Search` };
  }
}

export default async function RepositoryPage({ params }: RepositoryPageProps) {
  const { owner, repo } = await params;

  let repository;

  try {
    repository = await getRepository(owner, repo);
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }

    throw error;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back to search
        </Link>
      </nav>

      <article className="flex flex-col gap-6">
        <header className="flex items-start gap-4">
          <Image
            src={repository.owner.avatar_url}
            alt={`${repository.owner.login} avatar`}
            width={64}
            height={64}
            className="rounded-full"
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-zinc-900">
              {repository.full_name}
            </h1>

            {repository.description ? (
              <p className="mt-2 text-sm text-zinc-600">{repository.description}</p>
            ) : (
              <p className="mt-2 text-sm text-zinc-400">No description</p>
            )}

            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-zinc-900 underline hover:no-underline"
            >
              View on GitHub
            </a>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat
            label="Language"
            value={repository.language ?? "Unknown"}
          />
          <FormattedStat label="Stars" value={repository.stargazers_count} />
          <FormattedStat label="Watchers" value={repository.subscribers_count} />
          <FormattedStat label="Forks" value={repository.forks_count} />
          <Suspense fallback={<Stat label="Issues" value="…" />}>
            <IssueCount owner={owner} repo={repo} />
          </Suspense>
        </div>
      </article>
    </div>
  );
}
