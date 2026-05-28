import { test, expect } from "@playwright/test";
import { fetchSitemapUrls, SitemapEntry } from "../../../utils/sitemap";

let urls: SitemapEntry[];

test.beforeAll(async ({ request, baseURL }) => {
  urls = await fetchSitemapUrls(request, baseURL!);
  expect(urls.length, "Sitemap should not be empty").toBeGreaterThan(0);
});

test(
  "All sitemap URLs are CDN-cacheable",
  { tag: ["@api", "@sitemap", "@cache"] },
  async ({ request }) => {
    const failures: string[] = [];

    for (const { pathname } of urls) {
      const res = await request.get(pathname);
      const cacheControl = res.headers()["cache-control"] ?? "";

      if (
        cacheControl.includes("no-store") ||
        !cacheControl.includes("max-age=")
      ) {
        failures.push(`${pathname} → "${cacheControl}"`);
      }
    }

    expect(failures, `Non-cacheable URLs:\n${failures.join("\n")}`).toEqual([]);
  },
);
