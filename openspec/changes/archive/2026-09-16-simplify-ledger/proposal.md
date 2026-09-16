## Why

The gap ledger has three mechanisms for the same problem. The exact counts do not allow a larger gap. A range has two counts for a file with coverage that changes between runs. A band allows a small difference for a file that the change does not edit.

The three mechanisms do the same work, and together they have faults. The known limit `range-band-ratchet` records one of the faults. For a band file with a range, the ratchet command keeps the high count. It writes the current total counts. The known limit `range-totals` records a second: a range stops the comparison of the total counts and the covered counts.

The range mechanism cannot record the range of the two files with the largest range. The measured counts of `src/data/manager.js` give a range of 7, and the counts of `src/layers/flights/enrichment.js` give a range of 8. The width limit is 5, so an author wrote the high counts 139 and 88 by hand.

The samples of the ranges are local files that Git does not track. No tool makes them from a run of the CI job. The known limits `ci-samples` and `sample-identity` record this.

## What Changes

- Replace the exact counts, the ranges and the band with one tolerance.
- Make the tolerance of a metric 8, or 4% of the total of that metric when that is less.
- Record the total lines of each file in the ledger, and make the ledger version 4.
- Remove the range field `low` from each entry, and remove the origin `unstable`.
- Remove the stability command, the kept samples and the file `.gev-cache/spec-samples.jsonl`.
- Compare the covered counts with the tolerance. Do not stop that comparison.
- Keep the anti-drift rule: the ratchet command does not write a worse count.
- Retire 25 scenario IDs of the two requirements that this change removes.
- Give the trace gate the scenarios of a main requirement that an active change removes. Before this change, no change could remove a requirement. The gate needed a test for each scenario of the main spec until the archive command ran.

## Capabilities

### Modified Capabilities
- `gap-ledger`: one tolerance in place of the exact counts, the ranges and the band.

## Impact

- Changed files: `scripts/spec/lib/ledger.mjs`, `scripts/spec/lib/specs.mjs`, `scripts/spec/lib/trace.mjs`, `scripts/spec/gates.mjs`, `src/tooling/spec/specs.test.mjs`, `src/tooling/spec/ciFiles.test.mjs`, `AGENTS.md`, `src/tooling/spec/ledger.test.mjs`, `src/tooling/spec/gates.test.mjs`, `Makefile`, `.claude/agents/spec-adversary.md` and `openspec/trace/gaps.json`.
- New file: `openspec/trace/retired-ids.json` with the 25 retired IDs.
- The change makes the ledger version 4. Each entry gets the total line count. The change removes the field `low` from seven entries.
- Gaps that this change opens: none. The new code has a test for each new scenario.
- Gaps that this change closes: none in coverage. It closes four known limits.

## Known limits and later changes

- `tolerance-slack`: The gate allows a difference of at most the tolerance for a file with the tolerance conditions. Thus a change can remove this much coverage with removed tests, removed assertions or changed code that the file uses. The spec adversary checks each removed test and each changed code file.
- `line-tolerance-larger`: For the not-covered lines, the new tolerance is larger than the old band for 206 of the 353 loaded entries. The sum of the line tolerances becomes 2039 in place of 1965. For the covered branches the sum of the tolerances becomes 532 in place of 1802, and for the covered functions 86 in place of 1765. The loaded entries have 706 covered metrics. For 18 of them, the new tolerance is larger than the old band, by at most 3.
- `deterministic-tests`: Some old tests read the clock, so the coverage of the file that they load changes between runs. A backfill change must change these tests. The file `src/data/labelArbiter.js` also has counts that change with no clock in its tests, so a tolerance stays necessary after that change.
- `tolerance-not-measured`: The tolerance comes from the measured counts of seven files on one date. No tool measures the counts again to show that 8 is still correct.
