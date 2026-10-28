# How Quote Kit was built

Quote Kit was developed inside the author's private consulting repository and
published here as a single snapshot, so this repo's git log is short. The
history below comes from the kit's CHANGELOG (1.0 to 1.1.5), the commits that
touched the kit in the private repository (2026-07-30 to 2026-10-20), and two
internal review reports from August 2026: a kit quality review on 2026-08-11
and a multi-round buyer dry-run report on 2026-08-12. Every buyer in those
reports was simulated by an AI agent; none was a real customer.

## The problem and the first version

A small trade or service business writes quotes in a word processor, numbers
them by memory, adds the totals by hand, and has no record of which quotes
went out and what became of them. Version 1.0 (2026-07-15) was an AI agent
skill that turns a plain description of a job, or the output of an offline
form, into a branded, numbered quote with double-checked money math, logged in
a ledger, and ready to print to PDF. It is one of a line of small-business
kits held to a shared kit standard: install instructions for several AI
harnesses, a start-here card, a refusal rule, and an acceptance checklist.

## Timeline

| Date | Version | What changed |
| --- | --- | --- |
| 2026-07-15 | 1.0 | Description or form output to a branded, numbered, ledger-logged quote. |
| 2026-07-15 | 1.1 | Path overhaul, a version-aware upgrade path, fixes from a GPT model review, `START-HERE.md`, thousands-separator parsing in `form.html`, voided and expired ledger statuses. |
| 2026-08-11 | | Kit quality review: verdict "rework". |
| 2026-08-12 | 1.1.1 | Rework: a pre-quote refusal gate, a mandatory exclusions and assumptions block. |
| 2026-08-12 | 1.1.2 | Three rounds of simulated buyers, each round fixing what the last found. |
| 2026-08-13 | 1.1.3 | Money math, numbering and ledger state moved out of prose into `quote-kit.mjs`, a plain-Node script. |
| 2026-08-17 | 1.1.4 | Fixes from a cross-family model review: the offline form could export an invalid quote, an orphaned lock could stop numbering for good, status changes were unconstrained. |
| 2026-10-20 | 1.1.5 | Pages carry a favicon. |

## Key design decisions

- **Refuse an underspecified quote.** The 2026-08-11 review found that the kit
  never said no: it would faithfully quote a job at a price that lost money,
  with no exclusions and no question about who pulls the permit. The rework
  added a gate before pricing. Each line needs a quantity with a unit, a price
  with a named source, and an answer to every "what I need to know before I
  can price it" question for that service. Missing any of these, the kit lists
  the gaps and produces no number at all.
- **Exclusions come from the owner's own trade.** The quote template gained
  "what this quote does not include" and "what this price assumes" sections,
  filled from a per-service list the owner writes at install, not from the
  model's general knowledge.
- **A script owns the arithmetic (1.1.3).** `quote-kit.mjs` does integer-cent
  money math, deposit validation, locked quote and change-order numbering,
  status changes, old-ledger migration and expiry. The model writes the words;
  the script does the numbers. It needs no install step, no npm packages and
  no build.
- **One documented lifecycle, enforced.** Before 1.1.4 the lifecycle was
  described in four files and enforced in none. Now a quote moves prepared to
  sent to accepted, declined or expired, can be voided while live, and closed
  rows are final.

## How AI models and agents were used

- The kit is itself an agent skill, and it was built and maintained by AI
  coding agents under the author's direction.
- **Quality review (2026-08-11).** Eight kits were each dry-run by an agent
  against a realistic small-business scenario and scored on a ten-point
  rubric. For Quote Kit the agent ran the full new-quote, ledger and render
  chain for a landscaping job and checked the math twice. The kit scored
  below standard on domain judgment and on refusal.
- **Buyer dry-runs (2026-08-12).** One agent lane ran the kit as three
  successive simulated buyers (a heating contractor, a home-care agency and a
  roofer), fixed what each round found in the kit's own files, and then sent
  a harder buyer at the fixed version. The report marks every result as
  "verified by simulated buyers, not by a real buyer".
- **Cross-family review (2026-08-17).** A Claude model and a GPT model
  reviewed the 1.1.3 code independently. Every test added in 1.1.4 was
  confirmed to fail against 1.1.3 before the fix landed.

## How it is tested

- `node --test tests/*.test.mjs`: 13 tests, passing on 2026-10-27. They cover
  the arithmetic, numbering, lock and lifecycle rules in `quote-kit.mjs`.
- `tests/form-html.test.mjs` runs the real inline script from the shipped
  `form.html` against a minimal DOM stand-in, to prove export refuses a quote
  that is no longer valid.
- `verify-kit.mjs` checks the package's structure and fails if `kit.json`
  drifts from `VERSION`. Its "form must stay offline" rule allows the inline
  `data:` favicon, and it skips a git checkout's `.git` folder.

## What did not work, and what changed

- **A gate that wore the look of a check.** In the third simulated round the
  new refusal gate returned a false pass: a per-unit price that included
  materials passed the "named source" test on a job where the customer was
  supplying the materials. The report notes that a gate returning a false
  pass is more dangerous than no gate. A fourth gate row was added, "the price
  still applies to this job", along with a rule against backing into a
  labour-only price by subtraction.
- **Shapes the rate card could not hold.** Weekend surcharges, recurring work
  and quotes offering two options all came up in the dry runs with nowhere to
  go. Two options would have added both totals together. Each got its own
  section, and a two-option quote keeps one quote number.
- **Change orders were promised on every quote and implemented nowhere.** A
  change-order workflow with child numbering (for example `0068-A`) was added.
- **A crash could stop numbering for good.** An interrupted reservation left a
  lock directory that nothing could clear. 1.1.4 records the lock's owner and
  time and reclaims an orphaned lock automatically. It still refuses to force
  open a lock held by a live process.
- **The form exported a quote it had already refused.** Copy and Download
  only checked that some text existed. Any edit now clears the old quote, and
  export re-runs the checks.

## Current state

Stable at 1.1.5, published for review under a non-commercial licence. Open
items from the August reports that only a real buyer can close: a cold install
on each supported harness, and a check by someone who knows New York sales tax
of the capital-improvement wording.
