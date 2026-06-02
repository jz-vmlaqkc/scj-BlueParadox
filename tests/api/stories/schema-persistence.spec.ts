import { test, expect } from "@playwright/test";
import { fetchAllContent } from "../../../utils/api/content-api";
import { ContentItemSchema } from "../../../utils/api/schema/content.schema";

test.describe("Content API - schema persistence", () => {
  test(
    "every content item conforms to ContentItemSchema",
    { tag: ["@api", "@content", "@schema", "@regression"] },
    async ({ request }) => {
      const items = await fetchAllContent(request);
      const failures: string[] = [];

      for (const item of items) {
        const result = ContentItemSchema.safeParse(item);
        if (!result.success) {
          const issues = result.error.issues
            .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
            .join("\n");
          failures.push(`[${item.slug ?? "unknown"}]\n${issues}`);
        }
      }

      expect(
        failures,
        `Schema drift detected:\n\n${failures.join("\n\n")}`,
      ).toEqual([]);
    },
  );
});
