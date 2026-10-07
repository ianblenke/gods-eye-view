Verdict: FAIL

Tree read: /home/ianblenke/docker/gev-work/fix-ri, commit afbfc65a (as you named it; I cannot run git). I only read files. I ran no tests or mutations and did not see the raw gate output.

- [ ] FINDING major src/ui/recentImagery.test.mjs:1170 The AND of 050 (the card-reveal position is kept after DETAILS opens) has no 050-tagged assertion. links.json lists two 050 tests. The one at 1170 never opens DETAILS. The one at 1305 asserts only strip scrollLeft, not the body position. Tag the test at 2451 with recent-imagery-050, because it asserts scrollTop 10 and then no request on refresh. Drop the 050 tag from 1305.
- [ ] FINDING major src/ui/recentImagery.js:281 I expect one mutation to survive. Move `if (detailsOpen) revealCard(...)` before `render();`. Every fake rect is constant, so the 049 and 055 tests still pass. In a real DOM the reveal would then measure the closed card. In the test at 1409, make getBoundingClientRect depend on dataset.open (height 60 only when open), keep the literals, and add the swap as mutation row 21.
- [ ] FINDING minor src/layers/recentImagery/model.js:427 No test needs `Array.from(ring)`, so the mutant `ring.every` survives. `every` skips holes, so a ring with a hole passes the filter and then throws in pointInPolygon. Add a test with `[, [-97,31], [-98,31]]` that expects 'unknown', and add a mutation row.
- [ ] FINDING minor openspec/trace/history.jsonl:2011 Two of the 8 history lines for this change, and gaps.json:1144, shrink the ais-store.js entry (lines 44 to 40, total branches 74 to 76). No code or test of this change touches that file. The 10-03 rebaseline set 44/74. Restore main's values, or name this in the known limits.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/proposal.md:44 This limit is stale. It says an extra branch stays at model.js:406 and the lead must decide. D5 removed that default, and line 406 is now `if (crosses)`. Delete the paragraph. Also name two limits:
  - Other `PRODUCTS[...]` readers stay unguarded: catalog.js:148, rendering.js:102, index.js:66,753,770, ui/recentImagery.js:57. Their keys come only from groupGranulesByDay output or the regex parser.
  - Unknown coverage counts as covering in rankLatest (`coversBox`). A day with only invalid footprints now ranks as covering, where NaN gave 'partial'.
- [ ] FINDING minor src/layers/recentImagery/thumbnails.test.mjs:618 `assert.equal(signal.aborted, false)` runs inside fetchImpl. The loader's catch swallows its error, so it cannot fail the test. Store the value and assert it after settle().
- [ ] FINDING minor src/ui/recentImagery.test.mjs:2908 The 055 AND "absent dimensions" has two meanings: viewport height or card rectangle. The 055 test covers only height 0. The rectangle case is only in the 049 test at 2433. No mutation row names either. Say which one the spec means, or add and tag the other.

Checked, no finding:
- Mutation rows: the 053 operands (`=== entry`, `=== 'unknown'`, `cancelled`), each productOf site, and lat and lon of 056 each have a row. Each `old` string occurs once; the harness would SKIP otherwise.
- Origin change from backfill to spec-first: allowed. The Origin line is hashed with the requirement text (specs.mjs:181), but 050 is its only scenario and is modified anyway.
- Applied spec: it is main plus 46 lines and 12 headings, which is the delta.
- Coverage: the changed lines do not touch the gap lines.
- QA script: no conflict with its scroll checks.
- Old pinned tests: they now state literal values, and none lost an assertion.
