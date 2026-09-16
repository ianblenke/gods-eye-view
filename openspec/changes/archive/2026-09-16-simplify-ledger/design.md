## Context

The change `establish-spec-governance` added the three mechanisms one after the other. The exact counts came first. The ranges came after a local run gave other counts than an earlier run. The band came after the first run of the CI job gave other counts than the local runs. Each mechanism has its own conditions, and the gate applies them in one comparison function.

## Changed files

`scripts/spec/lib/ledger.mjs`, `scripts/spec/lib/specs.mjs`, `scripts/spec/lib/trace.mjs`, `scripts/spec/gates.mjs`, `src/tooling/spec/ledger.test.mjs`, `src/tooling/spec/gates.test.mjs`, `src/tooling/spec/specs.test.mjs`, `src/tooling/spec/ciFiles.test.mjs`, `Makefile`, `AGENTS.md`, `.claude/agents/spec-adversary.md`, `openspec/trace/gaps.json` and the new file `openspec/trace/retired-ids.json`.

## Goals / Non-Goals

**Goals:**
- Give the ledger one rule for a count difference.
- Keep the sum of the new tolerances of the covered counts not larger than the three mechanisms together.
- Accept a line tolerance that is larger than the old band.

**Non-Goals:**
- Make the tests deterministic. The change `backfill-deterministic-tests` will do this.
- Change the trace gate or the coverage gate.

## Decisions

### The tolerance

The tolerance of a metric is 8, or 4% of the total of that metric when that is less. The table gives the measured difference of each file with a range, and the tolerance of the new rule.

| File | Metric | Total | Measured | Tolerance |
| --- | --- | --- | --- | --- |
| `src/layers/flights/enrichment.js` | lines | 240 | 8 | 8 |
| `src/data/manager.js` | lines | 2002 | 7 | 8 |
| `server/providers/vessels/ais-store.js` | lines | 288 | 4 | 8 |
| `src/voice/gevActions.js` | lines | 3445 | 2 | 8 |
| `src/data/labelArbiter.js` | branches | 405 | 2 | 8 |
| `src/data/localGeojsonCore.js` | branches | 296 | 1 | 8 |
| `src/data/spriteOrder.js` | branches | 25 | 1 | 1 |

The second part of the rule makes the tolerance of a small file smaller than the tolerance of a large file. The file `src/data/spriteOrder.js` has 25 branches, so its tolerance is 1 and not 8.

### The conditions of the tolerance

The gate applies the tolerance to a loaded code file with true coverage. That file must also have the content of the base commit and the content hash of its ledger entry. The band had the same conditions.

For a file that the change edits, the gate compares the counts with no tolerance. The ratchet command writes the counts of that file again.

### The covered counts

The known limit `range-totals` records that a range stops the comparison of the covered counts. The new rule compares the covered count of the branches and of the functions with the tolerance. It does not stop that comparison.

### The anti-drift rule

The ratchet command does not write a worse count. Thus a small loss of coverage in each change cannot become large. The rule comes from `bandFileCounts` of the old code.

### The total line count

The tolerance needs the total of each metric. The ledger records the total branches and the total functions, but not the total lines. The new ledger records the total lines, and its version is 4. The measurement gives this number in the `LF` record of the lcov file.

### Removal of a requirement

Before this change, no change could remove a requirement. The trace gate needed a test for each scenario of `openspec/specs/`, and the archive command removes the requirement only after the gates pass. The author must remove the tests with the code, so the gates stopped the build.

`loadSpecs` now gives the scenarios of each main requirement that an active change removes. The trace gate counts these scenarios with the scenarios that wait for a test. See `spec-trace-054`.

### The ratchet command after the archive command

The archive command of a change that removes a requirement changes the scenarios of the main specs. The ID registry and the scenario links then need a new ratchet run. So the ratchet command now also runs for an archived change. See `gap-ledger-077`.

### The purpose of the capability

The archive command does not change the Purpose section of a main spec. So this change writes the Purpose of `openspec/specs/gap-ledger/spec.md` by hand, with the tolerance in place of the band.

The archive command also removes the empty line before the heading "## Requirements" of each main spec that it writes. So this change adds that empty line again in the three main specs that it changes.

### What this change removes

This change removes the requirement "Count band for band files" and the requirement "Unstable coverage", with their 25 scenario IDs. This change also removes the stability command, the kept samples, the file `.gev-cache/spec-samples.jsonl`, the field `low`, the origin `unstable` and seven error codes.
