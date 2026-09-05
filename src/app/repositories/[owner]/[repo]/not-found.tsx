import { Suspense } from "react";

import { BackToSearchLink } from "@/components/back-to-search-link";

export default function RepositoryNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-10">
      <h1 className="text-xl font-semibold text-zinc-900">Repository not found</h1>
      <p className="text-sm text-zinc-600">
        The repository you are looking for does not exist or is not accessible.
      </p>
      <Suspense fallback={null}>
        <BackToSearchLink className="w-fit text-sm font-medium text-zinc-900 underline hover:no-underline" />
      </Suspense>
    </div>
  );
}
