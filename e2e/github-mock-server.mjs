import { createServer } from "node:http";
import { URL } from "node:url";

const port = Number(process.env.GITHUB_MOCK_PORT ?? 9999);

const repositorySearchResponse = {
  total_count: 1,
  items: [
    {
      id: 1,
      full_name: "vercel/next.js",
      owner: {
        login: "vercel",
        avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4",
      },
      description: "The React Framework",
      language: "JavaScript",
      stargazers_count: 142097,
      forks_count: 31871,
      updated_at: "2024-01-01T00:00:00Z",
    },
  ],
};

const repositoryDetailResponse = {
  full_name: "vercel/next.js",
  name: "next.js",
  owner: {
    login: "vercel",
    avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4",
  },
  description: "The React Framework",
  html_url: "https://github.com/vercel/next.js",
  language: "JavaScript",
  stargazers_count: 142097,
  subscribers_count: 1647,
  forks_count: 31871,
};

const issueSearchResponse = {
  total_count: 995,
};

createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  const path = url.pathname;

  if (path === "/search/repositories") {
    const query = url.searchParams.get("q") ?? "";

    if (query === "__rate_limit__") {
      response.writeHead(403, {
        "content-type": "application/json",
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": String(Math.floor(Date.now() / 1000) + 600),
      });
      response.end(JSON.stringify({ message: "API rate limit exceeded" }));
      return;
    }

    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(repositorySearchResponse));
    return;
  }

  if (path === "/repos/vercel/next.js") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(repositoryDetailResponse));
    return;
  }

  if (path === "/search/issues") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(issueSearchResponse));
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ message: "Not Found" }));
}).listen(port, "127.0.0.1", () => {
  console.log(`GitHub mock server listening on http://127.0.0.1:${port}`);
});
