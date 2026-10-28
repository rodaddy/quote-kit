# Services

This file describes WHAT each service is, in plain words, so the AI can write a
clear line-item description on a quote. The rate card says what things cost;
this file says what they are. The installer fills it in by asking you about your
work; edit it any time by hand.

The AI uses this file three ways:
1. To turn a short request ("quote Bob for a fence") into a proper line item
   with a clear description a client will understand.
2. To catch missing details ("a fence — how many feet? what material?") before
   it prices anything. **The "What I need to know before I can price it" line
   is the kit's stop sign**: if any of those answers is missing, the AI refuses
   to price the job and tells you what it needs instead of guessing.
3. To fill the "What this quote does not include" section on every quote, from
   your own list at the bottom of each service block.

---

## My services, described

For each service you sell, write a short plain description and note what you
need to know to price it. One block per service.

### Service: {{first service name, for example "Cedar privacy fence"}}

- What it is, in one or two plain sentences: {{plain description a customer would understand}}
- What I need to know before I can price it: {{for example "how many feet, whether they want cedar or pine, and whether the town needs a permit"}}
- How I write it on a quote: {{for example "Cedar privacy fence, installed — 6 foot height"}}
- What I never include unless asked: {{for example "permit fees, removing the old fence, hauling away debris, marking underground utilities"}}
- What my price assumes: {{for example "truck access to the yard, no ledge in the post holes, one visit"}}

### Service: {{second service name}}

- What it is, in one or two plain sentences: {{plain description}}
- What I need to know before I can price it: {{the questions to ask}}
- How I write it on a quote: {{the line-item wording}}
- What I never include unless asked: {{what the price leaves out unless the customer asks for it}}
- What my price assumes: {{the site conditions the price is good under}}

### Service: {{third service name}}

- What it is, in one or two plain sentences: {{plain description}}
- What I need to know before I can price it: {{the questions to ask}}
- How I write it on a quote: {{the line-item wording}}
- What I never include unless asked: {{what the price leaves out unless the customer asks for it}}
- What my price assumes: {{the site conditions the price is good under}}

Add as many service blocks as you need. Remove the ones you do not use.

**If a service is ongoing rather than one-and-done** — a weekly clean, a
monthly maintenance visit, overnight shifts, a route — add one more line to its
block:

- How long a quote for this usually covers: {{for example "four weeks", "one season, April to November", "one visit, and I say on the quote that it repeats"}}

The kit will still ask before it quotes a recurring job, because the answer
changes per customer. Writing your usual answer here just makes the question a
one-word confirmation instead of a conversation.

## What I never include unless asked (the whole-business list)

Anything here goes on EVERY quote's "What this quote does not include" section,
on top of whatever a specific service adds. This is the section that decides who
pays when a job goes sideways, so it is worth five minutes now.

Common ones in the trades — keep the ones that are true for you, delete the
rest, add your own:

- {{permits and permit fees — say who pulls them, you or the customer}}
- {{disposal, dumpster, and hauling away what comes out}}
- {{marking underground utilities before we dig}}
- {{unforeseen conditions below the surface — ledge, old slab, buried pipe, bad soil}}
- {{restoring lawn, landscaping, or sprinkler lines disturbed by the work}}
- {{materials or fixtures the customer supplies}}
- {{work by other trades — electrical, plumbing, gas}}
- {{engineering drawings, surveys, or town filings}}
- {{winter or after-hours work}}

## What my prices assume (the whole-business list)

The conditions that have to be true for the price to hold. If one turns out
false on site, that is a change order, not a free extra.

- {{for example "normal working hours, Monday to Friday"}}
- {{for example "a truck and trailer can reach the work area"}}
- {{for example "water and power available on site"}}
- {{for example "materials at today's prices; a quote is good for 30 days"}}
- {{for example "the existing surface is sound; if it isn't, we quote the repair separately"}}

## New York sales tax and capital improvements (New York users)

Not every job in New York is taxed the same way. New York's official guidance
explains the tests for a **capital improvement** and how that treatment differs
from repair, maintenance, and installation work. The official certificate is
**Form ST-124**, completed and signed by the customer and contractor and kept by
the contractor. Check the current sources rather than relying on this summary:

- Form ST-124: https://www.tax.ny.gov/pdf/current_forms/st/st124_fill_in.pdf
- Capital-improvements guidance: https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/capital_improvements.htm
- Publication 862: https://www.tax.ny.gov/pdf/publications/sales/pub862.pdf

- Do I do work that may count as a capital improvement: {{yes or no}}
- How I handle it: {{for example "I ask the customer for a signed ST-124 before I invoice, and I note it on the quote"}}

**This is a paperwork prompt, not tax advice.** The kit will remind you and put
the note on the quote; whether a specific job qualifies is between you and your
accountant. If this does not apply to you, write "not applicable" and the AI
will leave it alone.

## Things I do NOT do (optional)

List anything people often ask you for that you do not offer, so the AI can say
so plainly instead of quoting it. Leave blank if not needed.

- {{for example "I do not do electrical work"}}
