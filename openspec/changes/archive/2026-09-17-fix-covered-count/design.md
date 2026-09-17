## Context

The ratchet run of 2026-09-17 07:41 gave the error `LEDGER-LOST-COVERAGE` for an unchanged file. The file is `src/search/placeSearch.js`. The measured branch total moved from 23 to 22 between two runs. The not-covered count stayed at 3 in each run. The covered count is the total minus the not-covered count, so the fall in the total looked like a lost branch.

The known limit `banked-branch-count` names the same V8 instability for `src/data/labelArbiter.js`. That file has 405 branches, so its tolerance of 8 allows a move of the total. `src/search/placeSearch.js` has 23 branches, so its tolerance is 0.

## Goals / Non-Goals

**Goals:**
- Make sure the gate does not read a move of a branch total or a function total as a lost branch or function.
- Keep the gate exact for a file with a total that does not move, so a real loss still stops the build.

**Non-Goals:**
- Change `toleranceOf`, the ratchet command, or the comparison with the base ledger.
- Close the known limit `banked-branch-count`. This change records that the same instability has a second form.
- Close the known limit `uncalled-function-branches`. This change states the limit and keeps it open.

## Decisions

### The loss is the smaller of two differences, when the not-covered count rises

For the branches and the functions of an unchanged file, the gate measures a loss:

```
const fall = before - now;
loss = gap[metric] >= entry[metric] ? Math.min(gap[metric] - entry[metric], fall) : fall;
```

The gate stops the build when the loss is above the tolerance. A real loss with a total that does not move shows in both differences equally, so the loss stays exact. A move of the total changes one difference and not the other, so the loss is the part that both counts agree on.

A fall of the not-covered count must not hide a fall of the covered count. `Math.min` of a negative difference and a positive one returns the negative number. So the loss must use the fall of the covered count when the not-covered count falls. When a caller in another file no longer calls a function, V8 removes the nested functions of that function too. The not-covered count can fall, and the covered count falls too.

### Rejected: compare the not-covered count when the totals differ

This removes the rule of `gap-ledger-018`, which lets a new test show more branches with no smaller covered count. It turns one false stop into another false stop for `src/data/labelArbiter.js`.

### Rejected: a floor of one for the tolerance

This allows a move of one branch but not a move of two, which the history of `src/data/labelArbiter.js` shows is possible. It also lets each small file lose one branch and one function with no stop.

### What this change leaves open

A fall of the covered count no longer stops the build in two cases, on the branches or on the functions. The not-covered count can stay the same, or it can rise by no more than the tolerance. The second case needs the tolerance conditions, because the tolerance is 0 without them. In the first case, without the tolerance conditions, the gate records the entry as not current. The known limit `uncalled-function-branches` names these cases and gives the measured numbers.

## How the gates measure the requirement

`scripts/spec/lib/ledger.mjs` gets a function `lossOf(entry, gap, metric)`. It returns the loss of a metric, or null when either covered count is null. `compareCoverageEntry` compares this loss with the tolerance, in place of the covered count. The message of `LEDGER-LOST-COVERAGE` names the not-covered count and the covered count of the current run and of the entry.

The text of the requirements "Ratchet rule" and "Count tolerance" stays the same as the live spec. Only the scenario bodies change, so the trace gate needs a changed test for each scenario with a changed body, and for no other scenario.

The test `src/tooling/spec/ledger.test.mjs` gets a new test for `gap-ledger-078`, and new assertions for `gap-ledger-054`, `gap-ledger-070`, `gap-ledger-072` and `gap-ledger-073`. Most new assertions fail against the code before this change. The new `gap-ledger-054` assertion for a not-covered count that falls fails only against the middle `Math.min` form. The tests for `gap-ledger-069` and `gap-ledger-074` get a new case each, for a path their old tests did not reach.

## Risks / Trade-offs

The gate becomes less exact for two cases: the not-covered count stays the same, or it rises inside the tolerance. The known limit `uncalled-function-branches` names these cases and the reason the risk stays small.
