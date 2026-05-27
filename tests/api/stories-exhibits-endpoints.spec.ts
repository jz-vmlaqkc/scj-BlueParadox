// tests/api/sitemap/locale-content-health.spec.ts
import { test, expect } from "@playwright/test";
import { fetchSitemapUrls } from "../../utils/sitemap";

test(
  "Stories and GB content from sitemap are reachable",
  { tag: ["@api", "@sitemap", "@regression"] },
  async ({ request, baseURL }) => {
    const entries = await fetchSitemapUrls(request, baseURL!);
    expect(entries.length, "Sitemap should not be empty").toBeGreaterThan(0);

    const stories = entries.filter((e) => e.pathname.includes("/stories/"));
    const exhibits = entries.filter((e) => e.pathname.startsWith("/exhibits/"));
    const films = entries.filter((e) => e.pathname.startsWith("/films/"));

    expect(stories.length, "No stories found in sitemap").toBeGreaterThan(0);
    expect(exhibits.length, "No GB content found in sitemap").toBeGreaterThan(
      0,
    );
    expect(films.length, "No stories found in sitemap").toBeGreaterThan(0);

    await test.step("All stories return 200", async () => {
      for (const entry of stories) {
        const res = await request.get(entry.pathname);
        await expect(res, `${entry.pathname} failed`).toBeOK();
      }
    });

    await test.step("All films return 200", async () => {
      for (const entry of exhibits) {
        const res = await request.get(entry.pathname);
        await expect(res, `${entry.pathname} failed`).toBeOK();
      }
    });

    await test.step("All exhibits content return 200", async () => {
      for (const entry of exhibits) {
        const res = await request.get(entry.pathname);
        await expect(res, `${entry.pathname} failed`).toBeOK();
      }
    });

    await test.step("Stories return 404 for unknown story", async () => {
      const res = await request.get("/stories/giveMe404");
      expect(res.status()).toBe(404);
    });

    await test.step("Exhibits returns 404 for unknown exhibit", async () => {
      const res = await request.get("/exhibits/whereThat404Tho");
      expect(res.status()).toBe(404);
    });

    await test.step("Films returns 404 for unknown exhibit", async () => {
      const res = await request.get("/films/whatUp404");
      expect(res.status()).toBe(404);
    });
  },
);
