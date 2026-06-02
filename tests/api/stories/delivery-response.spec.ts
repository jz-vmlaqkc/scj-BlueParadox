import { test, expect } from "@playwright/test";

test.describe("Content API - delivery health", () => {
  test(
    "/api/stories responds with healthy JSON payload",
    { tag: ["@api", "@content", "@regression"] },
    async ({ request }) => {
      const res = await request.get("/api/stories");

      expect(res.status(), "status should be 200").toBe(200);
      expect(
        res.headers()["content-type"] ?? "",
        "content-type should be JSON",
      ).toContain("application/json");

      const body = await res.json();
      expect(Array.isArray(body), "body should be an array").toBe(true);
      expect(
        body.length,
        "should return at least one content item",
      ).toBeGreaterThan(0);

      // Every item should have a non-empty supportedLocales
      const localelessItems = body
        .filter(
          (i: { supportedLocales?: unknown[] }) => !i.supportedLocales?.length,
        )
        .map((i: { slug: string }) => i.slug);

      expect(
        localelessItems,
        `Items missing supportedLocales:\n${localelessItems.join("\n")}`,
      ).toEqual([]);
    },
  );
});
