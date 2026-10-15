#!/usr/bin/env node
/**
 * Export the design tokens declared in `src/app/globals.css` (`@theme`) to a
 * machine-readable `tokens.json` (DTCG-style).
 *
 * `globals.css` is the SINGLE SOURCE OF TRUTH; `tokens.json` is a generated
 * mirror for tooling and AI agents. Never edit `tokens.json` by hand.
 *
 * Usage:
 *   node scripts/export-design-tokens.mjs          # write tokens.json
 *   node scripts/export-design-tokens.mjs --check   # fail if stale (CI/guards)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = join(root, "src/app/globals.css");
const outPath = join(root, "tokens.json");

const css = readFileSync(cssPath, "utf8");

// Grab the first `@theme { ... }` block (the design-token layer).
const theme = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
if (!theme) {
  console.error("export-design-tokens: no @theme block found in src/app/globals.css");
  process.exit(1);
}

// DTCG $type per token group, with a few suffix-based refinements.
const GROUP_TYPE = {
  color: "color",
  radius: "dimension",
  spacing: "dimension",
  breakpoint: "dimension",
  shadow: "shadow",
  font: "fontFamily",
  text: "dimension",
};

function typeFor(group, name) {
  if (group === "text") {
    if (name.endsWith("--font-weight")) return "fontWeight";
    if (name.endsWith("--line-height")) return "number";
    if (name.endsWith("--letter-spacing")) return "dimension";
  }
  return GROUP_TYPE[group] ?? "string";
}

/** @type {Record<string, Record<string, { $type: string, $value: string }>>} */
const groups = {};
let count = 0;

// Match `--name: value;` declarations, ignoring trailing comments.
const decl = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
for (const match of theme[1].matchAll(decl)) {
  const full = match[1];
  const value = match[2].replace(/\/\*[\s\S]*?\*\//g, "").trim();
  const dash = full.indexOf("-");
  const group = dash === -1 ? "misc" : full.slice(0, dash);
  const name = dash === -1 ? full : full.slice(dash + 1);
  (groups[group] ??= {})[name] = { $type: typeFor(group, name), $value: value };
  count += 1;
}

const doc = {
  $schema: "https://design-tokens.org/schema.json",
  $description:
    "Generated from src/app/globals.css (@theme). Do not edit by hand — run `npm run tokens:export`.",
  ...groups,
};

const json = `${JSON.stringify(doc, null, 2)}\n`;

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(outPath, "utf8");
  } catch {
    console.error("tokens.json is missing. Run: npm run tokens:export");
    process.exit(1);
  }
  if (current !== json) {
    console.error("tokens.json is out of date. Run: npm run tokens:export");
    process.exit(1);
  }
  console.log(`tokens.json is up to date (${count} tokens).`);
} else {
  writeFileSync(outPath, json);
  console.log(`Wrote tokens.json (${count} tokens) from src/app/globals.css.`);
}
