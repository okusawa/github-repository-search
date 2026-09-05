import { describe, expect, it } from "vitest";

import { MAX_PAGE } from "@/lib/constants";
import { buildSearchPath, parseReturnPath, parseSearchParams } from "@/lib/search-params";

describe("parseSearchParams", () => {
  it("falls back invalid page to 1 and caps oversized page to MAX_PAGE", () => {
    expect(parseSearchParams({ page: "abc" }).page).toBe(1);
    expect(parseSearchParams({ page: "99999" }).page).toBe(MAX_PAGE);
  });
});

describe("buildSearchPath", () => {
  it("builds a home path with omitted defaults", () => {
    expect(buildSearchPath({ q: "next.js", page: 1, sort: "best-match" })).toBe(
      "/?q=next.js",
    );
    expect(buildSearchPath({ q: "next.js", page: 2, sort: "stars" })).toBe(
      "/?q=next.js&page=2&sort=stars",
    );
  });
});

describe("parseReturnPath", () => {
  it("returns home for missing or unsafe values", () => {
    expect(parseReturnPath(undefined)).toBe("/");
    expect(parseReturnPath("//evil.example")).toBe("/");
    expect(parseReturnPath("/repositories/foo/bar")).toBe("/");
  });

  it("accepts home and search URLs", () => {
    expect(parseReturnPath("/")).toBe("/");
    expect(parseReturnPath("/?q=next.js&page=2")).toBe("/?q=next.js&page=2");
    expect(parseReturnPath(encodeURIComponent("/?q=next.js&page=2"))).toBe(
      "/?q=next.js&page=2",
    );
  });
});
