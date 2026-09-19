**Round 2, STE adversary — osh-observation-age.** Scope: `8ca0002..0f05635`.

All five blockers are closed, and closed correctly: `osh-032` now names four states with four readings, `renderAge` matches it line for line, `osh-050` serves an age and moves nothing, and the D40 split reads as whole ideas rather than fragments.

**B1. `osh-031` still defines *fresh* with one bound. Blocks.**

> "the entity moves to that location only when the observation is fresh, with `ageMs` finite and at or under `OSH_FRESH_MAX_AGE_MS`"

`isOshObservationFresh()` now has two bounds, and `osh-050` and D40 both say so. `osh-031` was not updated. Read alone — and a scenario is read alone — it says a `phenomenonTime` one year ahead is finite and under one hour, so the layer moves the entity to it. That is the mirrored defect D40 exists to refuse, written into the contract that governs motion, and the code refuses what the contract permits. The enumeration in the next line has the same hole: it lists *above the threshold* and *null*, and omits *further ahead than the skew bound*. No layer test covers the far-ahead case either.

**B2. *current* is back. Minor, but it is the word you cut.** D40: "A record from another month is drawn as a current one."

**Residual minors, all acceptable by name:** the doc comment still reads "a few seconds ahead" where the measurement replaced it everywhere else; the doc says "because the two clocks differ" where the scenario says the server's clock leads; D40 gives no unit for a large number, and one sentence is elliptical; one test name kept its garbled word order.

B1 is the only thing standing.

Verdict: FAIL
