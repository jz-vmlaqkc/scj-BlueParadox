import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";
import { fetchSitemapUrls } from "../../../../utils/api/sitemap";

test.skip("capture samples", async ({ request, baseURL }) => {
  mkdirSync("samples", { recursive: true });

  const all = await fetchSitemapUrls(request, baseURL!, "/sitemap.xml");

  const findFirst = (type: string) =>
    all.find(({ pathname }) => {
      const segs = pathname.split("/").filter(Boolean);
      return (
        (segs.length === 2 && segs[0] === type) ||
        (segs.length === 3 && segs[1] === type)
      );
    })?.pathname;

  const samples = {
    story: findFirst("stories"),
    film: findFirst("films"),
    exhibit: findFirst("exhibits"),
  };

  for (const [type, pathname] of Object.entries(samples)) {
    if (!pathname) {
      console.warn(`⚠️  No ${type} found in sitemap — skipping`);
      continue;
    }

    const res = await request.get(pathname);
    writeFileSync(
      `samples/${type}.json`,
      JSON.stringify(
        {
          url: pathname,
          status: res.status(),
          headers: res.headers(),
          body: await res.text(),
        },
        null,
        2,
      ),
    );
    console.log(`✅ Captured ${type}: ${pathname}`);
  }
});
