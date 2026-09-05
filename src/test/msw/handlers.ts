import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.github.com/search/repositories", () => {
    return HttpResponse.json({
      total_count: 1,
      items: [
        {
          id: 1,
          full_name: "octocat/Hello-World",
          owner: {
            login: "octocat",
            avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
          },
          description: "My first repository on GitHub!",
          language: "TypeScript",
          stargazers_count: 100,
          forks_count: 10,
          updated_at: "2024-01-01T00:00:00Z",
        },
      ],
    });
  }),
];
