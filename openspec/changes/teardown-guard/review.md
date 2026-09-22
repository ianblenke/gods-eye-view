# Review: teardown-guard

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-22
Gates: make gates CHANGE=teardown-guard passed
Rounds: 4
Scope: diff 80367af7e1866e7fcce442f8f0471a4a0791db2f
Reviewed-Tree: 5553d9e842f2e785552d93fdf78f50d500eca758be59fc72cb68ad8195e2a151

## Findings

- [x] Round 1 spec-adversary F1 (major): seven `osh-061`/`osh-062` tests in `src/data/oshLayer.test.mjs` had no teardown guard — added by other, already-merged work after this change's own 64-test scope. Two select a system and can leave a real poll timer live. Added `t.after()` to all seven, kept the one call whose effect an assertion reads, mutation-proven.
- [x] Round 1 spec-adversary F2 (critical): the `coverage-gate-049` unit test in `testGuard.test.mjs` never exercised the real process-exit → guard → file-write path, only a direct `createGuard()` call with a synthetic resource list. Added a second `coverage-gate-049` test that spawns a real guarded child process with a real live timer.
- [x] Round 1 spec-adversary F3 (critical): `runParallel.test.mjs`'s `coverage-gate-022` fix cleared `NODE_V8_COVERAGE` along with the guard-identity env, taking real coverage-tracked code (`run-parallel.mjs`) out of measurement. First fix attempt (restore `NODE_V8_COVERAGE` alone) reintroduced the original pollution bug, caught by a real `make gates` run — reverted. Final fix (round 2): an isolated `coverageDir` plus explicit blank `GEV_SPEC_*` overrides, keeping both properties.
- [x] Round 1 spec-adversary F4 (critical): `coverage-gate-048` in `gates.test.mjs` read the raw trace destination instead of `mainRun.output`, the `.sync` file `measure()` actually reads under forced exit.
- [x] Round 1 spec-adversary F5 (minor): the `labelArbiter.js`/`localGeojsonCore.js` coverage-count history movements were undocumented. Neither file is touched by this change; documented as pre-existing, tolerance-absorbed measurement flakiness, predating this change (starts 2026-09-15, before `teardown-guard` began).
- [x] Round 1 spec-adversary F6 (minor): the `trafficTiming.test.mjs` settle-wait is an unproved mitigation. Recorded as a known limit left open in `proposal.md`.
- [x] Round 1 ste-adversary S1, S2 (major): the proposal/design undercounted the change's own scope — one requirement where there are two, three `localGeojson.test.mjs` sites where there are four. Corrected.
- [x] Round 1 ste-adversary S3–S5 (major): three ambiguous or contradictory sentences in `tasks.md` and `specs/coverage-gate/spec.md`, corrected.
- [x] Round 1 ste-adversary S6–S44 (39 minor): colour idioms, passive voice, `-ing` words, phrasal verbs, and four new test names reworded to drop their subject. All corrected.
- [x] Round 2 spec-adversary F2 (critical): the round-1 real-child test used `node -e` (no `process.argv[1]`), so its leak record's own `file` field was always empty and never checked. Switched to a real temp script file, asserted `leaks[0].file`.
- [x] Round 2 spec-adversary F3 (critical): the round-1 F3 fix (restoring `NODE_V8_COVERAGE`) reintroduced the exact pollution bug — confirmed by a real `make gates` run reproducing the blank-file `GATES-TEST-LEAK`. Reverted to clearing `NODE_V8_COVERAGE`, with `withGuardEnv()`'s actual mechanism (its `gateRun` check keyed on the child's coverage folder matching the real gate's) now explained in the code comment.
- [x] Round 2 spec-adversary F4 (critical): `coverage-gate-048` checked only record count and status, not test identity. Added a `fullName` assertion.
- [x] Round 2 spec-adversary F1, F5 (minor): the `localGeojson.test.mjs` site-count precision (shared with S2 below) and the `labelArbiter.js` coverage-history documentation, both corrected with more detail.
- [x] Round 2 ste-adversary S2 (major): `design.md`'s four-site count still implied all four end with a teardown pair; corrected to name the fourth's kept mid-test call, matching `proposal.md`.
- [x] Round 2 ste-adversary S45–S47 (major): an unstated condition, an ambiguous "the other", and a misattached parenthetical, corrected.
- [x] Round 2 ste-adversary S48 (minor): an `-ing` word removed.
- [ ] S20 minor (round 2 ste-adversary): six `tasks.md` items each pack two instructions. Not split into separate numbered tasks. `tasks.md` has no established sub-numbering convention. Every one of the six task IDs is also referenced elsewhere by number, so a full renumbering is invasive for a style preference. The round-3 ste-adversary review confirmed this stays minor, not major or critical. Accepted by the lead.
- [ ] S21 minor (round 2 ste-adversary): the same fault, at tasks 2.4 and 3.4. Accepted by the lead, for the same reason.
- [x] Round 3 spec-adversary F1 (minor): `src/data/oshLayer.test.mjs`'s real total (77 tests, 75 with the teardown hook) was never recorded; added to task 6.4.
- [x] Round 3 spec-adversary F3 (critical): the isolated-`coverageDir` fix proved only that no error fired, not that real coverage was collected — a silent regression that stopped coverage entirely would have passed vacuously. Added an assertion that the isolated folder holds a real `coverage-*.json` file, in both `runParallel.test.mjs` and `gates.test.mjs`. Mutation-proven: deleting `NODE_V8_COVERAGE` from the child's env makes the new assertion fail.
- [x] Round 3 spec-adversary F4 (critical): the `fullName` assertion alone still let a record with the correct name and wrong file pass. Added a `file` assertion, computed from the trace reporter's own `path.relative(cwd, data.file)` logic and confirmed against a real run.
- [x] Round 3 spec-adversary F5 (minor): the `labelArbiter.js` documentation still lacked the specific recurrences and restoration commits from this review's own ratchet runs. Named them (`scopeMask.test.mjs` at `d94964e`, `cockpitMarkup.test.mjs` at `f30b40c`, later `flights.test.mjs` at `8a7c1c0`).
- [x] Round 3 ste-adversary S49 (major): task 6.4's forward reference ("records the file's current total") pointed at a task with no counts in it. Added the counts (see F1 above).
- [x] Round 3 ste-adversary S50 (major): a sentence wrongly attributed "unexplained... flakiness" to task 5.10, which documents a live-timer defect with a known cause and fix. Corrected to state the `labelArbiter.js` branch-count cause is unknown, separately from task 5.10.
- [x] Round 4 (narrow confirmation of round 3's F1, F3, F4, F5 and S49, S50 only, per the review-round-limit): ste-adversary gave `Verdict: PASS`, confirming S49 and S50 closed, S20/S21 correctly still classified minor and accepted. spec-adversary found one residual imprecision in the round-3 F1 fix — "Two make no layer at all" was false for one of the two tests, which creates a layer without calling `init()` on it. Corrected in the same round; a second, narrowly-scoped spec-adversary check confirmed the correction and gave `Verdict: PASS`.

## Whole-project measurement flakiness encountered during this review, not caused by this change

Roughly a dozen `make gates`/`make ratchet` cycles across all four review rounds hit the project's own pre-existing, documented whole-project measurement instability (see the `whole-project-trace-flakiness-not-explained` memory): the standing untraced-test-name undercounting bug recurred on `src/scopeMask.test.mjs`, `src/cockpitMarkup.test.mjs` (twice), `src/data/flights.test.mjs`, `src/data/aisLiveVessels.test.mjs`, `src/data/aisWatchdog.test.mjs`, `src/data/cctvCards.test.mjs` and `src/data/cctvLod.test.mjs` — none of them files this change touches — and, newly observed this session, the same class of bug hit `openspec/trace/links.json`'s tagged-scenario link registry for `osh-032` (also not a file this change touches). Several `TRACE-UNVERIFIED`/`LEDGER-STALE` errors on `osh-057`, `osh-061`, `osh-062` and other files self-corrected on a bare retry with no code change. Every recurrence was verified against the real source with a regular-expression extraction before being restored, and confirmed once more it never touches a file this change itself edits.
