# skills/quotes/workflows/

The step-by-step procedures `SKILL.md` dispatches to. One file per path a quote
can take.

- `new-quote.md` - request to priced, numbered, filled quote (per-unit, flat, or
  hourly); carries the refusal gate at step 3c.
- `change-order.md` - a change to an ACCEPTED job becomes `0068-A`, inheriting
  the original's terms and tax treatment.
- `render-quote.md` - filled quote to branded print-ready PDF.
- `ledger-update.md` - assign the next number, append or update the ledger row.
