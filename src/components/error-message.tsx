import { RetryButton } from "@/components/retry-button";
import { formatResetIn } from "@/lib/format";
import { GitHubApiError } from "@/lib/github/errors";

type ErrorMessageProps = {
  error: GitHubApiError;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
  let message = error.message;

  if (error.kind === "rate_limit" && error.resetAt) {
    message = `Rate limit reached. Please try again ${formatResetIn(error.resetAt)}.`;
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
      aria-live="polite"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900"
    >
      <h2 className="font-semibold">Search failed</h2>
      <p className="mt-1">{message}</p>
      <RetryButton />
    </section>
  );
}
