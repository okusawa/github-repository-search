import { defineConfig, devices } from "@playwright/test";

const mockApiBase = "http://127.0.0.1:9999";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node e2e/github-mock-server.mjs",
      url: `${mockApiBase}/search/repositories?q=health`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `GITHUB_API_BASE=${mockApiBase} sh -c "npm run build && cp -r .next/static .next/standalone/.next/static && PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js"`,
      url: "http://127.0.0.1:3100",
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
