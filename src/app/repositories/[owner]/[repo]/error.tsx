"use client";

type RepositoryErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RepositoryErrorPage({ reset }: RepositoryErrorPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-10">
      <h1 className="text-xl font-semibold text-zinc-900">
        Something went wrong
      </h1>
      <p className="text-sm text-zinc-600">
        An unexpected error occurred while loading this repository.
      </p>
      <button
        type="button"
        onClick={reset}
        className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
