# skills/quotes/scripts/

Holds `quote-kit.mjs`, the kit's deterministic spine: one dependency-free plain
Node file, no package install and no build step.

It does the money math in integer cents and owns every ledger mutation under a
lock. Subcommands: `calculate`, `ledger-next`, `ledger-migrate`,
`ledger-reserve`, `ledger-reserve-change`, `ledger-status`, `ledger-expire`, and
`ledger-unlock`. The AI calls it rather than doing arithmetic itself; where a
host cannot run it, the kit says those checks are advisory.
