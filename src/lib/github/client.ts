import {
  createNetworkError,
  GitHubApiError,
  parseGitHubResponseError,
  throwForGitHubResponse,
} from "@/lib/github/errors";

const GITHUB_API_BASE =
  process.env.GITHUB_API_BASE ?? "https://api.github.com";

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function githubFetchSafe(
  path: string,
): Promise<Response | GitHubApiError> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: buildHeaders(),
    });

    const error = parseGitHubResponseError(response);
    if (error) {
      return error;
    }

    return response;
  } catch {
    return createNetworkError();
  }
}

export async function githubFetch(path: string): Promise<Response> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: buildHeaders(),
    });

    throwForGitHubResponse(response);
    return response;
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw error;
    }

    throw createNetworkError();
  }
}
