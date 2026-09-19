**Round 2, spec adversary — osh-observation-age.** Scope: the five commits after `8ca0002`. Baseline 164 pass / 0 fail. 14 mutations, 11 reddened, 3 survived.

**1. BLOCKS — `osh-031` gained an assertion with no test behind it.** The scenario says the layer leaves the entity in place when `ageMs` is further below zero than `OSH_CLOCK_SKEW_MAX_MS`. No layer test covers it. **N14**: relax the gate to `isOshObservationFresh(x) || x < 0`, the rule before the bound, and **all 164 tests pass**. The far-ahead case is pinned in the predicate's tests and in the render's tests, but not on the motion path, which is the half that actually moves a marker. Same shape as round 1's finding 1: a spec line satisfied equally by the code and its negation.

**2. MINOR — the lower bound is written three times.** `isOshObservationFresh`, `formatOshAge` and `renderAge` each spell out the comparison. **N8 and N9** flip either detail copy to `<=` and **survive all 164 tests**. The two bounds then disagree at exactly minus five minutes: the panel renders fresh styling with text saying the record is unusable, while the predicate still calls it fresh, so the entity moves. Cosmetic today, and it needs a deliberate edit to reach. The clean fix removes both survivors at once: export one predicate and call it in all three places.

**3. Both original blockers are closed and the new tests discriminate.** N1, dropping the lower bound, reddens. N2 through N5, moving either threshold in either direction, all redden on the literal-pin test. N6 and N7, changing the lower bound's comparison or its constant, redden. N10 through N13, each of the four render states, redden.

**4. The two bounds interact cleanly**, measured end to end, with no contradictory cell.

**5. Base text re-verified**; both requirement texts unchanged; `links.json` updated for every renamed and new test.

**6. Constraints still hold.** No query or request-shape change, GET only, no OpenSensorHub host, id, count or place name.

**7.** The lead named a commit that did not contain the fixes. It had been reset past, and carried only the archival change.

Verdict: FAIL
