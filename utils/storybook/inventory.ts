import fs from "fs";
import path from "path";
import { STORYBOOK_CONFIG } from "./config";
import { StoryEntry } from "./discovery";

const LAST_RUN_PATH = path.join(__dirname, "storybook-last-run.json");

interface LastRunData {
  timestamp: string;
  storyIds: string[];
  skippedIds?: string[];
}

export function writeInventory(
  stories: StoryEntry[],
  skippedIds: string[] = [],
): void {
  if (stories.length === 0) return;

  const timestamp = new Date().toISOString();
  const currentIds = stories.map((s) => s.id);
  const skippedSet = new Set(skippedIds);
  const skippedStories = stories.filter((s) => skippedSet.has(s.id));

  let newStories: StoryEntry[] = [];
  let removedIds: string[] = [];
  let newlySkippedIds: string[] = [];
  let recoveredIds: string[] = [];

  if (fs.existsSync(LAST_RUN_PATH)) {
    const lastRun: LastRunData = JSON.parse(
      fs.readFileSync(LAST_RUN_PATH, "utf-8"),
    );
    const previousIds = new Set(lastRun.storyIds);
    const currentIdSet = new Set(currentIds);
    const previousSkipped = new Set(lastRun.skippedIds ?? []);

    newStories = stories.filter((s) => !previousIds.has(s.id));
    removedIds = lastRun.storyIds.filter((id) => !currentIdSet.has(id));
    newlySkippedIds = skippedIds.filter((id) => !previousSkipped.has(id));
    recoveredIds = [...previousSkipped].filter(
      (id) => !skippedSet.has(id) && currentIdSet.has(id),
    );
  }

  const grouped = new Map<string, StoryEntry[]>();
  for (const story of stories) {
    const existing = grouped.get(story.title) ?? [];
    existing.push(story);
    grouped.set(story.title, existing);
  }

  const lines: string[] = [
    `# Storybook Snapshot Inventory`,
    ``,
    `> Auto-generated on ${timestamp}`,
    `>`,
    `> **${stories.length}** stories across **${grouped.size}** topics`,
    `>`,
    `> **${skippedIds.length}** skipped during last run`,
    ``,
    `---`,
    ``,
  ];

  const hasChanges =
  newStories.length > 0 ||
  removedIds.length > 0 ||
  newlySkippedIds.length > 0 ||
  recoveredIds.length > 0;

if (hasChanges) {
  lines.push(`## Changes`);
  lines.push(``);

    if (newStories.length > 0) {
      lines.push(`### 🆕 New (${newStories.length})`);
      lines.push(``);
      for (const s of newStories) {
        lines.push(`- \`${s.id}\` — ${s.title} / ${s.name}`);
      }
      lines.push(``);
    }

    if (removedIds.length > 0) {
      lines.push(`### 🗑️ Removed (${removedIds.length})`);
      lines.push(``);
      for (const id of removedIds) {
        lines.push(`- \`${id}\``);
      }
      lines.push(``);
    }

    if (newlySkippedIds.length > 0) {
      lines.push(`### ⚠️ Newly Skipped (${newlySkippedIds.length})`);
      lines.push(``);
      for (const id of newlySkippedIds) {
        lines.push(`- \`${id}\``);
      }
      lines.push(``);
    }

    if (recoveredIds.length > 0) {
      lines.push(`### ✅ Recovered (${recoveredIds.length})`);
      lines.push(``);
      for (const id of recoveredIds) {
        lines.push(`- \`${id}\``);
      }
      lines.push(``);
    }
  } else {
    lines.push(`> ✅ No changes since last run`);
    lines.push(``);
  }

  lines.push(`---`);
  lines.push(``);

  for (const [title, componentStories] of grouped) {
    lines.push(`## ${title}`);
    lines.push(``);
    lines.push(`| Story | ID |`);
    lines.push(`|-------|----|`);
    for (const s of componentStories) {
        const status = skippedSet.has(s.id) ? "⚠️ Skipped" : "✅";
        lines.push(`| ${s.name} | \`${s.id}\` | ${status} |`);
      }
    lines.push(``);
  }

  fs.writeFileSync(STORYBOOK_CONFIG.inventoryPath, lines.join("\n"), "utf-8");
  console.log(`📋 Inventory written to ${STORYBOOK_CONFIG.inventoryPath}`);

  const lastRunData: LastRunData = {
    timestamp,
    storyIds: currentIds,
    skippedIds,
  };
  fs.writeFileSync(
    LAST_RUN_PATH,
    JSON.stringify(lastRunData, null, 2),
    "utf-8",
  );
  console.log(`💾 Last run data saved to ${LAST_RUN_PATH}`);
}
