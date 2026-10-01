## Context

Read commit: `253a07d0d7449eaaa5dcf24d276c24540f852f43`.

## Decision

Use `moduleImports` on tracked script module files. Resolve relative specifiers against tracked code files. Try the exact path, `.js`, `.mjs`, `/index.js` and `/index.mjs`, in that order. Ignore packages and builtins. HTML and shell files supply no import edges. A parse error supplies no import edges.

Read each tracked module once when the command or gate needs import reach. This costs one file read and one parse per module. Cache descendants for each merged commit. Visit each file once per search, so a cycle ends. Count dynamic imports with literal specifiers and re-exports as import edges.

A reached file must have base content and current untrue coverage. Its base entry must have literal false untrue coverage, or the entry must be absent. A changed code file must reach it through one or more import edges. The command checks the merged commit before it measures coverage. The gate checks all these conditions again.

The ledger library records the reached mark only on reached coverage lines. The gate reports `LEDGER-ADOPT-REACHED` for any false reached line. Only valid lines supply counts. Valid reached counts also allow unchanged entries and their new total counts. The content hash check stays active. The spec names the base comparison checks that the reached exception replaces.

## Files

Change `scripts/spec/gates.mjs` and `scripts/spec/lib/ledger.mjs`. Add `scripts/spec/lib/import-reach.mjs`. Add tests next to the existing ledger tests. Add the command test name to the fixed guard test list. Keep coverage code unchanged.

## Checks

Use host Node for tests, coverage and mutations. The lead runs the ratchet, gates and two review agents. The host cannot give the calibrated gate verdict.
