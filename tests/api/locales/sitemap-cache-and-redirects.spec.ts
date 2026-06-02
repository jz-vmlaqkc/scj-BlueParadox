import { test, expect } from "@playwright/test";
import { fetchSitemapUrls, SitemapEntry } from "../../../utils/api/sitemap";
import { locales } from "../../../utils/locales";

for (const { code, prefix } of locales) {
  test.describe(`Locale: ${code} sitemap`, () => {
    let urls: SitemapEntry[];

    test.beforeAll(async ({ request, baseURL }) => {
      const sitemapPath = `${prefix}/sitemap.xml`;
      urls = await fetchSitemapUrls(request, baseURL!, sitemapPath);
      expect(
        urls.length,
        `${code} sitemap should not be empty`,
      ).toBeGreaterThan(0);
    });

    test(
      `${code} - all sitemap URLs respond 200 without redirecting`,
      { tag: ["@api", "@locales", "@regression"] },
      async ({ request }) => {
        const failures: string[] = [];

        for (const { pathname } of urls) {
          const res = await request.get(pathname, { maxRedirects: 0 });
          if (res.status() !== 200) {
            failures.push(`${pathname} → ${res.status()}`);
          }
        }

        expect(
          failures,
          `${code}: redirected or broken URLs:\n${failures.join("\n")}`,
        ).toEqual([]);
      },
    );

    test(
      `${code} - all sitemap URLs are CDN-cacheable`,
      { tag: ["@api", "@locales", "@regression"] },
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

        expect(
          failures,
          `${code}: non-cacheable URLs:\n${failures.join("\n")}`,
        ).toEqual([]);
      },
    );
  });
}
