## Source

Read commit: `e2437f945215860c42b5d8bba6834c85f93a90ce`.

## Decision

Add the optional predicate `adoptedAsIs` to compareLedger and ratchetLedger. Its default returns false.
A file has tolerance when its current hash equals its ledger hash.
Both records must show a file that a test loads with true coverage.
The file must also have base content or satisfy adoptedAsIs.

The gate reads adopt records through adoptsOf for the checked change after the base history prefix.
The gate uses checkAdopts to check the merge parent, the changed file set and the reached rule.

Only valid records supply source evidence. The gate compares current file text with git show at the from commit.
An absent current file gives no evidence. Other source content gives no evidence, also after a conflict that a person resolves by hand.

A new file can satisfy this rule without base content. Another change or an invalid source gives no tolerance.
The gate keeps LEDGER-ADOPT-FROM and the other adopt errors.

The gate computes this predicate before the ratchet command and the ledger comparison.
The ci command selects the change first. All three commands use the same predicate.
The ratchet command uses toleranceCounts for each eligible entry. It never writes a worse count.
The rule changes no toleranceOf limit, stale rule or coverage loss error.

### Pass 2

Read commit: `125dc3ae92f9687a830e230914ec0e2b393dda18`.
Add the optional adoptedFile predicate to compareLedger. Its default returns false.
The gate computes it from the same valid adopt records as adoptedAsIs, without a source content check.
The stale decision accepts total differences only with equal hashes, true loaded records and equal not-covered counts for all metrics.

The comparison keeps all coverage errors exact. The ratchet command keeps its current total count rule for fork edits.

## Files

Change scripts/spec/lib/ledger.mjs and scripts/spec/gates.mjs.
Add tests to src/tooling/spec/ledger.test.mjs and src/tooling/spec/gates.test.mjs.
Keep the first sentence of Count tolerance unchanged. Add a separate requirement for the new source condition.
The new requirement adds an exception to the base content condition.

## Checks

Use host tests with one file per Node process. Use cores 8 through 11 and priority 19.

Measure line, branch and function coverage. Run named code faults and automatic code mutations.
Replay the real CI artifact against a scratch copy of upstream-sync-3.
Run only the lint command from the gate CLI. The lead runs the ratchet command, image gates and reviews.
