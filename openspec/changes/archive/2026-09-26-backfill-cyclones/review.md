# Review: backfill-cyclones

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-26
Gates: make gates CHANGE=backfill-cyclones passed
Rounds: 2
Scope: diff 59d046caec80c5724a3455753d71f8505e4821c5
Reviewed-Tree: 80680e0fe3f2e9df72ac8af0412555b817a37b043eb6e613b7b1c5045937c37a

## Findings

- [x] Round 1 spec-adversary F1 (critical): the scenario `cyclones-024` said that a hit "within 1 px" serves a click, and the code tests `Math.abs(...) < 1`. Corrected: the scenario says "less than 1 px from the click on each axis".
- [x] Round 1 spec-adversary F2 (major): the first worker had changed one word in the name of one old test. Corrected: no old test name changed, except for the tag. The full gates refuse the banned word "prior" in a tagged name, so that one old test has no tag (known limit `cyclones-untagged-old-test`). The lead compared all 32 old names with `origin/main` after removing the tags, before and after the formatting: all 32 are the same.
- [x] Round 1 spec-adversary F3 (major): the ratchet command wrote history lines for `lifecycle.js`, `wind/rendering.js` and `worldOverlay.js`, which this change does not edit. Named as the known limit `cyclones-ratchet-noise`, with the values. No test of this change closes these gaps, and the lead did not edit the ledger by hand.
- [x] Round 1 spec-adversary F4 and F5 (minor): F4 is not a defect (the gate output had only `REVIEW-MISSING`). F5 is corrected in the prose, and the warnings for the old test names stay (known limit `cyclones-old-test-names`).
- [x] Round 1 ste-adversary F1 to F3 (major): corrected in the proposal, the design and the tasks. The documents no longer say that a word of an old name changed.
- [x] Round 1 ste-adversary F4 to F8 (minor): corrected in the proposal, the design and the tasks. Each task now has one instruction, and the tag of the old tests is a sub-line.
- [x] Round 1 ste-adversary F9 to F14 (minor): these are old test names that exist on `origin/main`. They keep their words, because the rule of the owner is that an old test name does not change. Known limit `cyclones-old-test-names`.
- [x] Round 1 ste-adversary F15 (minor): corrected. The name of the new test is now "after clear, a selection change leaves the removed center as it was".
- [x] Round 2 spec-adversary F1 (minor): the phrase "a pending add" is corrected in the proposal after the round.
- [x] Round 2 ste-adversary F1 and F2 (minor): corrected in the design and the proposal after the round, with no new round.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since the round-1 commit `59d046c`. Both agents of both rounds ran as read-only `codex` runs with the model `gpt-6-sol`, by decision of the owner of 2026-09-26. The lead wrote their output to `review/round-<n>/` without change.
- [x] Trace: the scenarios `cyclones-001` to `cyclones-025` are new. The gate shows 404 scenarios verified with 0 open. 31 of the 32 old tests got a tag, and 78 tests are new.
- [x] Constraints: the change edits no production file (`git diff --name-only origin/main` lists only files of `openspec/` and `*.test.mjs` files of the layer). It adds no request method for an OpenSensorHub server, no network call and no name or ID of a server of the owner. No old test name changed except for the tag.

## Decisions and deviations

- [x] Ratchet run: the ratchet command refuses a new untraced name, so the lead put the four files of `openspec/trace/` back to their content on `origin/main` and ran the ratchet command again. The four files are output of the command, with no hand edit. The history lines of this change come from that last run (15 lines).
- [x] The untagged old test stays untraced (one entry with count 1 for `rendering.test.mjs` in `openspec/trace/gaps.json`). The owner can decide in a later change if it gets a new name and a tag.
- [x] Formatting: after round 2, the CI step `npm run format:check` showed two files. The lead ran `node scripts/format.mjs --write` for `index.test.mjs` and `rendering.test.mjs`. The change is white space only: the test names are the same, and all 121 tests of the layer pass.
- [x] Counts of the new tests: after round 2 the lead found that the proposal and the tasks said 78 new tests, and that the 11 tests that kill the 11 test gaps were not counted. The lead counted the tests with a script: 89 new tests and 32 old tests, 121 in total. The proposal and nine tasks now give the correct counts. The change is a change of numbers only.
- [x] Coverage: `index.js` keeps one branch that no test can reach (known limit `cyclones-finally-continuation`). A waiver is not possible, because this change does not edit the file.

## Evidence

- [x] The gates run before the review files (`make gates CHANGE=backfill-cyclones`, after the archive of round 2) showed `Trace: 404 scenarios, 404 verified, 0 open`, `STE: 0 errors` and `Ledger: 0 entries do not match the current gaps`. Its only error was `REVIEW-MISSING`. The gates run after this file is the final check.
- [x] The lead ran these checks of the CI job on the tree, in the Docker image `gods-eye-view:upstream`: `npm run doctor`, `npm run check:boundaries` and `npm run format:check` (the last one after the formatting). The lead did not run `npm run build` and `npm test`. The change edits no production file, and the gates run all 6223 tests.

## Coverage of the changed code files

- [x] `source.js`, `labels.js` and `rendering.js` of `src/layers/cyclones/`: complete. The files have no ledger entry, and the gate shows no gap.
- [x] `index.js`: lines and functions complete, and one branch not covered (the ledger entry).

## Mutation report

The author ran 256 mutations of the production code, and the runner restored each file after each run. The list is in `review/mutations/muts.json`, and the results are in `review/mutations/mutation2.log`. A mutation that no test fails is a finding.

- [x] First battery (image `gods-eye-view:upstream`, Node 24): 237 mutations KILLED, 2 KILLED by a time limit and 17 SURVIVED.
- [x] The 17 survivors, judged by the worker and re-run on the host with Node 26 (`review/mutations/survivors.json.log`): 11 were test gaps (003f, 004o, 005h, 012b, 014f, 017i, 019m, 019n, 023h, 023j, 025k). New tests kill all 11.
- [x] 6 are equivalent mutants (005l, 017j, 019b, 024p, 025m, 025n). The known limit `cyclones-equivalent-mutants` gives the reason for each. Each stays SURVIVED in the log.
- [x] The tasks name at least one mutation for each scenario `cyclones-001` to `cyclones-025`, and the test file that fails is in the log.
