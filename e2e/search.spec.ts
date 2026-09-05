import { expect, test } from "@playwright/test";

test("search flow shows list and repository detail stats", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Search query").fill("next.js");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByRole("link", { name: "vercel/next.js" })).toBeVisible();

  await page.getByRole("link", { name: "vercel/next.js" }).click();
  await page.waitForURL("**/repositories/vercel/next.js");

  const detail = page.getByRole("article");
  await expect(detail.getByRole("heading", { name: "vercel/next.js" })).toBeVisible();
  await expect(detail.getByText("JavaScript")).toBeVisible();
  await expect(detail.getByText("142,097")).toBeVisible();
  await expect(detail.getByText("1,647")).toBeVisible();
  await expect(detail.getByText("31,871")).toBeVisible();
  await expect(detail.getByText("995")).toBeVisible();
});

test("shows rate limit message when GitHub search API returns 403", async ({
  page,
}) => {
  await page.goto("/?q=__rate_limit__");

  await expect(page.locator("section[role='alert']")).toContainText(
    "Rate limit reached",
  );
});
