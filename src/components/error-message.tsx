import { RetryButton } from "@/components/retry-button";
import { formatResetIn } from "@/lib/format";
import type { GitHubApiErrorData } from "@/lib/github/errors";
import { GitHubApiError } from "@/lib/github/errors";

type ErrorMessageProps = {
  title: string;
  error: GitHubApiError | GitHubApiErrorData;
};

export function ErrorMessage({ title, error }: ErrorMessageProps) {
  let message = error.message;
  const { resetAt } = error;

  if (error.kind === "rate_limit" && resetAt) {
    const resetDate = typeof resetAt === "string" ? new Date(resetAt) : resetAt;
    message = `Rate limit reached. Please try again ${formatResetIn(resetDate)}.`;
  }

  if (error.kind === "invalid_query") {
    message = "The search query is invalid. Please adjust your keywords.";
  }

  if (error.kind === "upstream") {
    message = "A problem occurred on GitHub's side. Please try again.";
  }

  if (error.kind === "network") {
    message = "Could not connect to GitHub. Check your network and try again.";
  }

  return (
    <section
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900"
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-1">{message}</p>
      <RetryButton />
    </section>
  );
}
