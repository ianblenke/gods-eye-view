# spec-adversary round 3 — osh-camera-link

Scope: diff 397b492 (commit 889604e)
Verdict: PASS

Verified the round-2 keyRequired fix by hand-tracing against `src/layers/osh/index.js:303-326`: the fixture gives the matched system's own read a real `video: true` record and a working `openVideo()` stub, so `result.keyRequired` is the only live sub-condition the new test can trip. Mutation reasoning confirms removing `|| result.keyRequired` from the guard would make the test's zero-views/zero-players assertions fail — genuinely load-bearing; neither of the team lead's two earlier failure modes survives in the final fixture.

Confirmed S7 and S9 fully fixed across specs/osh/spec.md, design.md, proposal.md, tasks.md — no remaining noun-"read" or terminology drift, no new -ing-as-noun/adjective forms introduced.

## New finding this round

- [ ] F1 minor `src/data/oshLayer.test.mjs:4030` — an assertion message reads `'the camera read is in flight'`, using "read" as a noun (the S7 pattern). Pre-existing line, outside this round's diff, and likely outside the STE lint's actual scope (assertion messages aren't listed alongside "test names" in `openspec/config.yaml`). Does not block. Fixed anyway in round 4 for consistency with the S7 theme.
