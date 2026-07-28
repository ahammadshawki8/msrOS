#!/usr/bin/env node
/**
 * msrOS SessionStart hook.
 *
 * Prints only the block between the `msr:digest` markers in docs/STATE.md, so a
 * resumed session gets ~6 lines of orientation instead of the whole file. The
 * sections below the markers load only when a skill actually reads them.
 *
 * Contract: this script must NEVER fail loudly. Any error, missing file, or
 * malformed input results in silence and exit 0. A broken hook must not block
 * session start.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const START = "<!-- msr:digest:start -->";
const END = "<!-- msr:digest:end -->";
const MAX_LINES = 20;

function main() {
  const statePath = join(process.cwd(), "docs", "STATE.md");

  let raw;
  try {
    raw = readFileSync(statePath, "utf8");
  } catch {
    // No STATE.md — this project isn't managed by msrOS yet. Say nothing;
    // /msr-session-start will offer /msr-init.
    return;
  }

  const startIdx = raw.indexOf(START);
  const endIdx = raw.indexOf(END);

  // Markers absent or inverted. /msr-handoff repairs them on its next run.
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return;

  const digest = raw
    .slice(startIdx + START.length, endIdx)
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)
    .slice(0, MAX_LINES)
    .join("\n");

  if (!digest) return;

  process.stdout.write(
    `msrOS project state (digest from docs/STATE.md):\n\n${digest}\n\n` +
      `Run /msr-session-start for full state and a proposed next task.\n`
  );
}

try {
  main();
} catch {
  // Deliberately silent. See contract above.
}
process.exit(0);
