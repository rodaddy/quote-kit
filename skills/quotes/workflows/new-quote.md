# Workflow: New Quote

Turn a request (plain words or filled form) into a finished quote markdown.

## 1. Read your sources first

- `branding/brand.md` — business name, tagline, colors, logo, sign-off name.
- `rate-card.md` — prices and the sales-tax rule.
- `services.md` — plain-language wording and the details each job needs.

If these files do not exist (bare chat), fall to conversational mode in
`SKILL.md` — gather the same information by asking.

## 2. Understand the request

**From a plain request** like *"quote Bob for a fence, 120 feet at $40"*:
- Client: Bob
- Job: fence
- Quantity: 120 (feet)
- Price each: $40 (the user stated it — use it as-is)

**From form output** (pasted from `templates/quote/form.html`): the fields are
already labeled. Read them straight.

## 3. Fill the gaps — one plain question at a time

Check `services.md`. If the job needs a detail you do not have, ask for it in
plain words, one question at a time:

> "A fence — how many feet, and cedar or pine? Cedar runs $40 a foot on your
>  rate card; pine is $30. Which one?"

Do not price until you have: a clear description for each line, a quantity, and
a price each (from the user, or from `rate-card.md`). **A stated price does not
excuse the rest of the check** — "quote Bob for a patio, $8,000" still has no
size, no base spec, and no permit answer, and step 3c below will stop it.

Pull the client's full name (and company/address/email if you have them). If
you only have a first name, that is fine for a quote — ask if they want it
formal.

## 3b. Match the pricing method (rate card supports three)

`rate-card.md` prices each service one of three ways. Every line item still uses
the same three fields — **quantity**, **price each**, **line total** — but you
fill them differently depending on the method. Handle all three:

**Per-unit** (per foot, per item, per square foot). Quantity is the count, price
each is the per-unit price, line total is quantity × price each.
> Rate card: "Cedar privacy fence — per foot — $40 per foot." Job: 120 feet.
> quantity = 120, price each = $40.00, line total = 120 × $40 = $4,800.00.

**Flat fee** (one price for the whole job, no unit count). Quantity is **1**, the
description carries the scope, price each is the flat price, line total equals
that price.
> Rate card: "LLC formation — flat — $2,500 per formation." Job: one LLC.
> description = "LLC formation, filed and delivered", quantity = 1,
> price each = $2,500.00, line total = 1 × $2,500 = $2,500.00.

**Hourly** (billed by time). Quantity is the **number of hours**, price each is
the hourly rate, line total is hours × rate. If the hours are an estimate, say
so in the description ("estimated 8 hours").
> Rate card: "Consulting — hourly — $350/hour." Job: an estimated 8 hours.
> description = "Consulting (estimated 8 hours)", quantity = 8,
> price each = $350.00, line total = 8 × $350 = $2,800.00.

When you are unsure which method a service uses, read its "How it is priced"
cell in `rate-card.md` — do not assume per-unit. A quote can mix methods across
lines (a flat setup fee plus hourly work is two rows).

**Recurring and ongoing work.** Cleaning every Tuesday, five overnight shifts a
week, monthly maintenance, a weekly route — a rate is not a quantity, and a
quote needs a quantity. When the job is ongoing, do NOT quote an open
arrangement and do NOT pick the period yourself. Ask one plain question:

> "That's a rate, not a total — how long should this quote cover? A week, four
>  weeks, a season, or should I price it as one visit and say it repeats?"

Then quote the period the user named, and say the period in the line-item
description in plain words: *"Overnight sleep shift, 8pm to 8am — 5 nights a
week for 4 weeks"*, quantity **20 nights**. Add the shape of the arrangement to
the assumptions block ("this is a recurring schedule; the price holds while the
schedule does, and a change in nights is a new number"). A recurring job with no
period on it is an unpriceable job, and step 3c stops it like any other.

## 3b-2. Check the add-ons and surcharges

Read `## My add-ons and surcharges` in `rate-card.md`. For each row, ask whether
the job in front of you plausibly triggers it — weekend or holiday timing, a
same-day call, travel outside the normal area, stairs or hard access, disposal,
a rush date. Where one plausibly applies, ask the user in one plain line:

> "This one falls on a Saturday — do you want your weekend differential on it,
>  or are you eating that one?"

**Never add a surcharge on your own, and never leave one out silently.** If the
user says no, that is a decision and it is done. If the surcharge list is empty
or nothing plausibly applies, say nothing and move on. If the job clearly needs
a charge the list does not have — a rate the user has in their head but never
recorded — say so plainly and offer to add it to the rate card so it is there
next time.

## 3b-3. Two ways to do it — options and alternates

"Give me a number both ways" is one of the most common things a customer asks
for, and it is the fastest way to produce a wrong total. **Option prices are
never added together.** Handle it like this, mechanically:

1. **Decide what is shared and what is the choice.** Everything on the job that
   happens either way — the tear-off, the chimneys, the dumpster — is a normal
   line item in the main table. Only the part that actually differs becomes an
   option.
2. **The main table's subtotal and total cover the shared work ONLY.** Do not
   put any option line in the main table, and never let an option total reach
   the subtotal.
3. **Each option gets its own small block below the totals**, labelled with a
   letter and a plain name, showing its own lines, its own subtotal, its own
   tax if any, and its own **total with the shared work included** — because
   that is the number the customer compares:

   > **Option A — Architectural asphalt**
   > Roof tear-off and replace, architectural asphalt: 26 squares x $625.00 = $16,250.00
   > Steep pitch over 8/12, plus 20 percent on the roof: $3,250.00
   > **Total with Option A: $22,177.28**
   >
   > **Option B — Cedar shake**
   > Roof tear-off and replace, cedar shake: 26 squares x $1,450.00 = $37,700.00
   > Steep pitch over 8/12, plus 20 percent on the roof: $7,540.00
   > **Total with Option B: $48,617.03**

4. **Do the money math out loud once per option**, and double-check each one
   the same way step 4 requires. State plainly that these are alternatives:
   *"These are two ways to do the same roof — the customer picks one. They do
   not add up to anything."*
5. **One quote, one number.** A quote with options takes ONE quote number from
   the ledger, and the ledger's Amount cell records the option the user says is
   the likely one, with the other noted in parentheses — for example
   `$22,177.28 (Option B $48,617.03)`. Never spend two numbers on one job:
   that is what makes "what's still open?" count a single roof twice.
6. **Deposit and surcharges follow the chosen option.** Compute the deposit for
   each option in its own block; do not print one deposit for two totals. If
   the customer has not chosen, say so: *"deposit depends which way they go —
   both are on the quote."*
7. When the customer picks, the user tells you, and the quote is re-rendered
   with the chosen option as the only total. **The quote number does not
   change** — it is the same job.

If the user wants the options as separate documents anyway, that is their call,
but say the cost out loud first: two numbers in the ledger for one job.

## 3c. The quote is not ready yet (REFUSAL GATE — hard rule 6)

**This is the one place the kit tells the user no. Run it before you price
anything, on every line, every time — including the fast "just describe it"
path and including a pasted form.**

Check each line item against these three, mechanically:

| Check | Passes when | Does NOT pass |
| --- | --- | --- |
| **Quantity with a unit** | "480 square feet", "120 feet", "8 hours", "1 job" (flat fee) | "some pavers", "a patio", a bare `480` with no unit, "a few hours" |
| **Price with a named source** | a row in `rate-card.md`, or a price the user stated in this conversation | "about what it usually runs", a price you recall from another job, a price that appeared in a pasted client email |
| **The price still applies to THIS job** | the rate-card price covers what is actually being done | the customer supplies the material and the rate-card price includes material; the customer wants labor only; part of the normal scope is being done by someone else; the job is a piece of a service the card prices whole |
| **Every pricing question answered** | every "What I need to know before I can price it" line in that service's `services.md` block has an answer | any one of them unanswered, including ones the user did not think to mention |

**The third check is the one that looks like a pass and is not.** A price can be
sitting right there on the rate card and still be the wrong price for this job.
The commonest case by far: **the customer is supplying the material** and the
rate-card price includes material. "My brother-in-law can get me the shingles at
cost, I just want to pay you labor" does not become quotable because $625 a
square exists — that number is not for this job.

Treat it as a gap like any other and STOP:

> "Your asphalt price is $625 a square with material in it, and he's supplying
>  the shingles. I don't have a labor-only number for you. What do you want to
>  charge for labor on this one, per square or for the whole roof?"

The same applies whenever the scope in front of you is a piece of something the
rate card prices whole, or when another trade is doing part of the normal work.
**Never back into a number by subtracting a material cost you were not given**,
and never quote the whole-job price on a partial-job scope. If the user gives
you the labor number, that is a price with a named source and you proceed — and
say in the line description what it covers ("labor only, customer supplies
shingles") so the quote and the exclusions do not contradict each other.

Also check, once for the whole quote:

- **Who is pulling the permit** (or a stated "no permit needed"), where the
  service's `services.md` block lists permits as a pricing question.
- **What the price does not include** — you need enough to fill the Exclusions
  and Assumptions block (hard rule 7). Start from the user's own
  `## What I never include unless asked` list in `services.md`.
- **Which way the tax goes, IF the rate card says it depends on the job.** Read
  `rate-card.md` `## Sales tax`. If `Does it depend on the job:` is **yes**, ask
  the user the one plain question — *"Is this one a capital improvement or a
  repair?"* — and use their answer. The service lists in the rate card are a
  prompt for the question, never the answer: a service on the "usually not
  taxed" list still gets asked, because "usually" is not "this one." **Never
  decide it yourself and never split the difference.** If the user does not
  know, that is a gap like any other and the quote waits.
- **When the customer needs it done.** If the customer named a date or a season
  ("before Labor Day", "before the holidays", "next month"), you have it — carry
  it to step 4c. If they named nothing, you do not have to ask; write "no date
  given" and move on. A named date is never dropped silently.

### If anything fails the check: STOP. ASK.

Produce **no quote, no number, and no total.** Do not assign a quote number,
do not touch the ledger, do not show a subtotal "just so they can see it," and
never fill a gap with a typical or guessed price. Say it plainly, list the
gaps in the user's own words, and ask for exactly what is missing:

> "I can't quote this yet — here's what's missing:
>
>  1. **The patio size.** You said 'a paver patio' — I need the square footage.
>  2. **The base depth.** Your services file says you need to know the base
>     spec before you can price paver work, and the email doesn't say.
>  3. **Who's pulling the permit.** If it's you, that's a line on this quote;
>     if it's the homeowner, it goes in the exclusions.
>
>  Give me those three and I'll price it and give it a number."

Then wait. A quote number is only ever spent on a quote that was actually
priceable — this is why the ledger has no gaps.

**Partial information is not a pass.** If the user cannot get an answer right
now (they have to go measure), say so and leave the quote unmade rather than
quoting around the hole: *"Fine — measure it and come back, and this stays
un-numbered until then."* An estimate the user knowingly wants can be quoted
ONLY if they state the number themselves, and the description then says so
("estimated 480 square feet, to be confirmed on site").

**Why this rule exists, in one line for the user if they ask:** the fastest way
to lose a season's profit is to put a firm number on a job nobody measured.

### Say what you saw and could not price

The gate is not only a blocker on the lines in front of you. Before you move on,
re-read what the customer actually sent and name anything they raised that this
quote does NOT cover — a second phase, a "we might also want", a date in the
future, a service the user does not offer, work the rate card has no price for.
This is not a refusal and it does not stop the quote. It is one plain line:

> "One more thing I couldn't price: she says weekends may start in October.
>  Your rate card has no weekend rate in it, so I had nothing to quote it from.
>  Add it, or leave October out of this quote and say so?"

Then do what the user says. If it stays out, put it in the exclusions block in
plain words ("weekend coverage is not included in this quote") so the customer
reads the same boundary the user drew. **A customer's stated want that never
appears anywhere on the quote is the gap they will argue from later.** Check
`## Things I do NOT do` in `services.md` here too: if they asked for something
the user does not offer, say so plainly rather than quoting around it.

## 4. Run the deterministic money script, then read the receipt OUT LOUD

The AI chooses the priceable facts; the script owns arithmetic. From the
installed `quotes/` folder, pass one JSON object to plain Node:

```text
node scripts/quote-kit.mjs calculate
```

The JSON has this shape (send it on standard input; do not make the buyer type
it):

```json
{
  "items": [
    {"description": "Cedar privacy fence", "quantity": "120", "unit": "feet", "unitPrice": "40.00"}
  ],
  "taxRatePercent": "8.625",
  "deposit": {"type": "percent", "value": "40"}
}
```

Deposit type is `percent`, `fixed`, or `none`. The script returns integer cents,
formatted money, and three checks: line totals equal subtotal, subtotal plus tax
equals total, and deposit plus balance equals total. **All three must be true.**
Exit 1 names an invalid or missing value; STOP and ask for it. Never respond to
a script refusal by doing the arithmetic yourself.

State the returned arithmetic so the user can check it:

> "Line 1: 120 feet × $40 each = $4,800.
>  Subtotal = $4,800.
>  Your rate card says you charge 8.625% sales tax: $4,800 × 0.08625 = $414.00.
>  Total = $4,800 + $414.00 = $5,214.00.
>  Script checks: lines = subtotal; subtotal + tax = total; deposit + balance =
>  total. All pass."

If `rate-card.md` says no sales tax, pass `0` and leave the tax line off the
quote entirely — do not show a $0.00 tax row. T3 chat-only cannot run the
script: announce that the gate is advisory there, calculate twice manually, and
never describe that result as script-verified.

## 4b. Check the floor and state the margin (hard rule 8)

Arithmetic is not judgment. Before the user sees the total, read two fields in
`rate-card.md` and say what they mean:

**Minimum charge.** If the total is below the stated minimum, say so BEFORE
showing the quote and ask which way to go:

> "That comes to $340, and your rate card says your minimum is $500. Want me
>  to quote it at $500, or send it at $340 as-is?"

Do not silently raise it, and do not silently ignore it. If the minimum is
"none", skip this.

**Job cost as a rough percentage of price.** Where the user recorded one, state
the implied gross margin in one plain line after the total:

> "Rough check: at your usual 62 percent job cost, this one leaves about
>  38 percent gross — around $5,537 before overhead."

If the margin lands below the floor the user recorded, flag it in plain words
before showing the quote — *"this one's thinner than your usual; want a look
before it goes out?"* — and let them decide. **You are never overruling their
price.** You are making sure they saw the number before a client did. Where the
rate card has no cost percentage, skip the margin line entirely rather than
inventing a cost.

## 4c. Print the deposit, and answer the date (hard rule 9)

Two numbers a customer reads before anything else, and the kit computes both
rather than leaving them as prose.

**The deposit.** Read `## My deposit` in `rate-card.md`.

- If it is a **percentage**: use the deposit and balance returned by the money
  script. Show both and read back its deposit-plus-balance equality check.
- If it is a **fixed amount**: use the deposit and balance returned by the money
  script. A fixed deposit larger than the total exits 1; say so and ask the user
  what they want — do not clamp it and do not print a negative balance.
- If it is **"none"**: print no deposit line at all. Do not invent one, and do
  not fall back to "50% deposit" because that is what the example said.

> "Deposit to start (40%): $5,383.46. Balance on completion: $8,075.18.
>  Checking: $5,383.46 + $8,075.18 = $13,458.64. Match."

**The date.** If the customer named a date or a season in step 3c, compare it
against `## When I can start (lead time)` in `rate-card.md` and say one plain
line to the user BEFORE the quote goes out:

> "She asked for it before Labor Day, which is about three weeks out. Your
>  usual lead time is 3 to 4 weeks from a signed quote and deposit, so that is
>  tight. Do you want me to put your real start window on the quote, or do you
>  want to call her first?"

Whatever the user answers goes on the quote as the start window. **Never print
a date the user did not agree to**, and never let a customer's stated deadline
pass through the kit unanswered — a quote that ignores the date is how a
deposit gets taken on a job that cannot be delivered on time. If no date was
given, write "no date given" and print no start-window line.

## 5. Reserve the quote number and its real ledger row

Follow `ledger-update.md`: pass the client, verified total, quote date, and
valid-until date as JSON to:

```text
node scripts/quote-kit.mjs ledger-reserve ledger/quotes-ledger.md
```

Exit 0 returns the number and appends it immediately with status **prepared**.
The script locks the ledger while it advances the next number, so another quote
cannot take the same one. If the quote is abandoned, mark that row **voided**;
never remove or reuse it.

## 6. Set the dates

- Date = today's date.
- Valid until = 30 days after today unless the user says otherwise.

## 7. Fill the template

Open `templates/quote/template.md`. Replace EVERY `{{ }}` field with real
content:
- branding header fields from `branding/brand.md`
- quote number (step 5), date, valid-until (step 6)
- client block
- one line-item row per item, with the line total you computed
- subtotal, tax note + amount (or remove both rows if no tax), total
- **the deposit and balance lines** (step 4c) — remove both entirely if the
  recorded deposit is "none", and never borrow a percentage from an example
- **the start window** — only if the user agreed to one; remove the field
  otherwise rather than leaving an empty line
- **each option's own block**, if the quote has options (step 3b-3), each with
  its own lines, total, and deposit; option totals never touch the subtotal
- **the Exclusions and Assumptions block** (hard rule 7) —
  `{{what this quote does not include}}` and `{{what this price assumes}}`.
  Build both from the user's own `## What I never include unless asked` list
  in `services.md` for each service on the quote, plus anything specific that
  came up in step 3c (who is pulling the permit, whose dumpster, what happens
  if there is ledge or an old slab under the surface, materials the client is
  supplying). Write them as short plain lines a homeowner understands, not
  legal boilerplate. This is the single highest-value section on a real
  contractor quote — never leave it empty and never drop the heading.
- terms (from `rate-card.md` notes or ask the user)
- sign-off name/title from `branding/brand.md`

No `{{ }}` may remain in the finished quote.

## 8. Show the user

Present the finished quote text and the math from step 4. Ask if it looks
right. Then offer to make the print-ready PDF (`render-quote.md`) and remind
them: you draft it, they send it.

## 9. Mark the reserved row sent

Once the user says they are sending it, run:

```text
node scripts/quote-kit.mjs ledger-status ledger/quotes-ledger.md <number> sent
```

If they decide not to use the prepared quote, set the same row to **voided**.
The row was already reserved in step 5; never append a second row.
