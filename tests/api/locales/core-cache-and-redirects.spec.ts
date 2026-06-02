import { test, expect } from "@playwright/test";
import { paths } from "../../../utils/paths";
import { locales } from "../../../utils/locales";

for (const { code, prefix } of locales) {
  test.describe(`Locale: ${code}`, () => {
    for (const [key, { path }] of Object.entries(paths)) {
      const fullPath = `${prefix}${path}`;

      test(
        `${fullPath} (${key}) does not redirect and is cacheable`,
        { tag: ["@api", "@locales", "@sanity"] },
        async ({ request }) => {
          const res = await request.get(fullPath, { maxRedirects: 0 });
          expect(res.status(), `${fullPath} should return 200`).toBe(200);

          const cacheControl = res.headers()["cache-control"] ?? "";
          expect(cacheControl, `${fullPath} cache-control`).toContain(
            "max-age=",
          );
          expect(cacheControl, `${fullPath} cache-control`).not.toContain(
            "no-store",
          );
        },
      );
    }
  });
}
