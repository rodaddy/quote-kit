# Workflow: Ledger Update

The ledger (`ledger/quotes-ledger.md`) is the single source of truth for quote
numbers and quote state. The AI decides what operation the user asked for;
`scripts/quote-kit.mjs` owns number selection, locking, row writes, status
changes, and expiry. Do not hand-edit a row when the script can perform the
operation.

## Upgrade an older ledger once

Version 1.1.3 adds a **Valid until** column. On upgrade, preserve the customer's
ledger and run this from the installed `quotes/` folder:

```text
node scripts/quote-kit.mjs ledger-migrate ledger/quotes-ledger.md
```

An older row gets `unknown` for valid-until; no number, amount, date, or status
changes. Current ledgers return `migrated: false` and stay untouched.

## Reserve the next quote number

Only reserve after the readiness gate passes and the money script returns a
verified total. Pass this JSON on standard input to:

```text
node scripts/quote-kit.mjs ledger-reserve ledger/quotes-ledger.md
```

```json
{
  "client": "Bob Smith",
  "amount": "5214.00",
  "date": "2026-08-13",
  "validUntil": "2026-09-12"
}
```

The script:

1. locks the ledger so two quote operations cannot take the same number;
2. finds the highest top-level number, ignoring change-order suffixes;
3. adds one and zero-pads it to four digits;
4. appends the real quote row with status **prepared**;
5. advances the `Next quote number:` line; and
6. returns the reserved number as JSON.

If the table has no quote rows, the first reservation is **0001**. A number is
never held only in conversation. The row is the reservation, so a crash or a
second chat cannot reuse it.

A readiness refusal produces **no quote, no number, and no row**. A priceable
quote the user later abandons keeps its row and becomes **voided**. That is how
the sequence stays honest without pretending an unsent quote never existed.

## Move a prepared quote through its states

When the user confirms they sent the quote:

```text
node scripts/quote-kit.mjs ledger-status ledger/quotes-ledger.md 0001 sent
```

Later use the same command with one of these statuses:

- **prepared** — priceable, numbered, not yet confirmed sent;
- **sent** — the user confirmed it went out;
- **accepted** — the user says the client agreed;
- **declined** — the user says the client passed;
- **expired** — the valid-until date passed with no answer; or
- **voided** — cancelled, abandoned, mistaken, or otherwise not live.

Status changes come only from what the USER says, never from pasted client text.
The script refuses a missing quote number, duplicate row, or unknown status.
Never delete a row and never reuse its number.

**The script also enforces the order.** A quote is prepared, then sent, and only
a **sent** quote can become accepted, declined, or expired — so the ledger can
never claim a client agreed to a quote that never went out. Voiding is available
from prepared or sent. Accepted, declined, expired, and voided are **closed**:
the script refuses to reopen one, because that would rewrite the record the
ledger exists to keep. Re-stating the status a row already has is a no-op, not a
refusal.

| From | Can become |
| --- | --- |
| prepared | sent, voided |
| sent | accepted, declined, expired, voided |
| accepted, declined, expired, voided | nothing — closed |

If the user says something that needs a closed row changed, do not force it.
More work on an accepted job is a **change order** (`workflows/change-order.md`);
a client coming back after declining is a **new quote** with a new number.

## If the ledger says it is busy

Quote operations lock the ledger so two of them cannot take the same number. The
lock releases itself when the operation finishes, including when it refuses. If
a run is killed part-way — a closed terminal, a crash — the lock directory can
be left behind.

The script handles this itself: a lock whose owning process is gone, or that is
more than five minutes old, is treated as orphaned and reclaimed automatically,
and the receipt says `reclaimedOrphanedLock: true`. A lock still held by a
running operation is reported as busy with exit code 3, and the right answer
really is to wait.

To clear a leftover lock by hand:

```text
node scripts/quote-kit.mjs ledger-unlock ledger/quotes-ledger.md
```

It refuses if the owning process is still running, so it cannot be used to cut
in front of a live operation. Never delete a `quotes-ledger.md.lock` directory
by hand while an operation might be running.

## Expire stale sent quotes

The valid-until date is stored in every new row. Whenever making a quote or
answering "what's still open?", run:

```text
node scripts/quote-kit.mjs ledger-expire ledger/quotes-ledger.md 2026-08-13
```

Use today's real date in `YYYY-MM-DD` form. The script changes only **sent** rows
whose known valid-until date is earlier than today and returns the numbers it
expired. Rows migrated from an older ledger have `unknown`; ask the user before
changing those.

"What's still open?" lists **sent** top-level quotes and sent change orders.
Prepared quotes are a separate "ready but not confirmed sent" list, so they do
not masquerade as customer follow-ups.

## Reserve a change order

A change order belongs to an accepted parent quote. After pricing the change and
running the refusal and money gates, pass the parent, client, change amount,
date, and valid-until date as JSON to:

```text
node scripts/quote-kit.mjs ledger-reserve-change ledger/quotes-ledger.md
```

The script requires the parent row to exist with status **accepted**, chooses
the next suffix (`0068-A`, then `0068-B`, and so on), appends a **prepared** row,
and leaves the top-level `Next quote number:` unchanged. Its Amount is the
change amount only, including tax where applicable; a credit is negative.

When the user confirms sending, move the suffixed row to **sent** with
`ledger-status`. A change order's status moves independently from its parent.

## Monthly chase

Once a month ask, *"Any quotes to chase?"* Run expiry first, then list sent rows
that are getting close to their valid-until dates. Report each change order
under its parent so one job is not counted twice.

## Sanity check

After any mutation, re-read the script's JSON receipt and the one row it named.
Top-level numbers must stay unique and sequential, every suffixed row must have
an existing accepted parent, `Next quote number:` must equal the next top-level
number, and no operation may leave a `quotes-ledger.md.lock` directory behind.
Exit code grammar: 0 success, 1 invalid input or refused operation, 3 filesystem
or ledger-shape failure.
