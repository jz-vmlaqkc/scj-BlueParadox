import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";

//ENV=stage npx playwright test --project=api --grep "inspect content APIs"

test.skip("inspect content APIs", async ({ request }) => {
  mkdirSync("samples", { recursive: true });

  const endpoints = ["/api/stories", "/api/films", "/api/exhibits"];

  for (const endpoint of endpoints) {
    const res = await request.get(endpoint);
    const contentType = res.headers()["content-type"] ?? "";
    const status = res.status();

    console.log(`\n${endpoint}`);
    console.log(`  status: ${status}`);
    console.log(`  content-type: ${contentType}`);

    let body: unknown;
    try {
      body = await res.json();
      console.log(`  ✅ Valid JSON`);
    } catch {
      body = await res.text();
      console.log(`  ⚠️  Not JSON, got text`);
    }

    const filename = endpoint.replace(/\//g, "_").replace(/^_/, "");
    writeFileSync(
      `samples/${filename}.json`,
      JSON.stringify({ endpoint, status, contentType, body }, null, 2),
    );
  }
});
