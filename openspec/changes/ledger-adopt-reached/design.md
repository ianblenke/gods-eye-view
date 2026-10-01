## Context

Read commit: `02ec7d340b7b2d978eb3c203f5c7a424cf5e5e58`.

## Decision

Use `moduleImports` on tracked script module files. Resolve relative specifiers against tracked code files. Try the exact path, `.js`, `.mjs`, `/index.js` and `/index.mjs`, in that order. Ignore packages and builtins. HTML and shell files supply no import edges. A parse error supplies no import edges.

Read each tracked module once in each graph when the command or gate needs the import descendants. Read the base graph from the tracked code files of the base commit. The current graph is the HEAD graph. Read it from the current tracked code files.

This costs one file read and one parse per module per graph. Read the merged commit graph from its tracked code files on first use. Cache descendants for each merged commit.

Search states that contain a file and a boolean `usedNewEdge`. Start each changed code file with that boolean false. Follow the edges of the current graph.

Set the boolean true when an edge exists in the merged commit graph and is absent in the base graph. A file is reached only in a state with that boolean true. Visit each state once, so a cycle ends. Count dynamic imports with literal specifiers and re-exports as import edges.

A reached file must have the base content and measured untrue coverage. Measured means the measurement from this command or gate run. Its base entry must have an `untrue` field that is false, or the entry must be absent. A changed code file must reach it through an import path. The path must use an edge of the merged commit graph absent in the base graph.

The command checks the merged commit before it measures coverage. The gate checks all these conditions again.

The ledger library writes the field `reached` only on the adopt lines of reached files. Each adopt line is a history line. Coverage counts are the measured gaps. The gate reports `LEDGER-ADOPT-REACHED` for any reached adopt line that is not valid. Only valid adopt lines supply counts.

The gate also allows the entry and the new total counts of a file with the base content when its reached adopt line is valid. The content hash check stays active.

The requirement text stays equal to the base text. Scenarios 096 and 097 omit reached adopt lines from their checks. Scenario 105 governs these adopt lines. A reached adopt line that is not valid gives no adopted count.

## Files

Change `scripts/spec/gates.mjs` and `scripts/spec/lib/ledger.mjs`. Add `scripts/spec/lib/import-reach.mjs`. Add tests next to the existing ledger tests. Add the command test names to the fixed guard test list. Do not change the code that measures coverage.

## Checks

Use host Node for tests, coverage and mutations. The lead runs the ratchet, gates and two review agents. The host cannot give the calibrated gate verdict.
