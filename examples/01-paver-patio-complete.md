# Worked example 1 — the everyday run, start to finish

**Business:** Vitale Landscaping and Masonry, Ronkonkoma NY (invented for this
example). Prices below come from their filled `rate-card.md`.

This is the whole flow on one job: a customer email arrives, the kit refuses to
price it until it has what it needs, gets the answers, does the math out loud,
checks the floor and the margin, writes the exclusions, numbers it from the
ledger, and logs it.

---

## What went in

The owner pasted this into the chat and said "quote this":

> Hi — got your name from my neighbor on Ronkonkoma Ave. We're looking to
> replace the concrete slab out back with pavers. It's roughly 20 by 24. Old
> slab would have to come out. Also we get a puddle by the back door every
> time it rains, my neighbor said you put in a dry well for him. Can you send
> me a price?
>
> Thanks,
> Anthony DiMarco
> 14 Sycamore Ln, Nesconset

---

## What the kit did first: it did not quote

Their `services.md` block for paver patios lists three things it needs before
pricing: square footage, the base spec, and who is pulling the permit. Two were
missing, so the kit stopped (`workflows/new-quote.md` step 3c) instead of
producing a number:

> I can't quote this yet — here's what's missing:
>
> 1. **The base spec.** He says 20 by 24, which gives me 480 square feet, but
>    your services file says you need to know the base depth before you can
>    price paver work. Standard 6 inch, or something heavier for this one?
> 2. **The permit.** Nesconset is Town of Smithtown. Your file says permits are
>    the customer's unless stated — is that how you want this one written?
> 3. **The dry well.** He's asking for one but hasn't said where the water
>    goes. Your rate card has a flat price for a standard dry well — is this a
>    standard one?
>
> Give me those three and I'll price it and give it a number.

The owner answered: standard 6 inch base; permit is on the homeowner; standard
dry well, flat price.

**No quote number was assigned during any of the above.** Numbers are only
spent on a job that was actually priceable.

---

## The math, out loud

> Line 1: 480 square feet paver patio installed x $22.00 each = $10,560.00
> Line 2: 480 square feet concrete slab removal x $4.50 each = $2,160.00
> Line 3: dry well, standard, flat = $1,850.00
>
> Subtotal = $10,560.00 + $2,160.00 + $1,850.00 = $14,570.00
> Re-adding to check: $10,560.00 + $2,160.00 = $12,720.00; $12,720.00 +
> $1,850.00 = $14,570.00. Match.
>
> Your rate card says the tax depends on the job, so: is this one a capital
> improvement or a repair?

Owner: capital improvement, it's a new patio.

> Then no tax line, and your `services.md` says you collect a signed ST-124
> before invoicing on those. I'll put the note on the quote.
>
> **Total = $14,570.00**

## The floor and margin check

> Your minimum is $500 — no issue here. At the 62 percent job cost you gave me,
> this one leaves roughly 38 percent gross, about $5,537 before overhead. That's
> above the 30 percent floor you set, so nothing to flag.

## The exclusions, read back

> Before I number it — here's what this quote says it does NOT cover, pulled
> from your own list: permit and permit fees, marking underground utilities,
> lawn and sprinkler repair where we work, and anything we find under the old
> slab. And it assumes truck access to the back yard, no ledge in the dry well
> dig, and one visit. Right for this job?

Owner: yes, add that the paver color has to be picked before we order.

## The deposit and the date

> Your deposit is 50 percent, so: deposit to start $7,285.00, balance on
> completion $7,285.00. Checking: $7,285.00 + $7,285.00 = $14,570.00. Match.
>
> He didn't name a date, so I'm not putting a start window on it unless you want
> one. Your lead time is about six weeks — say the word and I'll write it.

Owner: put the week of September 22 on it.

---

## What came out

Quote **0044** — the ledger's highest row was 0043, so the next number is 0044.
Rendered to `~/Documents/quote-kit/RTC-0044-DiMarco.html`, opened in the browser,
Print to PDF.

```
QUOTE

Vitale Landscaping and Masonry
Stonework and grounds, Long Island since 2009
118 Portion Rd - Ronkonkoma, NY 11779
(631) 555-0142 - anthony@vitalelm.example

Quote number: 0044
Date: 2026-08-11
Valid until: 2026-09-10

Prepared for:
Anthony DiMarco
14 Sycamore Ln, Nesconset, NY 11767

WHAT WE ARE QUOTING

Description                                        Qty     Price each   Line total
Paver patio, installed - 6 inch compacted base     480 sq ft   $22.00    $10,560.00
Concrete slab removal and disposal                 480 sq ft    $4.50     $2,160.00
Dry well, standard - installed and connected       1 job    $1,850.00     $1,850.00

                                              Subtotal                   $14,570.00
                                              Total                      $14,570.00

                                     Deposit to start (50%)               $7,285.00
                                     Balance on completion                $7,285.00

We can start the week of September 22.

TERMS

Balance on completion. Quote valid 30 days. Materials
included. This work is a capital improvement; a signed Form ST-124 is required
before invoicing, and no sales tax is charged on this quote.

WHAT THIS QUOTE DOES NOT INCLUDE

- Town of Smithtown permit and permit fees - these are the homeowner's
- Marking underground utilities before we dig
- Repair to lawn, plantings, or sprinkler lines in the work area
- Anything found under the existing slab - old footings, buried pipe, fill
- Electrical or lighting work

WHAT THIS PRICE ASSUMES

- Truck and trailer access to the back yard
- No ledge or rock in the dry well excavation
- The work is done in one visit, normal weekday hours
- Paver color and style selected before we order material
- Material prices as of today; this quote is good for 30 days

If something on this list turns out differently once we are on site, we will
come back to you with the change in writing before doing the work - the price
above does not move on its own.

This quote is valid until 2026-09-10. To accept, reply to this quote or contact
us at (631) 555-0142 or anthony@vitalelm.example.

Thank you for the opportunity to work with you.

Anthony Vitale, Owner
Vitale Landscaping and Masonry
```

## And the ledger row

| Quote # | Client | Amount | Date | Valid until | Status |
| --- | --- | ---: | --- | --- | --- |
| 0044 | Anthony DiMarco (Nesconset) | $14,570.00 | 2026-08-11 | 2026-09-10 | sent |

Next quote number in the ledger header updated to **0045**.

---

## What to notice

1. **The stop came before the number.** Three questions, asked once, in plain
   words. The customer's email looked complete and was not.
2. **The exclusions block is the part a contractor actually needs.** "Anything
   found under the existing slab" is the line that decides who pays when there
   are old footings under there.
3. **The margin line is a mirror, not a veto.** It told the owner what the job
   leaves before the customer saw the price. It never changed the price.
