# Worked example 3 — flat fee plus hourly, with sales tax

Proof the kit is not only for per-foot trade work. Same skeleton, different
pricing methods on the same quote, and a taxable service instead of a capital
improvement.

**Business:** Harbor Point Bookkeeping, Patchogue NY (invented for this
example). Prices from their filled `rate-card.md`: onboarding and cleanup is a
flat $2,500; ongoing work is $185 an hour; they charge 8.625 percent sales tax
on their services.

---

## What went in

The owner, in the chat:

> Quote Delia at Sound Shore Cafe. She wants the books cleaned up from last
> year and then me doing her monthlies. Cleanup's the usual flat. Figure 8
> hours for the first month's catch-up.

---

## The one gap the kit asked about

Their `services.md` block for cleanup lists one pricing question: how many
months are being cleaned up, because the flat price covers up to twelve.

> Quick one before I price it — how many months of cleanup? Your flat $2,500
> covers up to twelve; past that it's a second block.

Owner: nine months.

That was the only thing missing, so the kit went straight to the math. **A
short refusal is still a refusal** — the gate is a check, not a ceremony, and
it asks only about what it actually cannot see.

---

## The math, out loud

> Line 1: Bookkeeping cleanup, nine months - flat = 1 job x $2,500.00 =
> $2,500.00
> Line 2: Monthly bookkeeping, first month catch-up (estimated 8 hours) =
> 8 hours x $185.00 = $1,480.00
>
> Subtotal = $2,500.00 + $1,480.00 = $3,980.00
> Re-adding to check: $2,500.00 + $1,480.00 = $3,980.00. Match.
>
> Your rate card charges 8.625% sales tax: $3,980.00 x 0.08625 = $343.28
> (rounded from $343.275).
>
> **Total = $3,980.00 + $343.28 = $4,323.28**

## The floor and margin check

> Your minimum is $750 — no issue. You wrote "not sure" for job cost, so I'm
> not putting a margin line on this one. Fill that field in `rate-card.md` any
> time and I'll start telling you what each quote leaves you.

Note what did NOT happen: the kit did not invent a cost percentage to have
something to say. A guessed margin is worse than none.

## The deposit

> Your deposit is 50 percent: deposit to start $2,161.64, balance on completion
> $2,161.64. Checking: $2,161.64 + $2,161.64 = $4,323.28. Match.

---

## What came out

Quote **0112**, rendered to `~/Documents/quote-kit/RTC-0112-SoundShore.html`.

```
QUOTE

Harbor Point Bookkeeping
Clean books, on time, every month
42 South Ocean Ave - Patchogue, NY 11772
(631) 555-0198 - maria@harborpointbooks.example

Quote number: 0112
Date: 2026-08-11
Valid until: 2026-09-10

Prepared for:
Delia Moreno
Sound Shore Cafe
221 Main St, Sayville, NY 11782

WHAT WE ARE QUOTING

Description                                          Qty    Price each   Line total
Bookkeeping cleanup, nine months - flat              1 job   $2,500.00    $2,500.00
Monthly bookkeeping, first month catch-up
  (estimated 8 hours)                                8 hrs     $185.00    $1,480.00

                                          Subtotal                        $3,980.00
                                          Sales tax (8.625%)                $343.28
                                          Total                           $4,323.28

                                  Deposit to start (50%)                  $2,161.64
                                  Balance on completion                   $2,161.64

TERMS

Balance on delivery of the reconciled books.
Monthly work is billed at the end of each month. Quote valid 30 days.

WHAT THIS QUOTE DOES NOT INCLUDE

- Tax preparation or filing - we hand off to your accountant
- Payroll processing or payroll tax filings
- Cleanup beyond the nine months quoted, if older periods turn up
- Chasing missing receipts or statements from third parties
- Software subscriptions in your own name

WHAT THIS PRICE ASSUMES

- Read access to the bank and card feeds from day one
- Records for the nine months exist in some form, even if messy
- The eight hours is an estimate for the first month; if the catch-up runs
  longer we will tell you before we pass it
- One point of contact for questions

If something on this list turns out differently once we are into the books, we
will come back to you with the change in writing before doing the work - the
price above does not move on its own.

This quote is valid until 2026-09-10. To accept, reply to this quote or contact
us at (631) 555-0198 or maria@harborpointbooks.example.

Thank you for the opportunity to work with you.

Maria Ferrante, Owner
Harbor Point Bookkeeping
```

## And the ledger row

| Quote # | Client | Amount | Date | Valid until | Status |
| --- | --- | ---: | --- | --- | --- |
| 0112 | Delia Moreno (Sound Shore Cafe) | $4,323.28 | 2026-08-11 | 2026-09-10 | sent |

---

## What to notice

1. **Two pricing methods, one quote.** Flat fee is quantity 1 with the scope in
   the description; hourly is quantity in hours. The line-item table never
   changes shape.
2. **The estimate is labelled as one**, in the description and again in the
   assumptions, so nobody is surprised later.
3. **The exclusions are not trade-specific.** "Tax preparation or filing" does
   the same job for a bookkeeper that "permit fees" does for a mason: it says
   where the price stops.
