Verdict: PASS
- [ ] F1 minor /home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-node-24-skip/design.md:11 (also tasks.md:7) The corrected proposal.md:15 now says "No assertion changes except that list". Design Goals ("Keep every test name and every assertion") and task 1.5 ("Confirm that every test keeps its name and its assertions") still say no assertion changed. The expected array in the `deepEqual` of `[coverage-gate-046]` did change (testGuard.test.mjs:444-445). A reader who does task 1.5 as written finds a change. Write "except the list in the test `[coverage-gate-046]`" in both places.
- [ ] F2 minor /home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-node-24-skip/design.md:26 and design.md:30 D2 now says the test `[coverage-gate-046]` checks two lists, but line 30 still says "in its list" and does not say which one. Line 26 also ends "when the guard cannot count them", where "them" has no clear noun. The round-1 skeptic wrote "count assertions". Write "in the list for `gates.test.mjs`" on line 30 and "count assertions" on line 26.
- [ ] F3 minor /home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-node-24-skip/proposal.md:9 The dates have no time zone. The round-1 skeptic measured that `credential-boundary` was committed 2026-09-23 22:10 -0400, which is 2026-09-24 02:10 UTC. The split between "reached npm test" and "format:check stopped the job" is true only for UTC dates. A reader who sees local run dates finds runs on the evening of 2026-09-23 that the format fault stopped. Write "(UTC)" after the dates, or name the change `credential-boundary` as the split.
- [ ] F4 minor /home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-node-24-skip/design.md:5 "the test `[coverage-gate-049]` that starts a real child process already has the option" still fits both 049 tests in gates.test.mjs. Test 980 wraps the real `spawnSync` in its stub, and test 1016 starts the real processes through the gate. Task 1.1 and proposal.md:3 now name the changed test correctly, but this sentence points to the wrong one. Use the title of test 1016: "stops for a real child process that leaves a live timer, with no stub".

**Corrections checked, all right:**
- **S1:** the text now matches the lead's measured facts, apart from the time-zone gap in F3.
- **S2:** "Both test the gate check for a live timer" is true for test 980, which asserts `GATES-TEST-LEAK` is reported. It is true for test 999, which asserts it is absent.
- **S3, criterion:** all 31 `passes(root, ['init'])` calls in gates.test.mjs are inside tests that have `GUARDED_RUN`.
  - The `passes(root, ['lint'])` calls are in tests with no option (lines 357, 380, 382). They run no tests, so no guard error reaches them.
  - `[coverage-gate-030]` is the only unguarded test that runs real test processes with `init`. Its known limit is accurate, because its three assertions do not depend on the guard error. The lead's CI fact (only 049 and 050 failed) agrees.
- **S3, sentence length:** the D2 paragraph has 6 sentences (the limit) and its longest sentence has 24 words.
- **S4:** task 1.1 has 20 words, which is the limit. The pinned list at testGuard.test.mjs:444-446 has the three names in file order, and each equals its test name.
- **Known limits:**
  - `local-gates-cannot-prove-it` is true: the Dockerfile uses `node:24.21.0`, and `.node-version` says 24.21.0.
  - `later-steps-not-yet-run-on-24-14` is true: `run-unit-tests.mjs:75-76` returns when the parallel phase fails, and the probes run on 24.x.
  - The design Risks sentence is true: only tests 980 and 1016 assert `GATES-TEST-LEAK` is reported, and both skip on 24.14.0.
- **Other checks:**
  - Neither changed test file is in `scripts/format-scope.json`, so `format:check` (task 2.4) is not affected by this change.
  - No history line, ledger entry or ID change is needed.
  - There is no requirement with an `Origin`, so the spec-first check does not apply.

S15 (a task that checks the CI job after the push) stays open as a minor finding, which the lead accepted. `local-gates-cannot-prove-it` names the CI run as the proof.

Method: this session had no shell tool. I ran no `node --test`, no lint and no mutation, and I did not run `git diff`. The code diff is empty this round. I checked the test and code claims by reading the tree, and I checked the STE limits by hand.
