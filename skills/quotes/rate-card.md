# Rate Card

This file holds WHAT YOU CHARGE — your prices, your sales-tax rule, and any
minimum. New quotes read this file and price the job from it automatically.
Change a price here and every quote after that uses the new number. The
installer fills this in by asking you a few questions; you can also edit it by
hand any time.

The companion file `services.md` says what each service IS, in plain words.
This file says what each one COSTS.

---

## How I charge

Pick the way (or ways) you price work. Delete the ones you do not use.

- Pricing method: {{how you charge — by the hour, a flat price per job, or per unit (per foot, per item, per square foot)}}

## My prices

One line per service. Fill in the plain name, how it is priced, and the price.

| Service name | How it is priced | Price |
| --- | --- | ---: |
| {{first service name, for example "Cedar privacy fence"}} | {{how priced, for example "per foot"}} | {{price, for example "$40 per foot"}} |
| {{second service name}} | {{how priced}} | {{price}} |
| {{third service name}} | {{how priced}} | {{price}} |

Add as many rows as you need. Remove the ones you do not use.

## My add-ons and surcharges

The extras that ride on top of a normal price. Almost every business has at
least one and almost nobody writes it down, which is exactly why it gets
forgotten on the quote and eaten on the job.

One line each: what it is, when it applies, and how it is charged.

| What it is | When it applies | How it is charged |
| --- | --- | --- |
| {{for example "Weekend and holiday differential"}} | {{for example "Saturday, Sunday, and holidays"}} | {{for example "plus $6 per hour"}} |
| {{for example "Emergency or same-day call"}} | {{for example "same-day, or after 4pm"}} | {{for example "plus $150 flat"}} |
| {{for example "Travel outside my normal area"}} | {{for example "past exit 60 or the East End"}} | {{for example "plus $95 per trip"}} |

Delete the rows you do not use and add your own. Common ones worth a thought:
after-hours or weekend work, emergency and same-day calls, travel or zone
charges, stairs and difficult access, disposal of what comes out, permit
handling if you do pull them, rush and expedite fees, and a fuel or material
surcharge if your prices move.

**How the kit uses this:** on every quote, after it prices the lines, it checks
this list against the job and asks about the ones that plausibly apply — "this
one's Saturday, do you want the weekend differential on it?" It never adds a
surcharge on its own and never leaves one out silently. A surcharge you decided
not to charge is a decision; a surcharge nobody mentioned is money gone.

## Sales tax

- Do I charge sales tax on quotes: {{yes, no, or "depends on the job"}}
- If yes, the tax rate: {{tax rate percent, for example "8.625%"}}
- Does it depend on the job: {{yes or no — answer yes if some of your work is a capital improvement and some is a repair}}
- If it depends, which of my services are usually NOT taxed: {{list the service names, for example "new patio installs, new system installs"}}
- If it depends, which are usually taxed: {{list the service names, for example "repairs, service calls, maintenance"}}

If you do not charge tax, the quote leaves the tax line off entirely — it will
not show a $0.00 tax row.

**If you answered "depends on the job":** the kit will NOT guess which side a
job falls on. On every quote it asks you one plain question — "is this one a
capital improvement or a repair?" — and uses your answer. It never decides for
you, because that decision is between you and your accountant, and getting it
wrong costs real money in both directions. See `services.md` for the ST-124
paperwork note.

## Minimum charge

- Smallest amount I will quote for a job: {{minimum charge in dollars, or "none"}}

This one is read on every quote. If a job's total lands under this number, the
AI tells you BEFORE it shows you the quote and asks whether to bring it up to
the minimum or send it as-is. It never changes your price on its own. Write
"none" if you do not have a minimum.

## My rough job cost (optional, but this is the one that saves money)

- My job cost as a rough percentage of price: {{for example "62%" — what a typical job costs you in materials, labor, and subs, out of what you charge. Write "not sure" and the AI will skip the margin line}}
- The lowest gross margin I am willing to work at: {{for example "30%", or "none"}}

What this does: after the math, the AI says one plain line — "at your usual 62
percent job cost, this one leaves about 38 percent gross" — so you see the
number before your customer does. If a quote lands under the floor you wrote
above, it flags it and asks before showing it to you. It is a mirror, not a
veto: your price is always your call.

If you leave this blank or write "not sure," the AI says nothing about margin
rather than inventing a cost. A guessed margin is worse than none.

## My deposit

- Deposit I ask for before starting: {{a percentage like "40%", a fixed amount like "$500", or "none"}}

If you write a percentage or an amount here, every quote does the arithmetic for
you and prints the deposit as its own line under the total: "Deposit to start
(40%): $5,383.46. Balance due on completion: $8,075.18." Nobody has to work it
out, and it is the number that decides whether a job actually starts. Write
"none" if you do not take one.

## When I can start (lead time)

- My usual lead time before I can start a job: {{for example "3 to 4 weeks from a signed quote and deposit", or "next week"}}

Every quote asks when the customer needs the work done. If they name a date,
the quote says plainly whether that date is inside your usual lead time or
whether you need to talk about it BEFORE the price goes out. A customer date
you never answered is the second most common way a job goes bad; the first is
not measuring it.

## Standard terms (optional)

The default payment terms that go at the bottom of a quote. The AI uses this
unless you tell it something different for a specific job. The deposit line is
computed from the field above, so you do not need to repeat the percentage here.

- Terms: {{for example "Balance on completion. Quote valid 30 days. Materials included."}}
