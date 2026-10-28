# skills/quotes/ledger/

Holds `quotes-ledger.md`, the running record of every quote prepared, sent, or
closed, and the single source of truth for quote numbers.

`scripts/quote-kit.mjs` locks this file, reserves the next number, appends the
row, and advances the header together, so two chats cannot take the same number.
Rows are never deleted; status moves through prepared, sent, accepted, declined,
expired, or voided. On upgrade this folder is carried forward intact - its
history and next number must never reset.
