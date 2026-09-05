import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { isGitHubApiError } from "@/lib/github/errors";
import { searchRepositories } from "@/lib/github/search-repositories";
import { server } from "@/test/msw/server";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

describe("searchRepositories", () => {
  it("parses a successful response and returns required fields", async () => {
    const result = await searchRepositories("hello", 1, "best-match");

    if (isGitHubApiError(result)) {
      throw new Error(`expected a successful response, got ${result.kind}`);
    }

    expect(result.total_count).toBe(1);
    expect(result.items[0]).toMatchObject({
      full_name: "octocat/Hello-World",
      stargazers_count: 100,
      forks_count: 10,
    });
  });

  it("rejects an unexpected response shape", async () => {
    server.use(
      http.get("https://api.github.com/search/repositories", () => {
        return HttpResponse.json({ total_count: 1, items: [{ id: "bad" }] });
      }),
    );

    await expect(searchRepositories("hello", 1, "best-match")).rejects.toBeInstanceOf(
      ZodError,
    );
  });
});
