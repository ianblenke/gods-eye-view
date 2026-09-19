**Round 3, spec adversary — osh-observation-age.** Scope: `9e33fd8`, clean tree, baseline 166 pass / 0 fail.

Both blockers and the minor are closed. Eight mutations, **zero survivors**.

| mutation | result | caught by |
|---|---|---|
| Q7 drop the ahead guard, round-1 M4 | RED | `[osh-050] a record far ahead of the clock is not fresh` |
| Q5 hour to twenty-four hours, M5 | RED | `[osh-032] an age past the threshold does take the word old` |
| Q6 hour to sixty seconds, M6 | RED | `[osh-050] the thresholds are the numbers the specification names` |
| **Q8 layer: any negative age moves, round-2 P6** | **RED** | `[osh-031] a newest result from far ahead of the clock leaves the entity where it was` |
| Q1 `isOshObservationAhead` `<` to `<=` | RED | `[osh-032] the panel and the freshness rule agree at the skew bound itself` |
| Q2 ahead always false | RED | far-ahead and the literal pins |
| Q3 ahead bound reuses the hour | RED | the bound-agreement test |
| Q4 skew five to ten minutes | RED | bound-agreement and the literal pins |

Q1 is the one that matters. With the bound in one function, flipping it fails the new agreement test. The three-copy version survived that flip, so the refactor is not cosmetic: it created the only test that can catch a drift.

**Coherence, clean extract, seventeen values** including positive and negative infinity and `undefined`: `osh-detail-old` appears exactly when `isOshObservationFresh` is false; `ahead of the clock` exactly when `isOshObservationAhead` is true; nothing is both fresh and ahead. Zero incoherent cells, and no gap between or at either bound.

I first ran this probe against the directory my own sweep was mutating and got a false alarm. I discarded it and re-ran isolated.

**Base text re-verified.** `osh-032` seven of seven `main` lines verbatim. `osh-031` four of five, only the THEN reworded, which is forced because the old line is false under this change. All other carried scenarios identical. Both requirement texts unchanged.

**One cosmetic defect, not blocking.** The new function was inserted between `isOshObservationFresh`'s doc comment and its body, so one function carried two stacked blocks and the other none.

What I tried beyond the above: both threshold literals moved in four directions, the ahead predicate negated and re-pointed at the wrong constant, the motion gate relaxed, and the full render surface swept at both bounds and one millisecond either side.

Verdict: PASS
