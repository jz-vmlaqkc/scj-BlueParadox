import { test, expect } from "@playwright/test";
import { paths } from "../../../utils/paths";

for (const [key, { path }] of Object.entries(paths)) {
  test.describe(`Core page: ${key}`, () => {
    test(
      `GET ${path} does not redirect`,
      { tag: ["@api", "@core-pages", "@redirects", "@regression"] },
      async ({ request }) => {
        const res = await request.get(path, { maxRedirects: 0 });
        expect(res.status()).toBe(200);
      },
    );

    test(
      `GET ${path} returns cache-control header`,
      { tag: ["@api", "@core-pages", "@cache", "@regression"] },
      async ({ request }) => {
        const res = await request.get(path);
        const cacheControl = res.headers()["cache-control"] ?? "";

        expect(cacheControl).toBeDefined();
        //expect(cacheControl).toContain("max-age=");
        expect(cacheControl).not.toContain("no-store");
        expect(cacheControl).not.toContain("no-cache");
        expect(cacheControl).toContain("public");
        expect(cacheControl).not.toContain("private");
      },
    );
  });
}
