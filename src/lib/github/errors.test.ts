import { describe, expect, it } from "vitest";

import { GitHubApiError, throwForGitHubResponse } from "@/lib/github/errors";

function classifyResponse(
  status: number,
  headers: Record<string, string> = {},
): GitHubApiError["kind"] | null {
  const response = new Response(null, { status, headers });

  try {
    throwForGitHubResponse(response);
    return null;
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return error.kind;
    }

    throw error;
  }
}

describe("throwForGitHubResponse", () => {
  it("classifies 403 with x-ratelimit-remaining: 0 as rate_limit", () => {
    expect(
      classifyResponse(403, { "x-ratelimit-remaining": "0" }),
    ).toBe("rate_limit");
  });

  it("does not classify 403 with remaining quota as rate_limit", () => {
    expect(
      classifyResponse(403, { "x-ratelimit-remaining": "5" }),
    ).toBe("upstream");
  });
});
