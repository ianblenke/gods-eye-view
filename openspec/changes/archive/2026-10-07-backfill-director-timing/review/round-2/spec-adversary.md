Verdict: PASS

I read commit fb8f278 statically. All 2 critical and 3 major findings of round 1 are closed, and I found 8 new minors.

Closed, checked against the code and tests. I worked the angle and queue arithmetic by hand and did not run any mutation myself.
- **director-036**: the tests at `playback.test.mjs:925` and `:933` assert wrap order, unknown start and shot identity. Rows m289-m292 kill the slice order, `Math.max(0,..)`, `flatMap` and the shot copy.
- **director-033**: the test at `timeline.test.mjs:315` asserts 360, 360 and 0 (my hand calculation gives the same). Rows m293-m295 kill `+ 540`, `% 360` and `- 180`.
- **document.js**: rows m296-m301 delete the six calls, and each has its own path-asserting test.
- **Version gates**: accept tests at v4, v5 and v6 plus the m302-m305 rows. The reject side holds through the new reject test and the old v3/v4 tests.
- **AND lines of 023/024/026/027**: each matches a test.

- [ ] FINDING minor src/director/playback.test.mjs:378 director-036 names a single scene in the WHEN, but no THEN/AND states its result. This tagged test uses the last scene `b`, so `slice(start, start + 2)` survives every tagged test; only the untagged test at :53 kills it. The entry `scene` field is untested, so `{ scene: { id: scene.id }, shot }` survives. Add AND lines, assert `queue[i].scene`, and add rows.
- [ ] FINDING minor openspec/specs/director/spec.md:20 The WHEN of director-003 is a legacy document (code: version < 3, migration). Its AND lines and the tests at `document.test.mjs:700-770` use versions 1-6 with no migration, so "legacy" has two meanings. Move the version table to director-004 or change the WHEN.
- [ ] FINDING minor src/director/clock.test.mjs:203 Tagged tests assert results that no THEN/AND states. Zero total gives progress 0 (:203, director-023). Stop gives every subscriber the stopped snapshot (:1071, director-024). Add AND lines.
- [ ] FINDING minor src/director/playback.test.mjs:937 The director-037 AND names shots b1, a1, a2 with indices 0, 1, 2, but the test records only phase, index and total. Add `context.shot.id`. Likewise the director-023 line "each later subscriber still gets the state" is asserted only as a call count (`clock.test.mjs:238`).
- [ ] FINDING minor src/director/document.js:130 The accept side of the interactions gate (`>= 6` to `>= 7`) has no test or row in this change. Row m081 is the `true` variant only. The accept test is in `interactions/interactions.test.mjs`, which this change does not mutate. Add a v6 accept test or name a known limit.
- [ ] FINDING minor <archive>/mutations.md:4697 Rows m289-m312 give prose and a test label. Rows m001-m288 give Old/New/Result. `evidence.md` says "exact change", but the exact strings exist only in the scratch `muts.json`. Add Old/New/Result or reword the claim.
- [ ] FINDING minor <archive>/design.md:4 `design.md:4`, `evidence.md:3` and `mutations.md:3` name 43b776a as the commit read. T01-T18 and m289-m312 exist only from 7e50125, and HEAD is fb8f278. `evidence.md` also says "This round adds no commit". Name the real commit or write "working tree on 43b776a".
- [ ] FINDING minor openspec/trace/history.jsonl:2021 The ratchet recorded `ais-store.js` lines 44 to 40 and the branch total 74 to 76 under this change. Nothing here touches that file; the sha is unchanged, and the same flip appears at :132, :1474 and :1880. Name it as count noise in the known limits or restore the base entry.

`<archive>` is `openspec/changes/archive/2026-10-07-backfill-director-timing`.

Not read or run: any gate output (I took the lead's summary), any test or mutation, STE wording, `audit.md` beyond the equivalent probe `equivalent-round2.mjs`, and git history beyond the reflog. The five QA headers show no purpose conflict with the new AND lines.
