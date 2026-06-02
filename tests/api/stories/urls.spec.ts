import { test, expect } from "@playwright/test";
import {
  fetchAllContent,
  filterByType,
  buildLocalizedUrls,
  ContentItem,
} from "../../../utils/api/content-api";

test.describe("Content URLs - canonical health", () => {
  let films: ContentItem[];
  let articles: ContentItem[];

  test.beforeAll(async ({ request }) => {
    const all = await fetchAllContent(request);
    films = filterByType(all, "film");
    articles = filterByType(all, "article");
    expect(films.length, "should have at least one film").toBeGreaterThan(0);
    expect(articles.length, "should have at least one article").toBeGreaterThan(
      0,
    );
  });

  test(
    "all film URLs respond 200 across supported locales",
    { tag: ["@api", "@films", "@content", "@regression"] },
    async ({ request }) => {
      await assertAllUrls200(request, films);
    },
  );

  test(
    "all article URLs respond 200 across supported locales",
    { tag: ["@api", "@articles", "@content", "@regression"] },
    async ({ request }) => {
      await assertAllUrls200(request, articles);
    },
  );
});

async function assertAllUrls200(
  request: import("@playwright/test").APIRequestContext,
  items: ContentItem[],
) {
  const failures: string[] = [];

  for (const item of items) {
    for (const url of buildLocalizedUrls(item)) {
      const res = await request.get(url, { maxRedirects: 0 });
      if (res.status() !== 200) {
        failures.push(`${url} → ${res.status()}`);
      }
    }
  }

  expect(
    failures,
    `Broken or redirecting URLs:\n${failures.join("\n")}`,
  ).toEqual([]);
}
