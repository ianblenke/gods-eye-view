# ste-adversary round 4 — osh-camera-link

Scope: diff 889604e (commit 598ebe9)
Verdict: PASS

S10 confirmed closed: design.md:50 now reads "The extra call that reads datastreams adds one request when a camera matches." The only wording change was "no" to "a"; the sentence is now consistent with D4 and with Risk 1's own reasoning.

S11 confirmed closed: cameraLink.test.mjs's test name matches design.md D2's own phrasing verbatim; `openspec/trace/links.json` was updated to the identical string.

## New finding this round

- [x] S12 minor `src/data/oshLayer.test.mjs:4030` "is pending" — words that end in -ing. The lint cannot catch this because it only checks traced test titles, not assert() message strings. On its own the phrase is unambiguous, and has real precedent for this exact sense elsewhere in the project (`src/layers/weather/weather.test.mjs:284`, `src/sdr/controller.test.mjs:467`, `src/data/manager.test.mjs:1770`, `src/standalone/startupChrome.test.mjs:102`, all "... is pending" for an unresolved async call). No conflicting sense of "pending" found anywhere in this change. Accepted by Ian Blenke rather than reworded or added to `openspec/ste/words.json`'s `allowedIng` list — see review.md.

No other lines in this round's 4-line diff have STE issues. Since this is round 4 and the only open item is minor, it is accepted by name per the round-limit rule rather than triggering a round 5.
