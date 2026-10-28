#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const USER_ERROR = 1;
const HARNESS_ERROR = 3;
const ALLOWED_STATUSES = new Set([
  "prepared",
  "sent",
  "accepted",
  "declined",
  "expired",
  "voided",
]);

// The lifecycle the ledger documents: a quote is prepared, then sent, and only
// a sent quote can be accepted, declined, or expired. Voiding is available from
// either live state. Closed rows stay closed — reopening one would rewrite
// history the record exists to keep.
const ALLOWED_TRANSITIONS = new Map([
  ["prepared", new Set(["sent", "voided"])],
  ["sent", new Set(["accepted", "declined", "expired", "voided"])],
  ["accepted", new Set([])],
  ["declined", new Set([])],
  ["expired", new Set([])],
  ["voided", new Set([])],
]);

function assertTransitionAllowed(quoteNumber, currentStatus, nextStatus) {
  if (currentStatus === nextStatus) return;
  if (!ALLOWED_TRANSITIONS.has(currentStatus)) {
    fail(`Quote ${quoteNumber} has an unrecognised status ${JSON.stringify(currentStatus)}; fix the ledger row before changing it.`, HARNESS_ERROR);
  }
  const permitted = ALLOWED_TRANSITIONS.get(currentStatus);
  if (permitted.has(nextStatus)) return;
  if (permitted.size === 0) {
    fail(`Quote ${quoteNumber} is already ${currentStatus}, which is a closed state; no status changed. Void or reopen is not a status change — price a new quote or a change order instead.`);
  }
  fail(`Quote ${quoteNumber} is ${currentStatus}, so it cannot become ${nextStatus}; no status changed. Allowed from ${currentStatus}: ${[...permitted].join(", ")}.`);
}

class QuoteKitError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

function fail(message, code = USER_ERROR) {
  throw new QuoteKitError(message, code);
}

function readStdinJson() {
  let raw;
  try {
    raw = fs.readFileSync(0, "utf8");
  } catch (error) {
    fail(`Could not read JSON input: ${error.message}`, HARNESS_ERROR);
  }
  if (!raw.trim()) fail("Expected JSON input on stdin.");
  try {
    return JSON.parse(raw);
  } catch (error) {
    fail(`Invalid JSON input: ${error.message}`);
  }
}

function decimalToScaledInteger(value, scale, fieldName) {
  const text = String(value ?? "").trim().replace(/[$,%\s,]/g, "");
  if (!/^-?\d+(?:\.\d+)?$/.test(text)) {
    fail(`${fieldName} must be a number; received ${JSON.stringify(value)}.`);
  }

  const negative = text.startsWith("-");
  const unsigned = negative ? text.slice(1) : text;
  const [whole, fraction = ""] = unsigned.split(".");
  const padded = `${fraction}${"0".repeat(scale + 1)}`;
  const kept = padded.slice(0, scale);
  const nextDigit = Number(padded[scale] || "0");
  let result = Number(whole) * 10 ** scale + Number(kept || "0");
  if (!Number.isSafeInteger(result)) {
    fail(`${fieldName} is too large to calculate safely.`);
  }
  if (nextDigit >= 5) result += 1;
  if (!Number.isSafeInteger(result)) {
    fail(`${fieldName} is too large to calculate safely.`);
  }
  return negative ? -result : result;
}

function assertDate(value, fieldName) {
  const text = assertSafeCell(value, fieldName);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) fail(`${fieldName} must use YYYY-MM-DD.`);
  const date = new Date(`${text}T00:00:00Z`);
  if (
    date.getUTCFullYear() !== Number(match[1])
    || date.getUTCMonth() + 1 !== Number(match[2])
    || date.getUTCDate() !== Number(match[3])
  ) {
    fail(`${fieldName} must be a real calendar date.`);
  }
  return text;
}

function money(cents) {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);
  return `${sign}$${Math.floor(absolute / 100).toLocaleString("en-US")}.${String(absolute % 100).padStart(2, "0")}`;
}

function calculate(input) {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    fail("items must contain at least one line item.");
  }

  const items = input.items.map((item, index) => {
    const label = `items[${index}]`;
    const description = String(item.description ?? "").trim();
    const unit = String(item.unit ?? "").trim();
    if (!description) fail(`${label}.description is required.`);
    if (!unit) fail(`${label}.unit is required.`);

    const quantityMicros = decimalToScaledInteger(item.quantity, 6, `${label}.quantity`);
    const unitPriceCents = decimalToScaledInteger(item.unitPrice, 2, `${label}.unitPrice`);
    if (quantityMicros <= 0) fail(`${label}.quantity must be greater than zero.`);
    if (unitPriceCents < 0) fail(`${label}.unitPrice cannot be negative.`);

    const lineTotalCents = Math.round((quantityMicros * unitPriceCents) / 1_000_000);
    return {
      description,
      quantity: String(item.quantity),
      unit,
      unitPriceCents,
      lineTotalCents,
      unitPrice: money(unitPriceCents),
      lineTotal: money(lineTotalCents),
    };
  });

  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const taxRatePartsPerMillion = decimalToScaledInteger(input.taxRatePercent ?? 0, 4, "taxRatePercent");
  if (taxRatePartsPerMillion < 0) fail("taxRatePercent cannot be negative.");
  const taxCents = Math.round((subtotalCents * taxRatePartsPerMillion) / 1_000_000);
  const totalCents = subtotalCents + taxCents;

  let depositCents = 0;
  let depositLabel = "none";
  const deposit = input.deposit ?? { type: "none" };
  if (deposit.type === "percent") {
    const depositBasisPoints = decimalToScaledInteger(deposit.value, 2, "deposit.value");
    if (depositBasisPoints < 0 || depositBasisPoints > 10_000) {
      fail("A percentage deposit must be between 0 and 100.");
    }
    depositCents = Math.round((totalCents * depositBasisPoints) / 10_000);
    depositLabel = `${Number(depositBasisPoints) / 100}%`;
  } else if (deposit.type === "fixed") {
    depositCents = decimalToScaledInteger(deposit.value, 2, "deposit.value");
    if (depositCents < 0) fail("A fixed deposit cannot be negative.");
    if (depositCents > totalCents) {
      fail(`The fixed deposit ${money(depositCents)} is larger than the total ${money(totalCents)}. Ask the user what they want; do not print a negative balance.`);
    }
    depositLabel = "fixed";
  } else if (deposit.type !== "none") {
    fail('deposit.type must be "percent", "fixed", or "none".');
  }

  const balanceCents = totalCents - depositCents;
  return {
    items,
    subtotalCents,
    taxCents,
    totalCents,
    depositCents,
    balanceCents,
    taxRatePercent: Number(taxRatePartsPerMillion) / 10_000,
    depositLabel,
    subtotal: money(subtotalCents),
    tax: money(taxCents),
    total: money(totalCents),
    deposit: money(depositCents),
    balance: money(balanceCents),
    checks: {
      lineTotalsEqualSubtotal: items.reduce((sum, item) => sum + item.lineTotalCents, 0) === subtotalCents,
      subtotalPlusTaxEqualsTotal: subtotalCents + taxCents === totalCents,
      depositPlusBalanceEqualsTotal: depositCents + balanceCents === totalCents,
    },
  };
}

function readLedger(ledgerPath) {
  try {
    return fs.readFileSync(ledgerPath, "utf8");
  } catch (error) {
    fail(`Could not read ledger ${ledgerPath}: ${error.message}`, HARNESS_ERROR);
  }
}

function topLevelNumbers(text) {
  return activeLedgerLines(text)
    .map((line) => /^\|\s*(\d{4})(?:-[A-Z]+)?\s*\|/.exec(line))
    .filter(Boolean)
    .map((match) => Number(match[1]));
}

function nextNumber(text) {
  const numbers = topLevelNumbers(text);
  const highest = numbers.length ? Math.max(...numbers) : 0;
  return String(highest + 1).padStart(4, "0");
}

function assertLedgerShape(text) {
  if (!/^\*\*Next quote number:\*\* \d{4}$/m.test(text)) {
    fail("Ledger is missing a valid '**Next quote number:** 0001' line.", HARNESS_ERROR);
  }
  if (!/^\| Quote # \| Client \| Amount \| Date \| Valid until \| Status \|$/m.test(text)) {
    fail("Ledger table must include Quote #, Client, Amount, Date, Valid until, and Status columns.", HARNESS_ERROR);
  }
}

function migrateLedger(ledgerPath) {
  return withLedgerLock(ledgerPath, () => {
    const text = readLedger(ledgerPath);
    if (/^\| Quote # \| Client \| Amount \| Date \| Valid until \| Status \|$/m.test(text)) {
      return { migrated: false, reason: "already current" };
    }
    if (!/^\| Quote # \| Client \| Amount \| Date \| Status \|$/m.test(text)) {
      fail("Ledger does not match the current or v1.1.2 table shape.", HARNESS_ERROR);
    }

    const updatedLines = text.split("\n").map((line) => {
      if (line === "| Quote # | Client | Amount | Date | Status |") {
        return "| Quote # | Client | Amount | Date | Valid until | Status |";
      }
      if (line === "| --- | --- | ---: | --- | --- |") {
        return "| --- | --- | ---: | --- | --- | --- |";
      }
      const cells = line.split("|").map((cell) => cell.trim());
      if (cells.length === 7 && /^\d{4}(?:-[A-Z]+)?$/.test(cells[1])) {
        return `| ${cells[1]} | ${cells[2]} | ${cells[3]} | ${cells[4]} | unknown | ${cells[5]} |`;
      }
      return line;
    });
    writeLedgerAtomically(ledgerPath, updatedLines.join("\n"));
    return { migrated: true, priorValidUntil: "unknown" };
  });
}

function assertSafeCell(value, fieldName) {
  const text = String(value ?? "").trim();
  if (!text) fail(`${fieldName} is required.`);
  if (/[|\r\n]/.test(text)) fail(`${fieldName} cannot contain a pipe or line break.`);
  return text;
}

function activeLedgerLines(text) {
  return text.replace(/<!--[\s\S]*?-->/g, "").split("\n");
}

// A lock older than this is treated as orphaned. No quote operation runs for
// anywhere near this long, so the only way to reach it is a crash or a Ctrl-C
// that skipped the release. Reclaiming beats bricking the ledger forever.
const LOCK_STALE_AFTER_MS = 5 * 60 * 1000;

function readLockOwner(lockPath) {
  try {
    const raw = fs.readFileSync(path.join(lockPath, "owner.json"), "utf8");
    const owner = JSON.parse(raw);
    return {
      pid: Number(owner.pid) || null,
      acquiredAtMs: Number(owner.acquiredAtMs) || null,
      acquiredAt: typeof owner.acquiredAt === "string" ? owner.acquiredAt : null,
    };
  } catch {
    // A lock with no readable owner record predates this format or was written
    // by a run that died mid-acquire. Fall back to the directory's own mtime.
    try {
      return { pid: null, acquiredAtMs: fs.statSync(lockPath).mtimeMs, acquiredAt: null };
    } catch {
      return { pid: null, acquiredAtMs: null, acquiredAt: null };
    }
  }
}

function processIsAlive(pid) {
  if (!pid || pid === process.pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM means the process exists but belongs to another user.
    return error.code === "EPERM";
  }
}

function lockIsOrphaned(owner) {
  if (processIsAlive(owner.pid)) return false;
  if (owner.acquiredAtMs === null) return true;
  return Date.now() - owner.acquiredAtMs >= LOCK_STALE_AFTER_MS;
}

function describeLock(owner) {
  const when = owner.acquiredAt || (owner.acquiredAtMs ? new Date(owner.acquiredAtMs).toISOString() : "an unknown time");
  return `held since ${when}${owner.pid ? ` by process ${owner.pid}` : ""}`;
}

function writeLockOwner(lockPath) {
  const acquiredAtMs = Date.now();
  try {
    fs.writeFileSync(
      path.join(lockPath, "owner.json"),
      `${JSON.stringify({ pid: process.pid, acquiredAtMs, acquiredAt: new Date(acquiredAtMs).toISOString() }, null, 2)}\n`,
      "utf8",
    );
  } catch {
    // The lock directory itself is the mutex; the owner record is only there to
    // make a later staleness judgement possible. Losing it is not fatal.
  }
}

function removeLock(lockPath) {
  try {
    fs.rmSync(lockPath, { recursive: true, force: true });
    return null;
  } catch (error) {
    return error;
  }
}

function unlockLedger(ledgerPath) {
  const lockPath = `${ledgerPath}.lock`;
  if (!fs.existsSync(lockPath)) return { unlocked: false, reason: "no lock was present" };
  const owner = readLockOwner(lockPath);
  if (processIsAlive(owner.pid)) {
    fail(`Ledger lock ${lockPath} is ${describeLock(owner)} and that process is still running. Let it finish rather than forcing the lock open.`);
  }
  const error = removeLock(lockPath);
  if (error) fail(`Could not clear ledger lock ${lockPath}: ${error.message}`, HARNESS_ERROR);
  return { unlocked: true, wasHeldBy: owner.pid, wasAcquiredAt: owner.acquiredAt };
}

function withLedgerLock(ledgerPath, operation) {
  const lockPath = `${ledgerPath}.lock`;
  let reclaimed = false;
  try {
    fs.mkdirSync(lockPath);
  } catch (error) {
    if (error.code !== "EEXIST") {
      fail(`Could not lock ledger: ${error.message}`, HARNESS_ERROR);
    }
    const owner = readLockOwner(lockPath);
    if (!lockIsOrphaned(owner)) {
      // A live holder is the only case where waiting is the right answer, and
      // it is a harness condition rather than something the user did wrong.
      fail(
        `Ledger is busy: ${lockPath} is ${describeLock(owner)} by a running quote operation. Wait for it to finish, then try again.`,
        HARNESS_ERROR,
      );
    }
    const removeError = removeLock(lockPath);
    if (removeError) {
      fail(`Ledger lock ${lockPath} looks orphaned but could not be cleared: ${removeError.message}`, HARNESS_ERROR);
    }
    try {
      fs.mkdirSync(lockPath);
    } catch (retryError) {
      fail(`Could not lock ledger after clearing an orphaned lock: ${retryError.message}`, HARNESS_ERROR);
    }
    reclaimed = true;
  }

  writeLockOwner(lockPath);

  let result;
  try {
    result = operation();
  } finally {
    const removeError = removeLock(lockPath);
    if (removeError) {
      fail(`Ledger changed, but its lock could not be removed: ${removeError.message}`, HARNESS_ERROR);
    }
  }
  return reclaimed ? { ...result, reclaimedOrphanedLock: true } : result;
}

function writeLedgerAtomically(ledgerPath, text) {
  const temporaryPath = path.join(path.dirname(ledgerPath), `quote-kit-write-${process.pid}.tmp`);
  try {
    fs.writeFileSync(temporaryPath, text, "utf8");
    fs.renameSync(temporaryPath, ledgerPath);
  } catch (error) {
    try {
      if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
    } catch {
      // The original write error is the useful failure.
    }
    fail(`Could not update ledger: ${error.message}`, HARNESS_ERROR);
  }
}

function reserveLedgerNumber(ledgerPath, input) {
  return withLedgerLock(ledgerPath, () => {
    const text = readLedger(ledgerPath);
    assertLedgerShape(text);

    const quoteNumber = nextNumber(text);
    const client = assertSafeCell(input.client, "client");
    const date = assertDate(input.date, "date");
    const validUntil = assertDate(input.validUntil, "validUntil");
    if (validUntil < date) fail("validUntil cannot be earlier than date.");
    const amountCents = decimalToScaledInteger(input.amount, 2, "amount");
    if (amountCents < 0) fail("amount cannot be negative for a new quote.");
    const amountNote = input.amountNote === undefined
      ? ""
      : ` ${assertSafeCell(input.amountNote, "amountNote")}`;

    const lines = text.split("\n");
    const separatorIndex = lines.findIndex((line) => /^\| --- \| --- \| ---: \| --- \| --- \| --- \|$/.test(line));
    if (separatorIndex === -1) fail("Could not locate the ledger table separator.", HARNESS_ERROR);

    let insertIndex = separatorIndex + 1;
    while (insertIndex < lines.length && /^\|/.test(lines[insertIndex])) insertIndex += 1;
    lines.splice(insertIndex, 0, `| ${quoteNumber} | ${client} | ${money(amountCents)}${amountNote} | ${date} | ${validUntil} | prepared |`);

    const updated = lines.join("\n").replace(
      /^\*\*Next quote number:\*\* \d{4}$/m,
      `**Next quote number:** ${String(Number(quoteNumber) + 1).padStart(4, "0")}`,
    );
    writeLedgerAtomically(ledgerPath, updated);
    return { quoteNumber, status: "prepared" };
  });
}

function suffixToNumber(suffix) {
  return [...suffix].reduce((value, character) => value * 26 + character.charCodeAt(0) - 64, 0);
}

function numberToSuffix(value) {
  let result = "";
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
}

function reserveChangeOrder(ledgerPath, input) {
  return withLedgerLock(ledgerPath, () => {
    const text = readLedger(ledgerPath);
    assertLedgerShape(text);
    const parent = assertSafeCell(input.parentQuoteNumber, "parentQuoteNumber");
    if (!/^\d{4}$/.test(parent)) fail("parentQuoteNumber must be a four-digit top-level quote number.");

    const parentLine = activeLedgerLines(text).find((line) => line.startsWith(`| ${parent} |`));
    if (!parentLine) fail(`Parent quote ${parent} was not found; no change order was reserved.`);
    const parentCells = parentLine.split("|").map((cell) => cell.trim());
    if (parentCells[6] !== "accepted") {
      fail(`Parent quote ${parent} has status ${parentCells[6] || "unknown"}; a change order requires an accepted parent.`);
    }

    const suffixNumbers = activeLedgerLines(text)
      .map((line) => new RegExp(`^\\|\\s*${parent}-([A-Z]+)\\s*\\|`).exec(line))
      .filter(Boolean)
      .map((match) => suffixToNumber(match[1]));
    const suffix = numberToSuffix((suffixNumbers.length ? Math.max(...suffixNumbers) : 0) + 1);
    const quoteNumber = `${parent}-${suffix}`;
    const client = assertSafeCell(input.client, "client");
    const date = assertDate(input.date, "date");
    const validUntil = assertDate(input.validUntil, "validUntil");
    if (validUntil < date) fail("validUntil cannot be earlier than date.");
    const amountCents = decimalToScaledInteger(input.amount, 2, "amount");

    const lines = text.split("\n");
    const separatorIndex = lines.findIndex((line) => /^\| --- \| --- \| ---: \| --- \| --- \| --- \|$/.test(line));
    if (separatorIndex === -1) fail("Could not locate the ledger table separator.", HARNESS_ERROR);
    let insertIndex = separatorIndex + 1;
    while (insertIndex < lines.length && /^\|/.test(lines[insertIndex])) insertIndex += 1;
    lines.splice(insertIndex, 0, `| ${quoteNumber} | ${client} | ${money(amountCents)} | ${date} | ${validUntil} | prepared |`);
    writeLedgerAtomically(ledgerPath, lines.join("\n"));
    return { quoteNumber, status: "prepared", nextQuoteNumberUnchanged: true };
  });
}

function updateLedgerStatus(ledgerPath, quoteNumber, status) {
  if (!/^\d{4}(?:-[A-Z]+)?$/.test(quoteNumber)) fail("quote number must look like 0001 or 0068-A.");
  if (!ALLOWED_STATUSES.has(status)) fail(`status must be one of: ${[...ALLOWED_STATUSES].join(", ")}.`);

  return withLedgerLock(ledgerPath, () => {
    const text = readLedger(ledgerPath);
    assertLedgerShape(text);
    const lines = text.split("\n");
    let matches = 0;
    let inComment = false;
    let priorStatus = null;

    const updatedLines = lines.map((line) => {
      if (line.includes("<!--")) inComment = true;
      if (inComment) {
        if (line.includes("-->")) inComment = false;
        return line;
      }
      const cells = line.split("|").map((cell) => cell.trim());
      if (cells.length !== 8 || cells[1] !== quoteNumber) return line;
      matches += 1;
      priorStatus = cells[6];
      cells[6] = status;
      return `| ${cells.slice(1, 7).join(" | ")} |`;
    });

    if (matches === 0) fail(`Quote ${quoteNumber} was not found; no status changed.`);
    if (matches > 1) fail(`Quote ${quoteNumber} appears more than once; no status changed.`, HARNESS_ERROR);
    // Refuse before writing, so a rejected transition leaves the file untouched.
    assertTransitionAllowed(quoteNumber, priorStatus, status);
    if (priorStatus === status) return { quoteNumber, status, unchanged: true };
    writeLedgerAtomically(ledgerPath, updatedLines.join("\n"));
    return { quoteNumber, status, priorStatus };
  });
}

function expireLedgerRows(ledgerPath, todayInput) {
  const today = assertDate(todayInput, "today");
  return withLedgerLock(ledgerPath, () => {
    const text = readLedger(ledgerPath);
    assertLedgerShape(text);
    const expired = [];
    let inComment = false;
    const updatedLines = text.split("\n").map((line) => {
      if (line.includes("<!--")) inComment = true;
      if (inComment) {
        if (line.includes("-->")) inComment = false;
        return line;
      }
      const cells = line.split("|").map((cell) => cell.trim());
      if (cells.length !== 8 || cells[6] !== "sent") return line;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(cells[5]) || cells[5] >= today) return line;
      cells[6] = "expired";
      expired.push(cells[1]);
      return `| ${cells.slice(1, 7).join(" | ")} |`;
    });
    if (expired.length) writeLedgerAtomically(ledgerPath, updatedLines.join("\n"));
    return { expired };
  });
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

const [command, ...args] = process.argv.slice(2);

try {
  if (command === "calculate") {
    printJson(calculate(readStdinJson()));
  } else if (command === "ledger-next") {
    if (args.length !== 1) fail("Usage: quote-kit.mjs ledger-next <ledger-path>");
    const text = readLedger(args[0]);
    assertLedgerShape(text);
    printJson({ quoteNumber: nextNumber(text) });
  } else if (command === "ledger-migrate") {
    if (args.length !== 1) fail("Usage: quote-kit.mjs ledger-migrate <ledger-path>");
    printJson(migrateLedger(args[0]));
  } else if (command === "ledger-reserve") {
    if (args.length !== 1) fail("Usage: quote-kit.mjs ledger-reserve <ledger-path> < request.json");
    printJson(reserveLedgerNumber(args[0], readStdinJson()));
  } else if (command === "ledger-reserve-change") {
    if (args.length !== 1) fail("Usage: quote-kit.mjs ledger-reserve-change <ledger-path> < request.json");
    printJson(reserveChangeOrder(args[0], readStdinJson()));
  } else if (command === "ledger-status") {
    if (args.length !== 3) fail("Usage: quote-kit.mjs ledger-status <ledger-path> <quote-number> <status>");
    printJson(updateLedgerStatus(args[0], args[1], args[2]));
  } else if (command === "ledger-expire") {
    if (args.length !== 2) fail("Usage: quote-kit.mjs ledger-expire <ledger-path> <today-YYYY-MM-DD>");
    printJson(expireLedgerRows(args[0], args[1]));
  } else if (command === "ledger-unlock") {
    if (args.length !== 1) fail("Usage: quote-kit.mjs ledger-unlock <ledger-path>");
    printJson(unlockLedger(args[0]));
  } else {
    fail("Usage: quote-kit.mjs <calculate|ledger-next|ledger-migrate|ledger-reserve|ledger-reserve-change|ledger-status|ledger-expire|ledger-unlock> ...");
  }
} catch (error) {
  if (error instanceof QuoteKitError) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = error.code;
  } else {
    process.stderr.write(`Unexpected quote-kit failure: ${error.message}\n`);
    process.exitCode = HARNESS_ERROR;
  }
}
