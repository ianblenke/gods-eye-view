# Review: osh-camera-link

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-29
Gates: make gates CHANGE=osh-camera-link passed
Rounds: 4
Scope: diff 889604e
Reviewed-Tree: dada9768cdace153326deb385d2ea638fab0927d87f4071e52ce6949c15757f5

## Findings

### Round 1 (scope: full) — FAIL

Full agent reports: `review/round-1/spec-adversary.md`, `review/round-1/ste-adversary.md`.

- [x] critical (spec-adversary F1) `osh-097`'s test coverage never proved a matched, name-eligible camera with no `video: true` record of its own starts no video — no scenario line, no test. Corrected: added an AND line and a fifth `[osh-097]` test.
- [x] major (spec-adversary F2) the new `src/layers/osh/cameraLink.js` was missing from `PROVIDER_FILES` in the hygiene test, so the stricter real-address check silently skipped it. Corrected: added it.
- [x] minor (spec-adversary F3) the fallback's `systemId` filter was never exercised distinctly from the `video:true` check alone. Corrected: strengthened the success test's fixture with a third, unrelated system; verified by mutation.
- [x] minor (spec-adversary F4) `design.md`'s gates section didn't name `cameraLink.js`/its test file. Corrected: added.
- [x] major (ste-adversary S1) "found"/"matched"/"linked" all named the same referent across spec.md, proposal.md, design.md, tasks.md and test names. Corrected: standardized on "matched" everywhere.
- [x] minor (ste-adversary S2-S6, S8) non-approved words, an -ing adjective, present-perfect tense (2 spots), passive voice (2 spots), and semicolon-joined multi-step task instructions (2 spots). All corrected.
- [x] minor (ste-adversary S7) "read" used as a noun (7 spots across design.md, tasks.md, and 2 test names). Corrected in round 3, after round 2's fix attempt missed all 7 spots.

### Round 2 (scope: diff cd33ea5, commit 397b492) — PASS

Full agent reports: `review/round-2/spec-adversary.md`, `review/round-2/ste-adversary.md`.

- [x] (spec-adversary) No findings. All four round-1 findings verified fixed by hand-tracing. Flagged an out-of-scope FYI (index.js wasn't in this round's diff): no test exercised the matched system's own `getDatastreams()` answering `keyRequired:true`. The team lead treated this as a real gap, not a scope technicality: independently verified by mutation (all 175 tests passed with the guard removed), then fixed with a new AND line and test — took two attempts before a genuinely load-bearing fixture was found (an empty `datastreams` array and a missing `openVideo()` stub each separately masked the guard in the first two drafts).
- [x] minor (ste-adversary S9) `tasks.md` said "digit run" where design.md/spec.md say "number token"; `cameraLink.test.mjs` test names said bare "number". Corrected: standardized on "number token".
- [x] minor (ste-adversary S7, carried) still present in 7 spots — round 2's own fix attempt only reworded the code-level paragraphs, missing the design.md D4 heading/Risks section and 2 test names. Corrected in round 3.

### Round 3 (scope: diff 397b492, commit 889604e) — FAIL

Full agent reports: `review/round-3/spec-adversary.md`, `review/round-3/ste-adversary.md`.

- [x] (spec-adversary) No findings on the keyRequired fix itself — verified by hand-tracing and mutation reasoning that it is genuinely load-bearing.
- [x] minor (spec-adversary F1) a leftover assertion message using "read" as a noun, outside this round's diff and likely outside the STE lint's actual scope. Corrected in round 4 for consistency.
- [x] major (ste-adversary S10) design.md's Risk 2 said the extra datastreams call "adds one request when no camera matches" — the exact opposite of D4's own text and the actual behaviour (verified: the call only happens when a camera matches; the no-match test asserts zero extra calls). A contradiction introduced during round 2's own S7 rewrite. Corrected: "adds one request when a camera matches."
- [x] minor (ste-adversary S11) `cameraLink.test.mjs`'s test name had an article on one item of a pair ("the number token and camera") but not the other. Corrected to match design.md's own phrasing.

S10 was major, so round 3 did not qualify for the accept-by-name path despite being the third scheduled round; AGENTS.md's rule that a major finding always stops the build applied regardless of round count.

### Round 4 (scope: diff 889604e, commit 598ebe9) — PASS

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] (spec-adversary) No findings. Confirmed the S10 fix agrees with D4 and the spec's own osh-097 scenario text; re-read the whole design.md end to end for any other contradiction, found none. Confirmed S11's fix is mirrored in trace/links.json. Confirmed the round-3 F1 fix is accurate against its fixtures.
- [x] minor (ste-adversary S12) an assertion message introduced during the F1 cleanup uses "is pending" (an -ing word), a class the automated lint cannot check since it only scans test titles, not assert() message strings. The reviewer found real precedent for this exact usage in 4 other places in the project (weather, sdr, data/manager, startupChrome test files) and found no conflicting sense of "pending" anywhere in this change. Presented to the user; accepted as-is rather than reworded or added to the project's STE word list, on 2026-09-29. Accepted by Ian Blenke.

Round 4 is past the nominal 3-round limit; it was required because round 3 found a major finding (S10), which AGENTS.md's review-round rule requires fixing regardless of round count. The single minor finding that survived round 4 was presented to the user, who chose to accept it by name.
