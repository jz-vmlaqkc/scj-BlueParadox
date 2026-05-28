// tests/api/sitemap/locale-content-health.spec.ts
import { test, expect } from "@playwright/test";
import { fetchSitemapUrls } from "../../utils/sitemap";

test(
  "FR and GB content from sitemap are reachable",
  { tag: ["@api", "@sitemap", "@regression"] },
  async ({ request, baseURL }) => {
    const entries = await fetchSitemapUrls(request, baseURL!);
    expect(entries.length, "Sitemap should not be empty").toBeGreaterThan(0);

    const frContent = entries.filter((e) => e.pathname.includes("/fr/"));
    const gbContent = entries.filter((e) => e.pathname.startsWith("/gb/"));

    expect(frContent.length, "No stories found in sitemap").toBeGreaterThan(0);
    expect(gbContent.length, "No GB content found in sitemap").toBeGreaterThan(
      0,
    );

    await test.step("All FR content returns 200", async () => {
      for (const entry of frContent) {
        const res = await request.get(entry.pathname);
        await expect(res, `${entry.pathname} failed`).toBeOK();
      }
    });

    await test.step("All GB content returns 200", async () => {
      for (const entry of gbContent) {
        const res = await request.get(entry.pathname);
        await expect(res, `${entry.pathname} failed`).toBeOK();
      }
    });

    await test.step("FR returns 404 for unknown story", async () => {
      const res = await request.get("/fr/stories/giveMe404");
      expect(res.status()).toBe(404);
    });

    await test.step("GB returns 404 for unknown exhibit", async () => {
      const res = await request.get("/gb/exhibits/letMeSeeThat404");
      expect(res.status()).toBe(404);
    });
  }
);
