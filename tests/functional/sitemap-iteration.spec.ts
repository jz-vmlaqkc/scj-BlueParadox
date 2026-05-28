import { test, expect, request as apiRequest } from "@playwright/test";
import { fetchSitemapUrls } from "../../utils/sitemap";

test(
  "All sitemap URLs respond with 200",
  { tag: ["@api", "@sitemap", "@regression"] },
  async ({ request, baseURL }) => {
    const entries = await fetchSitemapUrls(request, baseURL!);
    expect(entries.length, "Sitemap should not be empty").toBeGreaterThan(0);

    for (const entry of entries) {
      await test.step(`GET ${entry.pathname}`, async () => {
        const response = await request.get(entry.pathname);
        await expect(response, `${entry.pathname} failed`).toBeOK();
      });
    }
  },
);
