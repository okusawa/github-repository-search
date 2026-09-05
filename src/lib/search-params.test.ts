import { describe, expect, it } from "vitest";

import { MAX_PAGE } from "@/lib/constants";
import { parseSearchParams } from "@/lib/search-params";

describe("parseSearchParams", () => {
  it("falls back invalid page to 1 and caps oversized page to MAX_PAGE", () => {
    expect(parseSearchParams({ page: "abc" }).page).toBe(1);
    expect(parseSearchParams({ page: "99999" }).page).toBe(MAX_PAGE);
  });
});
