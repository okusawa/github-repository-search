export type GitHubErrorKind =
  | "rate_limit"
  | "not_found"
  | "invalid_query"
  | "upstream"
  | "network";

export class GitHubApiError extends Error {
  readonly kind: GitHubErrorKind;
  readonly resetAt?: Date;

  constructor(kind: GitHubErrorKind, message: string, resetAt?: Date) {
    super(message);
    this.name = "GitHubApiError";
    this.kind = kind;
    this.resetAt = resetAt;
  }
}

function parseResetAt(response: Response): Date | undefined {
  const reset = response.headers.get("x-ratelimit-reset");
  if (!reset) {
    return undefined;
  }

  const seconds = Number.parseInt(reset, 10);
  if (Number.isNaN(seconds)) {
    return undefined;
  }

  return new Date(seconds * 1000);
}

function isRateLimited(response: Response): boolean {
  if (response.status !== 403 && response.status !== 429) {
    return false;
  }

  return response.headers.get("x-ratelimit-remaining") === "0";
}

export function throwForGitHubResponse(response: Response): void {
  if (response.ok) {
    return;
  }

  const resetAt = parseResetAt(response);

  if (isRateLimited(response)) {
    throw new GitHubApiError("rate_limit", "Rate limit reached.", resetAt);
  }

  if (response.status === 404) {
    throw new GitHubApiError("not_found", "Resource not found.");
  }

  if (response.status === 422) {
    throw new GitHubApiError("invalid_query", "Invalid search query.");
  }

  if (response.status >= 500) {
    throw new GitHubApiError(
      "upstream",
      "A problem occurred on GitHub's side.",
    );
  }

  throw new GitHubApiError("upstream", "Request failed.");
}

export function createNetworkError(): GitHubApiError {
  return new GitHubApiError("network", "Could not connect to GitHub.");
}

export function isGitHubApiError(error: unknown): error is GitHubApiError {
  if (error instanceof GitHubApiError) {
    return true;
  }

  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "GitHubApiError" &&
    "kind" in error &&
    typeof error.kind === "string"
  );
}

export function isNotFoundError(error: unknown): boolean {
  return (
    (isGitHubApiError(error) && error.kind === "not_found") ||
    (error instanceof Error && error.message === "Resource not found.")
  );
}
