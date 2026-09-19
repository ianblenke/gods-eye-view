**Round 1, spec adversary — osh-observation-age.** Scope: full, against `8ca0002`. Worked from a `git archive` copy in the scratchpad; the clone was read-only. 18 mutations against a 159-test baseline.

**1. BLOCKS — the freshness rule has no lower bound.** `isOshObservationFresh` is `Number.isFinite(ageMs) && ageMs <= 3_600_000`. A `phenomenonTime` a month, or a year, in the **future** is therefore fresh. Measured on the reviewed tree: an age of `-31_536_000_000` renders `<div class="osh-detail-age">0 s</div>`, with no `old` and no `osh-detail-old`, and `pollSelected()` moves the entity to it. That is the defect this change exists to close, mirrored to the future side. Every justification in the repository rests on a measured two-to-five-second skew; nothing there reaches a year. **M4, a symmetric bound, survives all 159 tests**, so no test picks between the shipped rule and a bounded one.

**2. BLOCKS — "one hour" is asserted by the spec and pinned by nothing.** `osh-050` says "at or under `OSH_FRESH_MAX_AGE_MS`, one hour". Every test uses the symbol. **M5, one hour to twenty-four hours, and M6, one hour to sixty seconds, both survive all 159 tests**, independently re-verified. One literal assertion fixes it.

**Mutation table.** RED means at least one tagged test failed.

| # | mutation | result | first test to redden |
|---|---|---|---|
| M1 | age `parsed - nowMs` | RED | `osh-050` age is nowMs minus the parsed time |
| M2 | fresh requires `ageMs >= 0` | RED | `osh-050` negative is fresh; `osh-032` negative renders plain; `osh-031` negative still moves |
| M3 | `<` not `<=` | RED | `osh-050` fresh holds at the threshold |
| **M4** | **symmetric bound `Math.abs(ageMs) <= MAX`** | **SURVIVED** | — |
| **M5** | **one hour to twenty-four hours** | **SURVIVED** | — |
| **M6** | **one hour to sixty seconds** | **SURVIVED** | — |
| M7 | drop the `typeof` string guard | RED | `osh-050` absent or non-string gives null |
| M8 | layer: drop the freshness conjunct | RED | `osh-031` one millisecond past the threshold |
| M9 | layer: gate on `ageMs != null` | RED | `osh-031` one millisecond past the threshold |
| M10 | layer: also require `>= 0` | RED | `osh-031` negative age still moves |
| M11 | route: age from `fetchedAt`, frozen | RED | `osh-050` cached snapshot carries a larger age |
| M12 | route: age from `resultTime` | RED | `osh-050` route adds age from the injected now |
| M13 | route: `Date.now()` not the injected `now()` | RED | same |
| M14 | detail: drop the negative clamp | RED | `osh-032` negative renders plain |
| M15 | detail: never mark old | RED | `osh-032` past the threshold marked old |
| M16 | detail: class only, no word | RED | same |
| M17 | detail: omit the age element | RED | six tests |
| M18 | detail: a null age reads `0 s` | RED | `osh-032` null reads `age unknown` |

**3. The sign, verified independently.** The implementer's claim holds: `ageMs >= 0` reddens three tests across the unit, the detail and the layer. An age of exactly zero is fresh and reads `0 s`. Absent, `NaN` and non-string all give `ageMs:null`, never fresh. `"5"` and `"2026"` do parse in V8 to real dates, giving large positive ages, so they read as old. *Minor, accept*: a numeric epoch `phenomenonTime` gives null, which the spec's "absent or unparsed" does not describe.

**4. Serve time, correct and proven.** The cache stores the mapped observation only; the route spreads a fresh object with `now()`. M11 reddens. Part C's cached-age bug is not present here.

**5. The MODIFIED base text.** `osh-032` is `main`'s six lines byte for byte plus two, clean. **`osh-031` is not**: `main`'s THEN line was reworded rather than appended to. It is the right call, because the old line is now false, and the plan declares it. *Minor, accept.*

**6. Spec against code, found and fixed mid-review.** At `8ca0002` a null age and a datastream with no observation both rendered `age unknown old`, and the spec endorsed it. The lead fixed it during the review.

Verdict: FAIL
