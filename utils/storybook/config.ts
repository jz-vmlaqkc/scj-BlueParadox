import path from "path";
import { Page } from "@playwright/test";

const STORYBOOK_BASE = "https://docs-alpha-neon.vercel.app";

export const STORYBOOK_CONFIG = {
  indexUrl: `${STORYBOOK_BASE}/index.json`,
  iframeUrl: `${STORYBOOK_BASE}/iframe.html`,
  inventoryPath: path.join(__dirname, "storybook-inventory.md"),
  requiredTags: ["test"] as string[] | null,

  excludePatterns: [/--docs$/] as RegExp[],

  renderTimeout: 5000,
};


