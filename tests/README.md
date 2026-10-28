# tests/

Executable gates for the kit's deterministic parts. Run with
`node --test 'tests/*.test.mjs'` from the kit root.

- `quote-kit.test.mjs` - the money math and ledger mechanics in
  `skills/quotes/scripts/quote-kit.mjs`.
- `form-html.test.mjs` - the arithmetic in
  `skills/quotes/templates/quote/form.html`.

These plus `node verify-kit.mjs` are the executable receipts for a release; run
both after any edit to this kit.
