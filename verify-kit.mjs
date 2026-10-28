#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const kitRoot = import.meta.dirname;
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(kitRoot, relativePath), "utf8");
}

function filesUnder(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    // A git checkout's own metadata is not part of the shipped package.
    if (entry.isDirectory() && entry.name === ".git" && directory === kitRoot) continue;
    if (entry.isDirectory()) result.push(...filesUnder(absolute));
    else result.push(absolute);
  }
  return result;
}

const requiredFiles = [
  "START-HERE.md",
  "installer.md",
  "OPERATIONS-MANUAL.md",
  "README.md",
  "VERSION",
  "CHANGELOG.md",
  "kit.json",
  "skills/quotes/SKILL.md",
  "skills/quotes/USER-CONFIG.md",
  "skills/quotes/rate-card.md",
  "skills/quotes/services.md",
  "skills/quotes/ledger/quotes-ledger.md",
  "skills/quotes/templates/quote/template.md",
  "skills/quotes/templates/quote/form.html",
  "skills/quotes/scripts/quote-kit.mjs",
  "skills/quotes/workflows/new-quote.md",
  "skills/quotes/workflows/change-order.md",
  "skills/quotes/workflows/ledger-update.md",
  "skills/quotes/workflows/render-quote.md",
];

for (const relativePath of requiredFiles) {
  check(fs.existsSync(path.join(kitRoot, relativePath)), `missing required file: ${relativePath}`);
}

const version = read("VERSION").trim();
const installer = read("installer.md");
const changelog = read("CHANGELOG.md");
check(/^\d+\.\d+\.\d+$/.test(version), "VERSION must be one SemVer line without a v prefix");
check(installer.includes(`**Version:** ${version}`), "installer.md version does not match VERSION");
check(changelog.includes(`## [${version}] - `), "CHANGELOG.md has no entry for VERSION");

// KIT-STANDARD §9.3: the Node dependency is DECLARED, not only stated in prose.
let manifest = null;
try {
  manifest = JSON.parse(read("kit.json"));
} catch (error) {
  failures.push(`kit.json is not valid JSON: ${error.message}`);
}
if (manifest) {
  check(manifest.name === "quote-kit", "kit.json name must be quote-kit");
  check(manifest.version === version, "kit.json version does not match VERSION");
  check(
    manifest.requirements?.runtimes?.node === ">=22.0.0",
    "kit.json must declare the Node runtime floor as >=22.0.0 (KIT-STANDARD §9.3)",
  );
}

const packageFiles = filesUnder(kitRoot);
for (const absolutePath of packageFiles) {
  const relativePath = path.relative(kitRoot, absolutePath);
  const parts = relativePath.split(path.sep);
  check(!parts.some((part) => part.startsWith(".") && part !== ".gitkeep"), `hidden file or folder is not allowed: ${relativePath}`);

  if (!/\.(?:md|mjs|html|json|txt)$/.test(relativePath) && path.basename(relativePath) !== "VERSION") continue;
  const text = fs.readFileSync(absolutePath, "utf8");
  if (relativePath !== "verify-kit.mjs" && !relativePath.startsWith(`tests${path.sep}`)) {
    check(!/\b(?:bun run|bun test|bunx)\b|\bBun\.[A-Za-z_$]|from\s+["']bun:test["']/i.test(text), `buyer-facing Bun dependency found: ${relativePath}`);
  }
  check(!/(?:reduce|cut|eliminate|replace)\s+(?:staff|employees?|headcount|workers?)/i.test(text), `positioning-law violation found: ${relativePath}`);
}

const skill = read("skills/quotes/SKILL.md");
const ledger = read("skills/quotes/ledger/quotes-ledger.md");
const form = read("skills/quotes/templates/quote/form.html");
const services = read("skills/quotes/services.md");
const quoteScript = read("skills/quotes/scripts/quote-kit.mjs");

check(/^name: quotes$/m.test(skill), "SKILL.md frontmatter must contain name: quotes");
check(skill.includes("scripts/quote-kit.mjs calculate"), "SKILL.md must route money math through the deterministic Node script");
check(skill.includes("scripts/quote-kit.mjs ledger-reserve"), "SKILL.md must route quote-number reservation through the deterministic Node script");
check(!skill.includes('or start at 0001 and tell them to keep track'), "bare-chat mode must not invent 0001 when ledger history is unknown");
check(/^\| Quote # \| Client \| Amount \| Date \| Valid until \| Status \|$/m.test(ledger), "ledger must store valid-until dates so expiry can be determined");
check(ledger.includes("**prepared**"), "ledger must define prepared status for reserved, unsent quotes");
check(quoteScript.includes('decimalToScaledInteger(input.taxRatePercent ?? 0, 4'), "money script must preserve tax rates such as 8.625 percent");
check(quoteScript.includes('text.replace(/<!--[\\s\\S]*?-->/g, "")'), "ledger mechanics must ignore documented example rows inside comments");
check(quoteScript.includes("throw new QuoteKitError(message, code)"), "script refusals must unwind through finally so ledger locks are released");
check(quoteScript.includes("validUntil cannot be earlier than date"), "ledger reservations must reject an expiry before the quote date");

const brandingFields = [
  "business name:",
  "business tagline:",
  "business street address:",
  "business city, state, and postal code:",
  "business phone number:",
  "business email address:",
  "primary color:",
  "accent color:",
  "font preference:",
  "voice notes:",
  "sign-off name and title:",
  "logo file:",
  "image lane:",
];
for (const field of brandingFields) {
  check(installer.includes(field), `installer branding interview does not collect required template field: ${field}`);
}

check(!/<script\s+[^>]*src=|<link\s+[^>]*href=(?!["']?data:)|\bfetch\s*\(|XMLHttpRequest/i.test(form), "form.html must stay offline and self-contained");
const scriptBlocks = [...form.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
check(scriptBlocks.length === 1, "form.html must contain exactly one inline script block");
if (scriptBlocks.length === 1) {
  try {
    new vm.Script(scriptBlocks[0], { filename: "form.html:inline-script" });
  } catch (error) {
    failures.push(`form.html inline script is invalid JavaScript: ${error.message}`);
  }
}
check(form.includes('value="fixed"'), "form.html must support a fixed-dollar deposit");
check(form.includes("Quote not produced"), "form.html must refuse instead of emitting a known-invalid quote");

check(services.includes("https://www.tax.ny.gov/pdf/current_forms/st/st124_fill_in.pdf"), "ST-124 claim must link the official form");
check(services.includes("https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/capital_improvements.htm"), "capital-improvement claim must link official guidance");

if (failures.length) {
  process.stderr.write(`Quote Kit verification failed (${failures.length}):\n`);
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exit(1);
}

process.stdout.write(`Quote Kit verification passed: ${requiredFiles.length} required files, version ${version}, plain-Node scripts, offline form, deterministic math/ledger contracts, and positioning scan.\n`);
