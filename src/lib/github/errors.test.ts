import { describe, expect, it } from "vitest";

import { parseGitHubResponseError } from "@/lib/github/errors";

function classify(status: number, headers: Record<string, string> = {}) {
  return parseGitHubResponseError(new Response(null, { status, headers }))?.kind ?? null;
}

describe("parseGitHubResponseError", () => {
  it("classifies 403 with x-ratelimit-remaining: 0 as rate_limit", () => {
    expect(classify(403, { "x-ratelimit-remaining": "0" })).toBe("rate_limit");
  });

  it("does not classify 403 with remaining quota as rate_limit", () => {
    expect(classify(403, { "x-ratelimit-remaining": "5" })).toBe("upstream");
  });
});
