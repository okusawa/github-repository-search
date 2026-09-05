import { z } from "zod";

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
  subscribers_count: z.number(),
  forks_count: z.number(),
});

export const searchIssuesResponseSchema = z.object({
  total_count: z.number(),
});

export type RepositoryDetail = z.infer<typeof repositoryDetailSchema>;
