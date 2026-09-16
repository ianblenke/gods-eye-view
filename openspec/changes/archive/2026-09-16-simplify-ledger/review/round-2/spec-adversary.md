Round 2 complete. All seven round-1 findings are corrected; three new minor findings come out of the corrected text and one corrected test.

```
Verdict: PASS
- [ ] F1 minor proposal.md:39 The known limit `line-tolerance-larger` writes "For the covered branches and functions the new tolerance is much smaller: the sum goes from 1802 to 532." 1802 and 532 are the branch sums alone. Over the 353 loaded entries the covered branch and function sum goes from 3567 to 618 (branches 1802 to 532, functions 1765 to 86). Write the two sums for both metrics, or name only the branches.
- [ ] F2 minor design.md:13 The corrected goal "Keep the gate as strong as the three mechanisms together for the covered counts" does not hold for each file. The old band of a covered count was `max(5, ceil(covered * 0.02))`; the new tolerance is `min(8, 4% of the total)`. For 18 loaded entries the new tolerance is larger by up to 3, for example `src/data/localGeojsonCore.js` branches (6 to 8), `src/data/radio.js` functions (5 to 8) and `src/voice/gevActions.js` branches. The sums are much smaller, so the goal holds in sum only. Write "in sum" in the goal, and name the 18 entries in the known limit `line-tolerance-larger`, which now says that the covered tolerance is "much smaller".
- [ ] F3 minor src/tooling/spec/gates.test.mjs:285 The assertion that the round-1 correction added for the ledger, `JSON.parse(gaps.json).version === 4`, cannot fail: the `init` run at the start of the test already wrote the version 4, so the assertion holds whether or not the ratchet command writes the ledger. The THEN line "the command writes the ledger" still has no assertion that can fail. Assert a part of the ledger that this ratchet run changes, for example that `untracedTests` no longer has `src/math.test.mjs`, whose only test the test file gives a tag before the run.
```

Round-1 findings, one by one:

- F1 (critical) closed. `src/tooling/spec/trace.test.mjs:217` calls `evaluateTrace` with `removedIds: ['flights-004']`, asserts the empty `TRACE-UNVERIFIED` list, `counts.pending` and `counts.verified` of 1 and 1, and that a scenario with the source `change:drop-labels` stays required. The helper at `:13` takes `removedIds`, and `scripts/spec/lib/trace.mjs:98` reads `specs.removedIds` with no guard. `loadSpecs` always gives the set, and `gates.mjs:227` is the only other caller.
- F2 (minor) closed. The JSDoc at `scripts/spec/lib/ledger.mjs:221-227` now gives the tolerance rule and names the requirement "Count tolerance".
- F3 (minor) closed. `outsideChanged` is in no file of the repository.
- F4 (minor) closed. The requirement "Ledger file" names the total lines in the delta and in the main spec, and it is a MODIFIED requirement with tasks 2.14 and 2.15. The tests of `gap-ledger-001` and `-002` assert the total line count of a written entry.
- F5 (minor) closed in form: the goal names the covered counts and the proposal has `line-tolerance-larger` with the correct line numbers (206 of 353; the tolerance sum goes from 1965 to 2039). The corrected text has two new errors, F1 and F2 above.
- F6 (minor) closed for the registry: the test asserts `ids.json` and `links.json`. The new ledger assertion is weak, see F3 above.
- F7 (minor) closed. `src/tooling/spec/ledger.test.mjs:531` covers the unloaded case with `UNLOADED(30)` against a measured 34 and asserts `LEDGER-LARGER-GAP`.

Other observations: the ledger has no new entry, no larger count and no smaller covered count against `47e355e`, and each of the 468 new history lines names `simplify-ledger`.
