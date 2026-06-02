/*Example:
test("Unknown story returns empty payload", async ({ request }) => {
    const res = await request.get("/api/stories/this-does-not-exist");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.items).toEqual([]); // or whatever "empty" looks like
    });
    */
//Add tag to simple UI 404 tests

import { test, expect } from "@playwright/test";
import { fetchSitemapUrls, SitemapEntry } from "../../../utils/api/sitemap";
import { filterByContentType } from "../../../utils/api/content-filters";

test.describe("Films - delivery health", () => {
  let films: SitemapEntry[];

  test.beforeAll(async ({ request, baseURL }) => {
    const all = await fetchSitemapUrls(request, baseURL!, "/sitemap.xml");
    films = filterByContentType(all, "films");
    expect(
      films.length,
      "films sitemap segment should not be empty",
    ).toBeGreaterThan(0);
  });

  test(
    "films - resolve to 200 (redirects to stories allowed)",
    { tag: ["@api", "@films", "@regression"] },
    async ({ request }) => {
      const failures: string[] = [];

      for (const { pathname } of films) {
        // First request, no redirect, to inspect behavior
        const first = await request.get(pathname, { maxRedirects: 0 });
        const status = first.status();

        if (status === 200) continue;

        // Allow redirect chain to resolve, then verify final 200
        if ([301, 302, 307, 308].includes(status)) {
          const followed = await request.get(pathname); // default follows redirects
          if (followed.status() !== 200) {
            failures.push(`${pathname} → redirected then ${followed.status()}`);
          }
          continue;
        }

        failures.push(`${pathname} → ${status}`);
      }

      expect(failures, `Broken film URLs:\n${failures.join("\n")}`).toEqual([]);
    },
  );
});
