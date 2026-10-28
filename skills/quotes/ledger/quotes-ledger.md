# Quotes Ledger

This is the running record of every quote you have prepared, sent, or closed. It
is the single source of truth for quote numbers. The next quote number is always
one higher than the highest top-level number in this table. Numbers are never
reused and never made up — `scripts/quote-kit.mjs` locks this file, reserves the
next number, appends its row, and advances the header together.

Each row: the quote number, who it was for, the total amount, the date it was
made, its valid-until date, and its status. Status is one of:

- **prepared** — priceable and numbered, but the user has not confirmed sending;
- **sent** — the user confirmed the quote went out;
- **accepted** — the client agreed to the quote;
- **declined** — the client passed;
- **expired** — the valid-until date passed with no answer; or
- **voided** — cancelled, abandoned, or mistaken, kept in the record but no
  longer counted as live.

Update the status when the user tells you what happened. Rows are never deleted.
A prepared quote the user does not use becomes voided; its number is not reused.

The order is enforced, not just described. A quote goes prepared, then sent, and
only a sent quote can become accepted, declined, or expired — so this record can
never say a client agreed to a quote that was never sent. Voiding is available
from prepared or sent. Accepted, declined, expired, and voided are final: the
script refuses to reopen a closed row. More work on an accepted job is a change
order; a client returning after declining gets a new quote number.

A number with a letter after it — `0068-A` — is a **change order** on the job
quoted as 0068: extra work priced after the customer already said yes. It
belongs to that job, its Amount is the change only, and it does NOT use up a
top-level quote number. The next new quote after 0068 and 0068-A is still 0069.

**Next quote number:** 0001

| Quote # | Client | Amount | Date | Valid until | Status |
| --- | --- | ---: | --- | --- | --- |
<!-- The Node script appends one row here per priceable quote. Do not delete rows — this is your record. -->

<!--
EXAMPLE — how a filled row looks (this is documentation, not a real quote; the
table above is empty and your first real quote will be 0001):

    | Quote # | Client | Amount | Date | Valid until | Status |
    | --- | --- | ---: | --- | --- | --- |
    | 0001 | Bob Smith | $5,214.00 | 2026-07-15 | 2026-08-14 | sent |

The next number is always one higher than the highest top-level number in the
table above. With no rows yet, the first reservation is 0001. It starts as
prepared, becomes sent only after the user confirms sending, and later becomes
accepted, declined, expired, or voided.
-->
