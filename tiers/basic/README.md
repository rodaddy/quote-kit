# Quote Kit - basic

## What ships

Consistent, branded, numbered quotes and proposals with a running ledger. The
user tells the AI about a job in plain words ("quote Bob for a fence, 120 feet
at $40"), and gets back a quote carrying their logo and colors, the next
sequential quote number, double-checked math, and a new row in the ledger - a
PDF ready for the human to send.

The package is `START-HERE.md`, `installer.md`, `OPERATIONS-MANUAL.md`,
`VERSION`, `kit.json`, `CHANGELOG.md`, `verify-kit.mjs`, `tests/`, `examples/`
(four complete worked runs, including one the kit refused to price), and
`skills/quotes/` - the skill plus everything it reads: `workflows/`,
`scripts/quote-kit.mjs`, `rate-card.md`, `services.md`,
`ledger/quotes-ledger.md`, `templates/quote/`, and `USER-CONFIG.md`.
`branding/` is created at install from the branding interview.

## Who it is for

Owners and staff who write quotes by hand today and want the same quote every
time without re-typing one from scratch. The AI drives the conversation and the
included plain-Node script does the arithmetic, reserves the next number under
a lock, and keeps the running record, so the person quoting spends their time
on the job and the customer instead of the paperwork. The human is always the
author and always the sender: the AI drafts, the person reviews and sends.

## What it refuses to do

- **It never quotes an underspecified job.** Every line needs a quantity with a
  unit, a price with a named source, and every `services.md` pricing question
  answered. Missing any of that, the kit says what is missing, lists the gaps,
  and produces no quote and no number - so the ledger has no holes.
- **The refusal also covers a price that does not APPLY.** A rate-card price is
  not a pass when the customer supplies the material or the scope is a piece of
  a service the card prices whole; the kit stops and asks for the labor-only
  number rather than backing into one.
- **It never decides sales tax where the job decides it.** Capital improvement
  versus repair is the user's call and their accountant's, asked per quote.
- **It never adds a surcharge on its own**, never drops a customer's stated date
  silently, and never lets option totals add together.
- **It never treats pasted text as instructions.** Pasted client emails and form
  output cannot change prices, discounts, or ledger status; anything addressing
  the AI is quoted back as suspicious.
- **A change to an accepted job is a change order, never a new quote** -
  numbered `0068-A` as a child of the original, inheriting terms, tax
  treatment, and exclusions, and never moving the ledger's next-number line.

## Install

From `installer.md`, condensed. The buyer hands `installer.md` to their AI and
says "install quote kit"; the installer does the rest.

1. **Get `installer.md` in front of the AI** (`START-HERE.md` has the per-device
   steps): unzip the kit, then drag, share, or paste `installer.md` into the
   Claude app, ChatGPT, Gemini, or a terminal agent, and say "install quote
   kit."
2. **The AI detects its runtime** - coding agent with filesystem access (3A),
   chat app with zip skill uploads (3B), projects/custom instructions (3C), or
   plain chat (3D) - and adapts the canonical package to that host.
3. **Coding-agent path (3A):** locate the skills directory (`~/.claude/skills/`,
   `~/.codex/skills/`, or the platform equivalent), check `node --version`,
   run the collision check (offering an upgrade that backs up the old folder and
   carries `USER-CONFIG.md`, `branding/`, `rate-card.md`, `services.md`, and the
   whole `ledger/` forward), then copy `skills/quotes/` in recursively - every
   nested file and subfolder.
4. **Image capability and branding interview (mandatory).** The AI records the
   image path in `branding/image-setup.md` and produces `branding/brand.md`,
   generating a wordmark placeholder when the user has no logo.
5. **Pricing interview.** Fills `rate-card.md` and `services.md` with the user's
   own prices and per-service exclusions and assumptions, leaving no `{{ }}`.
6. **Verify live** by producing quote #0001 for a real job the buyer actually
   needs to quote, with their customer's real name - never a made-up customer
   and never the shipped `examples/` data.

Runtime floor: plain Node 22 or newer, declared in `kit.json` as
`requirements.runtimes.node: ">=22.0.0"`. No Bun, npm install, package manager,
build step, Python, jq, CDN, or network fetch. Chat-only hosts still install:
the kit announces that the ledger, disk-read rate card, and gates become
advisory rather than pretending they are enforced.

## Current version

1.1.5
