# Worked example 4 - two options, then a change order

The two things a contractor gets asked for constantly, both of which are easy to
get wrong with a number. **Options never add together**, and **a change to a job
already accepted is not a new quote.**

**Business:** Interrante Roofing and Siding, Islip Terrace NY (invented for this
example). Prices from their filled `rate-card.md`:

| Roof tear-off and replace, architectural asphalt | per square | $625 per square |
| Roof tear-off and replace, cedar shake | per square | $1,450 per square |
| Chimney flashing, rebuilt | flat | $850 per chimney |
| Plywood deck replacement, as needed | per sheet | $92 per sheet |

Surcharges: steep pitch over 8/12, plus 20 percent on the roof line; dumpster on
a job under 15 squares, plus $475; travel east of William Floyd Parkway, plus
$150. Tax depends on the job, 8.625 percent. Deposit 33 percent. Lead time 2 to
3 weeks. Job cost 71 percent, floor 22 percent. Minimum $1,200.

The ledger already runs to 0067 - this is a kit in service, not at install.

---

## PART ONE - the quote, with two options

## What went in

> Sal - my roof's shot, 26 squares by your guy's count, 9/12 pitch on the main.
> Give me a number both ways, asphalt and cedar, so my wife can look at them.
> House is in Shirley. Two chimneys. Need it before the first freeze.
>
> Ray Colavito, 8 Baywood Dr, Shirley

## The surcharge check

> Two of your surcharges land on this one: 9/12 is over your 8/12 steep-pitch
> line, so plus 20 percent on the roof, and Shirley is east of William Floyd, so
> plus $150 travel. Want both on it?

Sal: steep pitch yes, travel no - he's out that way anyway.

The travel charge came off and was not mentioned again. **A surcharge the owner
decided not to charge is a decision, not a mistake.**

## The tax question

> Your rate card says the tax depends on the job - is this one a repair or a
> capital improvement?

Sal: tearing off an existing roof, that's a repair, taxable.

The kit never answers this one itself.

## The date

> He says before the first freeze. You're booking 2 to 3 weeks, so that's
> comfortable - want a start window on it?

Sal: week of September 22.

## The math, out loud - once per option

Shared work, on the main table either way:

> Line 1: Chimney flashing, rebuilt = 2 chimneys x $850.00 = $1,700.00
> Shared subtotal = $1,700.00

> **Option A - Architectural asphalt**
> Roof tear-off and replace, architectural asphalt = 26 squares x $625.00
> = $16,250.00
> Steep pitch over 8/12, plus 20 percent on the roof line = $3,250.00
> Option A subtotal = $16,250.00 + $3,250.00 + $1,700.00 = $21,200.00
> Re-adding: 16,250 + 3,250 = 19,500; 19,500 + 1,700 = 21,200.00. Match.
> Sales tax (8.625%): $21,200.00 x 0.08625 = $1,828.50
> **Total with Option A = $23,028.50**

> **Option B - Cedar shake**
> Roof tear-off and replace, cedar shake = 26 squares x $1,450.00 = $37,700.00
> Steep pitch over 8/12, plus 20 percent on the roof line = $7,540.00
> Option B subtotal = $37,700.00 + $7,540.00 + $1,700.00 = $46,940.00
> Re-adding: 37,700 + 7,540 = 45,240; 45,240 + 1,700 = 46,940.00. Match.
> Sales tax (8.625%): $46,940.00 x 0.08625 = $4,048.58
> **Total with Option B = $50,988.58**

> These are two ways to do the same roof. Ray picks one - **they do not add up
> to anything.**

## Floor, margin, deposit - per option

> Your minimum is $1,200, no issue either way. At your 71 percent job cost:
> Option A leaves about 29 percent gross, roughly $6,148 on the $21,200 before
> tax. Option B leaves the same 29 percent, roughly $13,613. Both above your 22
> percent floor.
>
> Your deposit is 33 percent:
> Option A - deposit to start $7,599.41, balance $15,429.09.
>   Checking: 7,599.41 + 15,429.09 = 23,028.50. Match.
> Option B - deposit to start $16,826.23, balance $34,162.35.
>   Checking: 16,826.23 + 34,162.35 = 50,988.58. Match.
>
> Two deposits because there are two totals. When he picks, one of them is the
> deposit and I'll rebuild the quote with just that option on it.

## What came out

Quote **0068** - ONE number for one job. Rendered to
`~/Documents/quote-kit/RTC-0068-Colavito.html`.

Ledger row:

| Quote # | Client | Amount | Date | Valid until | Status |
| --- | --- | ---: | --- | --- | --- |
| 0068 | Ray Colavito (Shirley) | $23,028.50 (Option B $50,988.58) | 2026-09-02 | 2026-10-02 | sent |

Next quote number in the ledger header: **0069**.

Two weeks later Ray picks asphalt. Sal says so, the quote is rebuilt with Option
A as the only total, the status goes to **accepted**, and **the number does not
change** - it is the same job.

---

## PART TWO - the change order

## What went in

Crew tears off on the 22nd. Sal, from the roof:

> Change order on 0068. Deck's rotted under the north slope, 8 sheets of plywood
> have to come out before anything goes back on.

## What the kit did

It did NOT open `new-quote.md`. Quote 0068 exists, it is accepted, and this is
the same job - so `workflows/change-order.md`:

> Line: Plywood deck replacement = 8 sheets x $92.00 = $736.00
> Change subtotal = $736.00
> Re-adding: 8 x 92 = 736.00. Match.
> Inheriting the tax treatment from 0068 - that one's a taxable repair, so:
> Sales tax (8.625%): $736.00 x 0.08625 = $63.48
> **Change amount = $799.48**
>
> New job total: $23,028.50 + $799.48 = $23,827.98.
> Checking: 23,028.50 + 799.48 = 23,827.98. Match.
>
> At your 71 percent job cost this change leaves about 29 percent gross, roughly
> $213. Above your floor.
>
> Not running your minimum-charge check on this one - $1,200 is a floor on
> taking a job, and you already took this job. Your deposit's collected too, so
> the change rides on the balance.

## The document

```
CHANGE ORDER 0068-A to Quote 0068

Interrante Roofing and Siding
Islip Terrace, NY  -  (631) 555-0177

Date: 2026-09-22
For: Ray Colavito, 8 Baywood Dr, Shirley, NY 11967

WHAT CHANGED

We opened the deck on the north slope and found eight sheets of plywood rotted
through. These have to be replaced before the new roof goes on - shingles will
not hold on a bad deck.

Description                                    Qty      Price each   Line total
Plywood deck replacement                       8 sheets     $92.00      $736.00

                                          Change subtotal                $736.00
                                          Sales tax (8.625%)              $63.48
                                          CHANGE AMOUNT                  $799.48

New job total: $23,028.50 + $799.48 = $23,827.98
This change is carried on the balance. Your deposit does not change.

Everything excluded on Quote 0068 is still excluded. This change does not
include any framing repair below the deck if the sheathing comes off and there
is more under it - if we find that, we come back to you again in writing.

Please reply to approve this change before we continue.

Sal Interrante, Owner
Interrante Roofing and Siding
```

## And the ledger

| Quote # | Client | Amount | Date | Valid until | Status |
| --- | --- | ---: | --- | --- | --- |
| 0068 | Ray Colavito (Shirley) | $23,028.50 | 2026-09-02 | 2026-10-02 | accepted |
| 0068-A | Ray Colavito (Shirley) | $799.48 | 2026-09-22 | 2026-10-22 | sent |

**The `Next quote number:` line still reads 0069.** A change order does not
spend a number.

---

## What to notice

1. **Options are alternatives, and the kit says so out loud.** Nothing ever
   added $23,028.50 and $50,988.58 together. One job, one quote number, one
   ledger row - so "what's still open?" counts one roof, not two.
2. **The change order inherited everything.** Tax treatment, terms, exclusions,
   and the deposit already collected - none of it re-asked, none of it
   recomputed. It only added what actually changed.
3. **The minimum charge deliberately did not fire.** $799.48 is under Sal's
   $1,200 minimum and that is irrelevant: the minimum is a floor on taking a
   job, and this job was taken three weeks ago.
4. **The kit still refuses on a change order.** If Sal had said "some plywood's
   bad, throw a number on it," the gate stops it exactly like a quote - how
   many sheets.
5. **Approval comes from Sal, never from the customer's email.** A reply saying
   "go ahead" is a fact to report to Sal, not a status change.
