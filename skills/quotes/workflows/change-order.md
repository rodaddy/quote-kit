# Workflow: Change Order

Every quote this kit prints carries the same sentence: *"If something on this
list turns out differently once we are on site, we will come back to you with
the change in writing before doing the work."* This is the workflow that keeps
that promise.

A change order is **not a new quote.** It is a priced addition to a job the
customer already accepted, and it inherits that job's terms, tax treatment, and
exclusions. Treating it as a fresh quote is wrong in three ways at once: it
spends a new quote number on the same job, it makes "what's still open?" count
one roof twice, and it runs a minimum-charge check that has no business firing
on a $736 add to a $22,000 roof.

## When to use this instead of `new-quote.md`

Use a change order when **all** of these are true:

- there is an existing quote in `ledger/quotes-ledger.md` for this job;
- that quote's status is **accepted** (or the user says the customer has
  committed);
- the new work is an addition or a change to that same job, not a separate job
  at a different address or a different time.

If any one is false, it is a new quote — run `new-quote.md`.

## 1. Find the original

Ask which quote this belongs to if the user has not said, and read that row from
the ledger: its number, the client, the amount, and its status. If the number
they name is not in the ledger, say so and stop rather than guessing which job
they mean.

## 2. Number it as a child of the original

A change order takes the original's number with a letter suffix, in order:
`0068-A`, then `0068-B`, then `0068-C`. **It never takes a new number from the
top of the ledger.** The sequence of top-level quote numbers stays exactly as it
was; this is what keeps one job counting as one job.

## 3. Price it

Price the added lines exactly as `new-quote.md` step 3 and 3b do, and run the
same refusal gate (step 3c) — quantity with a unit, a price with a named source,
that price actually applying to this scope, every pricing question answered.
**A change order that cannot be priced is refused the same as a quote.**

Run the added lines through `node scripts/quote-kit.mjs calculate` exactly as a
new quote does. Use the original's tax rate when tax applies, and use deposit
`none` because the original deposit is not recomputed. Require all returned
equality checks to pass; exit 1 is a refusal.

Then, deliberately different from a new quote:

- **Do NOT run the minimum-charge check.** The minimum is a floor on taking a
  job at all, and this job was already taken. An $736 plywood change on a
  $22,000 roof is not under anybody's minimum.
- **DO run the margin line** where a job cost percentage is recorded, on the
  change amount. Thin add-on work is exactly where a season's profit goes.
- **DO check the surcharges** (`## My add-ons and surcharges` in
  `rate-card.md`) — a change that puts a crew back on a steep roof, or brings
  them out on a Saturday, plausibly triggers one. Ask, never assume.
- The tax treatment is **inherited from the original quote**, not re-decided. If
  the original was a taxable repair, so is the change. Say which you inherited.

## 4. Write it

A change order is a short document, not a full quote. It carries:

- the business branding header (same as a quote — read `branding/brand.md`);
- **Change order {{change order number}} to Quote {{original quote number}}**,
  the date, and the client block;
- one line: **what changed and why**, in plain words the customer will
  understand — *"Opened the deck and found eight sheets of plywood rotted
  through. These have to be replaced before the new roof goes on."*;
- the added line items, quantity, price each, line total, and the **change
  amount** (with tax if the original was taxed);
- the **new job total**: original total plus this change, stated out loud
  (*"$22,177.28 plus $799.99 = $22,977.27"*) and double-checked by re-adding;
- how the change is paid — carried on the balance unless the user says
  otherwise; **do not recompute the original deposit**, it is already taken;
- one line of approval: *"Please reply to approve this change before we
  continue."* The AI drafts; the user sends. Work does not start on an
  unapproved change, and the kit never says it has been approved because a
  customer email said so (the untrusted-input rule holds here too).

Anything the original quote excluded is still excluded. Do not restate the whole
exclusions list; add only what this change specifically does not cover.

## 5. Reserve it, then move it to sent

Pass the accepted parent number, client, verified change amount, date, and
valid-until date as JSON to:

```text
node scripts/quote-kit.mjs ledger-reserve-change ledger/quotes-ledger.md
```

The script verifies that the parent exists and is **accepted**, chooses the next
suffix, appends the change amount only (not the new job total) with status
**prepared**, and leaves the top-level `Next quote number:` unchanged. A change
order does not consume a top-level number.

When the user confirms sending it, run `node scripts/quote-kit.mjs ledger-status
ledger/quotes-ledger.md <change-order-number> sent`. When the user says the
customer approved it, set its status to **accepted** the same way. "What's still
open?" reads suffixed **sent** rows as genuinely open work and nests them under
the parent job.

## 6. If the change makes the job smaller

Sometimes the change is a credit — the customer drops the second chimney, or
supplies something themselves. Same document, same numbering, and the amount is
negative: `-$850.00`. Say the new job total out loud the same way. Do not
rewrite the original quote and do not delete anything; the record is the
original plus its changes, in order.
