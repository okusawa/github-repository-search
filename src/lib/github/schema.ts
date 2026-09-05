import { z } from "zod";

// GitHub のリポジトリオブジェクトは 100 以上のフィールドを持つ。
// 画面で使うフィールドだけを定義し、残りは検証せずに捨てる。
const repositoryOwnerSchema = z.object({
  login: z.string(),
  avatar_url: z.url(),
});

export const searchRepositoryItemSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  owner: repositoryOwnerSchema,
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  updated_at: z.string(),
});

export const searchRepositoriesResponseSchema = z.object({
  total_count: z.number(),
  items: z.array(searchRepositoryItemSchema),
});

export type SearchRepositoryItem = z.infer<typeof searchRepositoryItemSchema>;
export type SearchRepositoriesResponse = z.infer<
  typeof searchRepositoriesResponseSchema
>;

export const repositoryDetailSchema = z.object({
  full_name: z.string(),
  name: z.string(),
  owner: repositoryOwnerSchema,
  description: z.string().nullable(),
  html_url: z.url(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  // watchers / watchers_count / stargazers_count は 3 つとも Star 数を指す
  // （2012 年に Watch と Star が分離されたときの後方互換）。
  // 真の Watcher 数は subscribers_count だけで、search/repositories の
  // レスポンスには含まれず GET /repos/{owner}/{repo} にしか存在しない。
  // https://docs.github.com/en/rest/activity/starring
  subscribers_count: z.number(),
  forks_count: z.number(),
});

export const searchIssuesResponseSchema = z.object({
  total_count: z.number(),
});

export type RepositoryDetail = z.infer<typeof repositoryDetailSchema>;
