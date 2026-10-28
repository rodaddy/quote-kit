import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const kitRoot = path.resolve(import.meta.dirname, "..");
const scriptPath = path.join(kitRoot, "skills/quotes/scripts/quote-kit.mjs");
const sourceLedgerPath = path.join(kitRoot, "skills/quotes/ledger/quotes-ledger.md");
const testLedgerPath = path.join(kitRoot, "tests/ledger-under-test.md");

function run(args, input) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: kitRoot,
    encoding: "utf8",
    input: input === undefined ? undefined : JSON.stringify(input),
  });
}

function json(result) {
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("calculate produces exact cents and balanced percentage deposit", () => {
  const result = json(run(["calculate"], {
    items: [
      { description: "Patio", quantity: "480", unit: "square feet", unitPrice: "22.00" },
      { description: "Removal", quantity: "480", unit: "square feet", unitPrice: "4.50" },
      { description: "Dry well", quantity: "1", unit: "job", unitPrice: "1850.00" },
    ],
    taxRatePercent: "0",
    deposit: { type: "percent", value: "50" },
  }));

  assert.equal(result.subtotalCents, 1_457_000);
  assert.equal(result.total, "$14,570.00");
  assert.equal(result.deposit, "$7,285.00");
  assert.equal(result.balance, "$7,285.00");
  assert.deepEqual(result.checks, {
    lineTotalsEqualSubtotal: true,
    subtotalPlusTaxEqualsTotal: true,
    depositPlusBalanceEqualsTotal: true,
  });
});

test("calculate handles fractional quantities and rounds tax once", () => {
  const result = json(run(["calculate"], {
    items: [{ description: "Consulting", quantity: "8.5", unit: "hours", unitPrice: "185" }],
    taxRatePercent: "8.625",
    deposit: { type: "fixed", value: "500" },
  }));

  assert.equal(result.subtotal, "$1,572.50");
  assert.equal(result.tax, "$135.63");
  assert.equal(result.total, "$1,708.13");
  assert.equal(result.deposit, "$500.00");
  assert.equal(result.balance, "$1,208.13");
  assert.equal(result.taxRatePercent, 8.625);
});

test("calculate refuses missing units and an oversized fixed deposit", () => {
  const missingUnit = run(["calculate"], {
    items: [{ description: "Patio", quantity: 480, unitPrice: 22 }],
    deposit: { type: "none" },
  });
  assert.equal(missingUnit.status, 1);
  assert.match(missingUnit.stderr, /unit is required/);

  const oversizedDeposit = run(["calculate"], {
    items: [{ description: "Visit", quantity: 1, unit: "visit", unitPrice: 100 }],
    deposit: { type: "fixed", value: 150 },
  });
  assert.equal(oversizedDeposit.status, 1);
  assert.match(oversizedDeposit.stderr, /larger than the total/);
});

test("ledger refusal preserves the file and releases its lock", () => {
  fs.copyFileSync(sourceLedgerPath, testLedgerPath);
  const lockPath = `${testLedgerPath}.lock`;
  try {
    const invalidDate = run(["ledger-reserve", testLedgerPath], {
      client: "Anthony DiMarco",
      amount: "14570.00",
      date: "2026-02-30",
      validUntil: "2026-03-30",
    });
    assert.equal(invalidDate.status, 1);
    assert.match(invalidDate.stderr, /real calendar date/);
    assert.equal(fs.readFileSync(testLedgerPath, "utf8"), fs.readFileSync(sourceLedgerPath, "utf8"));
    assert.equal(fs.existsSync(lockPath), false);
  } finally {
    if (fs.existsSync(testLedgerPath)) fs.unlinkSync(testLedgerPath);
    if (fs.existsSync(lockPath)) fs.rmdirSync(lockPath);
  }
});

test("an orphaned lock is reclaimed instead of bricking the ledger", () => {
  fs.copyFileSync(sourceLedgerPath, testLedgerPath);
  const lockPath = `${testLedgerPath}.lock`;
  try {
    // Exactly what a crash or Ctrl-C mid-reservation leaves behind: a lock
    // directory whose owning process is long gone.
    fs.mkdirSync(lockPath);
    fs.writeFileSync(
      path.join(lockPath, "owner.json"),
      JSON.stringify({ pid: 999_999, acquiredAtMs: Date.now() - 60 * 60 * 1000 }),
      "utf8",
    );

    const reserved = json(run(["ledger-reserve", testLedgerPath], {
      client: "Anthony DiMarco",
      amount: "14570.00",
      date: "2026-08-13",
      validUntil: "2026-09-12",
    }));
    assert.equal(reserved.quoteNumber, "0001");
    assert.equal(reserved.reclaimedOrphanedLock, true);
    assert.equal(fs.existsSync(lockPath), false);
  } finally {
    if (fs.existsSync(testLedgerPath)) fs.unlinkSync(testLedgerPath);
    if (fs.existsSync(lockPath)) fs.rmSync(lockPath, { recursive: true, force: true });
  }
});

test("a live lock refuses as a harness fault, and ledger-unlock clears a dead one", () => {
  fs.copyFileSync(sourceLedgerPath, testLedgerPath);
  const lockPath = `${testLedgerPath}.lock`;
  try {
    // A lock this process itself is plausibly holding, taken just now: the one
    // case where waiting really is the right answer.
    fs.mkdirSync(lockPath);
    fs.writeFileSync(
      path.join(lockPath, "owner.json"),
      JSON.stringify({ pid: process.pid, acquiredAtMs: Date.now() }),
      "utf8",
    );

    const busy = run(["ledger-next", testLedgerPath]);
    assert.equal(busy.status, 0, "ledger-next takes no lock and must stay readable");

    const blocked = run(["ledger-status", testLedgerPath, "0001", "sent"]);
    assert.equal(blocked.status, 3, "a live lock is a harness fault, not a user error");
    assert.match(blocked.stderr, /Ledger is busy/);

    // ledger-unlock will not force a lock whose owner is still running.
    const refusedUnlock = run(["ledger-unlock", testLedgerPath]);
    assert.equal(refusedUnlock.status, 1);
    assert.match(refusedUnlock.stderr, /still running/);

    // Rewrite the owner as a process that is gone; now it clears.
    fs.writeFileSync(
      path.join(lockPath, "owner.json"),
      JSON.stringify({ pid: 999_999, acquiredAtMs: Date.now() }),
      "utf8",
    );
    const cleared = json(run(["ledger-unlock", testLedgerPath]));
    assert.equal(cleared.unlocked, true);
    assert.equal(fs.existsSync(lockPath), false);

    assert.deepEqual(json(run(["ledger-unlock", testLedgerPath])), {
      unlocked: false,
      reason: "no lock was present",
    });
  } finally {
    if (fs.existsSync(testLedgerPath)) fs.unlinkSync(testLedgerPath);
    if (fs.existsSync(lockPath)) fs.rmSync(lockPath, { recursive: true, force: true });
  }
});

test("status changes follow the documented lifecycle", () => {
  fs.copyFileSync(sourceLedgerPath, testLedgerPath);
  try {
    json(run(["ledger-reserve", testLedgerPath], {
      client: "Anthony DiMarco",
      amount: "14570.00",
      date: "2026-08-13",
      validUntil: "2026-09-12",
    }));

    // prepared -> accepted skips the send, so the ledger would claim a client
    // agreed to a quote that never went out.
    const skippedSend = run(["ledger-status", testLedgerPath, "0001", "accepted"]);
    assert.equal(skippedSend.status, 1);
    assert.match(skippedSend.stderr, /cannot become accepted/);
    assert.match(fs.readFileSync(testLedgerPath, "utf8"), /\| 0001 \|.*\| prepared \|/);

    json(run(["ledger-status", testLedgerPath, "0001", "sent"]));
    json(run(["ledger-status", testLedgerPath, "0001", "accepted"]));

    // accepted is closed; reopening it would rewrite the record.
    const reopen = run(["ledger-status", testLedgerPath, "0001", "sent"]);
    assert.equal(reopen.status, 1);
    assert.match(reopen.stderr, /closed state/);
    assert.match(fs.readFileSync(testLedgerPath, "utf8"), /\| 0001 \|.*\| accepted \|/);

    // Re-asserting the status a row already has is a no-op, not a refusal.
    assert.deepEqual(json(run(["ledger-status", testLedgerPath, "0001", "accepted"])), {
      quoteNumber: "0001",
      status: "accepted",
      unchanged: true,
    });
  } finally {
    if (fs.existsSync(testLedgerPath)) fs.unlinkSync(testLedgerPath);
  }
});

test("a prepared quote can still be voided", () => {
  fs.copyFileSync(sourceLedgerPath, testLedgerPath);
  try {
    json(run(["ledger-reserve", testLedgerPath], {
      client: "Delia Moreno",
      amount: "4323.28",
      date: "2026-08-13",
      validUntil: "2026-09-12",
    }));
    const voided = json(run(["ledger-status", testLedgerPath, "0001", "voided"]));
    assert.equal(voided.priorStatus, "prepared");
    assert.match(fs.readFileSync(testLedgerPath, "utf8"), /\| 0001 \|.*\| voided \|/);
  } finally {
    if (fs.existsSync(testLedgerPath)) fs.unlinkSync(testLedgerPath);
  }
});

test("ledger reservation is sequential, durable, and status-aware", () => {
  fs.copyFileSync(sourceLedgerPath, testLedgerPath);
  try {
    const first = json(run(["ledger-reserve", testLedgerPath], {
      client: "Anthony DiMarco",
      amount: "14570.00",
      date: "2026-08-13",
      validUntil: "2026-09-12",
    }));
    assert.deepEqual(first, { quoteNumber: "0001", status: "prepared" });

    const second = json(run(["ledger-reserve", testLedgerPath], {
      client: "Delia Moreno",
      amount: "4323.28",
      date: "2026-08-13",
      validUntil: "2026-09-12",
    }));
    assert.deepEqual(second, { quoteNumber: "0002", status: "prepared" });

    json(run(["ledger-status", testLedgerPath, "0001", "sent"]));
    const beforeExpiry = fs.readFileSync(testLedgerPath, "utf8");
    assert.match(beforeExpiry, /\*\*Next quote number:\*\* 0003/);
    assert.match(beforeExpiry, /\| 0001 \| Anthony DiMarco \| \$14,570\.00 \| 2026-08-13 \| 2026-09-12 \| sent \|/);
    assert.match(beforeExpiry, /\| 0002 \| Delia Moreno \| \$4,323\.28 \| 2026-08-13 \| 2026-09-12 \| prepared \|/);
    assert.match(beforeExpiry, /\| 0001 \| Bob Smith \| \$5,214\.00 \| 2026-07-15 \| 2026-08-14 \| sent \|/);

    const expired = json(run(["ledger-expire", testLedgerPath, "2026-09-13"]));
    assert.deepEqual(expired, { expired: ["0001"] });
    assert.match(fs.readFileSync(testLedgerPath, "utf8"), /\| 0001 .* \| expired \|/);
  } finally {
    if (fs.existsSync(testLedgerPath)) fs.unlinkSync(testLedgerPath);
  }
});
