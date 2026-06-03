// tests/api/sitemap/locale-content-health.spec.ts
import { test, expect } from "@playwright/test";
import { fetchSitemapUrls } from "../../utils/api/sitemap";

test(
  "FR and GB content from sitemap are reachable",
  { tag: ["@api", "@sitemap", "@regression", "@locales"] },
  async ({ request, baseURL, page }) => {
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
      await page.goto("/fr/stories/giveMe404");

      await expect(
        page.getByRole("heading", { level: 1, name: "Page introuvable" }),
      ).toBeVisible();
      await expect(page.getByRole("img", { name: "Not Found" })).toBeVisible();
      const homeLink = page.getByLabel("Retour à la page d'accueil");
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute("href", "/fr");
    });

    await test.step("GB returns 404 for unknown exhibit", async () => {
      await page.goto("/gb/exhibits/letMeSeeThat404");
      await expect(
        page.getByRole("heading", { level: 1, name: "Page Not Found" }),
      ).toBeVisible();
      await expect(page.getByRole("img", { name: "Not Found" })).toBeVisible();
      const homeLink = page.getByLabel("Back to Homepage");
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute("href", "/gb");
    });
  },
);
