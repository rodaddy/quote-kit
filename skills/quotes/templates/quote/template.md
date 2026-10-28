<!--
QUOTE TEMPLATE — the master skeleton for every quote and proposal.
The locked prose and layout below never change. Only the parts inside double
curly braces {{ }} get filled in. Every {{ }} is a FIELD — a plain question to
answer. The field name IS the question. Fill every one.

FIELDS (fill every one of these):

  Business branding header (comes from branding/brand.md — do not re-ask):
    {{business name}}
    {{business tagline}}
    {{business street address}}
    {{business city, state, and postal code}}
    {{business phone number}}
    {{business email address}}

  Quote identity:
    {{quote number}}                         (assigned from the ledger — NEVER made up)
    {{today's date}}
    {{valid until date}}                      (default: 30 days after today's date)

  Who the quote is for:
    {{client full name}}
    {{client company name if any}}
    {{client street address if known}}
    {{client email address if known}}

  Line items (repeat the line-item row once per item — see the LINE ITEM block):
    {{service or item description}}
    {{quantity}}
    {{price each in dollars}}
    {{line total in dollars}}                 (quantity times price each — the Node script computes this at T1/T2; T3 announces manual checking)

  Money totals:
    {{subtotal in dollars}}                   (all line totals added together)
    {{tax note}}                              (e.g. "Sales tax (8.625%)" — or the line is removed if no tax)
    {{tax amount in dollars}}                 (subtotal times the tax rate — removed if no tax)
    {{total in dollars}}                      (subtotal plus tax)

  Deposit and start window (computed — see workflows/new-quote.md step 4c):
    {{deposit note and amount}}               ("Deposit to start (40%): $5,383.46" — computed
                                               from the deposit field in rate-card.md. Remove
                                               this line entirely if the deposit is "none")
    {{balance due on completion}}             (total minus the deposit — removed with the line
                                               above when there is no deposit)
    {{start window}}                          (the start window the USER agreed to, in plain
                                               words: "We can start the week of September 8."
                                               Remove this line if no date was given and none
                                               was agreed. Never print a date the user did not
                                               say out loud)

  Exclusions and assumptions (MANDATORY — never leave this section out):
    {{what this quote does not include}}      (one short plain line per item: permits, disposal
                                               and haul-away, site access, utility marking,
                                               anything the client supplies. Pull the starting
                                               list from the "What I never include unless asked"
                                               block for each service in services.md)
    {{what this price assumes}}               (one short plain line per item: the conditions the
                                               price is good under — access for a truck, no ledge
                                               or old slab under the surface, existing surface is
                                               sound, work done in one visit, materials at today's
                                               price. If one turns out false, that is a change
                                               order, not a free extra)

  Terms and sign-off:
    {{terms and conditions}}                  (payment terms, deposit, what's included)
    {{sender full name and title}}

How to use this file with no tools at all:
  Drop this whole file into any AI chat and say "make me a quote." The AI reads
  your branding, rate card, and services, asks for the job details one plain
  question at a time, assigns the next quote number from the ledger, does the
  money math out loud, and hands you the finished quote. If the job is not
  specified enough to price — no size, no unit, no answer on who pulls the
  permit — it stops and tells you what is missing instead of making a number
  up. That stop is the point.
-->

# QUOTE

**{{business name}}**
{{business tagline}}
{{business street address}} · {{business city, state, and postal code}}
{{business phone number}} · {{business email address}}

---

**Quote number:** {{quote number}}
**Date:** {{today's date}}
**Valid until:** {{valid until date}}

**Prepared for:**
{{client full name}}
{{client company name if any}}
{{client street address if known}}
{{client email address if known}}

---

## What we are quoting

| Description | Quantity | Price each | Line total |
| --- | ---: | ---: | ---: |
<!-- LINE ITEM — duplicate this one row for each item, then delete this comment -->
| {{service or item description}} | {{quantity}} | ${{price each in dollars}} | ${{line total in dollars}} |

|  |  | **Subtotal** | **${{subtotal in dollars}}** |
|  |  | {{tax note}} | ${{tax amount in dollars}} |
|  |  | **Total** | **${{total in dollars}}** |

{{deposit note and amount}}
{{balance due on completion}}

{{start window}}

---

## Terms

{{terms and conditions}}

---

## What this quote does not include

{{what this quote does not include}}

## What this price assumes

{{what this price assumes}}

If something on this list turns out differently once we are on site, we will
come back to you with the change in writing before doing the work — the price
above does not move on its own.

---

This quote is valid until **{{valid until date}}**. To accept, reply to this
quote or contact us at {{business phone number}} or {{business email address}}.

Thank you for the opportunity to work with you.

{{sender full name and title}}
{{business name}}
