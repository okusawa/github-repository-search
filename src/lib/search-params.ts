import { z } from "zod";

import { MAX_PAGE } from "@/lib/constants";

export const sortOptions = ["best-match", "stars", "updated"] as const;
export type SortOption = (typeof sortOptions)[number];

const searchParamsSchema = z.object({
  q: z.string().trim().max(256).catch(""),
  page: z.coerce
    .number()
    .int()
    .catch(1)
    .transform((value) => Math.min(Math.max(value, 1), MAX_PAGE)),
  sort: z.enum(sortOptions).catch("best-match"),
});

export type ParsedSearchParams = z.infer<typeof searchParamsSchema>;

function firstString(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value[0];
  }
  return undefined;
}

export function parseSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ParsedSearchParams {
  return searchParamsSchema.parse({
    q: firstString(raw.q) ?? "",
    page: firstString(raw.page),
    sort: firstString(raw.sort),
  });
}

export function buildSearchQuery(params: {
  q: string;
  page: number;
  sort: SortOption;
}): string {
  const search = new URLSearchParams({ q: params.q });

  if (params.page !== 1) {
    search.set("page", String(params.page));
  }

  if (params.sort !== "best-match") {
    search.set("sort", params.sort);
  }

  return search.toString();
}
