import {
  createNetworkError,
  GitHubApiError,
  parseGitHubResponseError,
} from "@/lib/github/errors";

// E2E ではローカルのモックサーバーへ向ける。開発・本番では GitHub 本体。
const GITHUB_API_BASE =
  process.env.GITHUB_API_BASE ?? "https://api.github.com";

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // トークンは任意。未設定なら Authorization を付けずに送り、未認証のレート制限で動く。
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
