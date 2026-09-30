# spec-adversary — backfill-recent-imagery — Round 2 (scope: diff fef8c46)

Verdict: FAIL

The reviewer checked part A in full. It only spot-checked C and E, and did not do B or D. No mutation was run and no listed test was read, because the reviewer can only read files.

The first two findings come from part A. The reviewer read all 27 claims against the source. The 25 not listed below hold for the reasons it could check in the code, including `loop-70-thumbnails`, `expression-173-true`, `expression-083-left`, `expression-084-left` and `expression-084-right`.

- [ ] FINDING major openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:64 `expression-065-right` (`activeSlotOf(key)` at `src/layers/recentImagery/index.js:292`) is observable, so "no input can reach" is false.
  - `setMode` does not clear `_auto` or `_previewKey`, and `setParams` accepts a `b` pin before the search.
  - Fixture: start in basemap mode, no `a` pin, and call `setParams({b: Y})` for a present day Y. Run a search where the top-ranked day K is not Y, so `runSearch` previews K in slot `a` with `_auto` set. Call `setMode('ab')`. Then let the thumbnail probe for K return `Data-Present: false`.
  - `pruneEmpty` then calls `autoPreview()` at line 318, and Y is now top-ranked. Real code returns at line 292 because `activeSlotOf(Y)` is `'b'`, so `snapshot.auto` is null. The mutant does not return, so `snapshot.auto.key` is Y and `_previewKey` is Y.
  - Add a tagged test and remove the bullet.

- [ ] FINDING minor openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:76 `default-323-dom-children` (`root?.children || []` at `src/ui/recentImagery.js:122`) is observable, and the reason ("the factory supplies elements with children") is wrong.
  - `el` uses the injected `container.ownerDocument.createElement`.
  - Fixture: pass a fake document whose elements have no `children` property, only `appendChild` and `dataset`, and mount the panel far enough to render the actions block. `findIn(actionsHost, ...)` then takes the fallback branch and returns null.
  - A mutant that removes the fallback throws `TypeError` in the `for...of`.
  - If the fixture is too costly, keep the bullet but change the reason to "needs a fake document with no `children`".

- [ ] FINDING minor openspec/specs/recent-imagery/spec.md:573 Scenario 052 has a stray full stop at the end of the third AND line, and it is followed by two more AND lines. This is a style fault, not a gap. The five tests in `testDoubles.test.mjs` do cover every THEN and AND clause of 052.

- [ ] FINDING minor openspec/changes/archive/2026-09-30-backfill-recent-imagery/proposal.md:63 `expression-065-left` (`!previewSlot()` at `src/layers/recentImagery/index.js:292`) is unreachable, but the stated reason is loose.
  - The real reason is that a non-null `_auto` implies `_assigned.a` is null.
  - `setAssignment`, `setParams` and `runSearch` all clear `_auto` when a slot is filled.
  - Fix the wording to name that invariant. "Callers first remove their pins" is not what the code does.

The reviewer did not check part B (the 12 round-1 kills and the `-r3` kills), part D (counts and ledger) or part E (the 4 possible-defect bullets). For part E, it found only the proposal.md line 282 mention and no four bullets under a "possible defect" heading.

Lead's note: a second, shorter message from the reviewer repeated the same four findings. The four possible-defect Known limits exist as bullets at proposal.md lines ~88-91 (they are not under a "possible defect" heading).
