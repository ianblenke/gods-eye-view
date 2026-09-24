# Skeptic verdicts of round 1

One skeptic for each major or critical finding. Minor findings had none.

## ste S2: real=True, severity fair=True, fix ok=True

Real. proposal.md:3 says "Both check that the gate reports a live timer." Only [coverage-gate-049] (gates.test.mjs:980-997) does that: it injects a leak record and asserts status 1 and /ERROR GATES-TEST-LEAK src\/math\.test\.mjs/. [coverage-gate-050] (gates.test.mjs:999-1013) injects `leaks: []` and asserts status 0 and doesNotMatch(/GATES-TEST-LEAK/), so the gate must NOT report a live timer. The spec scenario agrees with the test: openspec/specs/coverage-gate/spec.md:268-273 says "reports no live-timer error". The sentence is therefore false for one of the two tests, and it names the same two tests that the tasks and design describe. It breaks the major rule "does not agree with the code, the specs or the other prose". The severity is fair. I read the cited files and did not need a mutation, because the finding claims none.

Fix: acceptable. "Both test the gate check for a live timer." has 9 words and covers both the positive and the negative case. The paragraph stays at 4 sentences. Two small weaknesses remain. (a) design.md:16 and :34 already call this thing "the leak check". The fix adds a second name, "gate check for a live timer", which is a minor one-word-one-meaning risk under STE check 2. (b) "check" is a noun in the fix, and the verb "check" is the one the ste-adversary spec prefers, so a reader could parse "the gate check" as "the gate" plus a verb. Preferred wording: "Both test the leak check of the gate." It has 8 words, agrees with both tests and design.md, and has one clear meaning. The proposed wording is still a valid fix if the author keeps it. Neither weakness is major.

## ste S4: real=True, severity fair=True, fix ok=True

Confirmed. gates.test.mjs has two tests with the tag [coverage-gate-049]: line 980 "stops for a test that leaves a live timer" (no option at origin/main; the diff adds GUARDED_RUN) and line 1016 "stops for a real child process that leaves a live timer, with no stub" (already had GUARDED_RUN at origin/main). tasks.md:3 says "the test `[coverage-gate-049]` that stops for a live timer", which fits both. Task 1.1 could therefore act on the test that already has the option. proposal.md:3 says "One test has the tag `[coverage-gate-049]`", which reads two ways: the only such test, or one of the two failing tests. It also disagrees with the code, and with design.md:5, which names "the test that has the same tag `[coverage-gate-049]` and starts a real child process" that "already has the option". So the finding fits the major rule (two possible meanings, and no agreement with the code and the other prose). The tag is even wider in the repo: testGuard.test.mjs has two more 049 tests (lines 460 with GUARDED_RUN, 479 without).\n\nProposed fix, checked with lintMarkdown in a private copy at /tmp/.../n24-r1/skeptic-ste-S4. tasks.md:3 becomes "1.1 Add `GUARDED_RUN` to the test `[coverage-gate-049]` that has no option and stops for a test that leaves a live timer." It is exactly 20 words, so it passes the limit of 20, with 0 lint findings. Keep both clauses: "has no option" alone would also match testGuard.test.mjs:479 ("records a live timer at the exit of a test process"), and the title clause alone still fits line 1016 by loose reading. The proposal.md:3 rewrite ("One test has the tag `[coverage-gate-049]` and no option, and the other has the tag `[coverage-gate-050]`.") is 16 words and adds no new lint finding (the only warning is the existing STE-ING "missing" at line 7). Optional polish: paragraph 1 says "no option" before paragraph 3 names `GUARDED_RUN`, so "no `GUARDED_RUN` option" reads more clearly. Unrelated, not part of this finding: proposal.md:3 says both tests "check that the gate reports a live timer", but [coverage-gate-050] (gates.test.mjs:999) asserts the gate does NOT report GATES-TEST-LEAK.

## ste S3: real=True, severity fair=True, fix ok=False

REAL, major is fair. The design.md fix fails the STE lint, so fixOk is false.

Evidence
- gates.test.mjs has no GUARDED_RUN on these tests, and each calls runGates through run() or directly: coverage-gate-016 (:139), gap-ledger-030 (:151), spec-trace-002 (:342), coverage-gate-047 (:481), coverage-gate-026 (:505), coverage-gate-035 (:527), coverage-gate-030 (:586, real spawnSync in its forger) and gap-ledger-053 (:704). ci-gates-009 (:545) and ste-lint-011 (:377) also run the gates CLI without the option.
- So proposal.md:7 "Each other test of this file that runs the gates has the option GUARDED_RUN" is false as written.
- The finding's cited lines are right. The `passes(root, ['init'])` calls are at gates.test.mjs:982 and :1001. gates.mjs:237-239 is where the gate reports guard violations. The guard writes the code at test-guard.mjs:296-301, and missingTestContext is at test-guard.mjs:237.

Mutation, in a private copy
- Location: /tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/n24-r1/skeptic-ste-S3/copy.
- In the copy, test-guard.mjs:296 was forced to `noContext = 'Node simulated has no getTestContext...'`, and GUARDED_RUN was removed from the two tests (the main state).
- Result: coverage-gate-049 and coverage-gate-050 fail at `passes()` (gates.test.mjs:84 from :982 and :1001, status 1 !== 0). The output was "ERROR COVERAGE-NO-TEST-CONTEXT ... Gates failed with 3 errors."
- coverage-gate-016, spec-trace-002, -047, -026, -035, -030 and gap-ledger-053 all pass in the same run without the option.
- So the real cause is that the two tests need `init` to pass, and the gate stops with COVERAGE-NO-TEST-CONTEXT. Running the gates on a fixture is not the cause: 026, 035 and 030 do that and are fine.
- design.md:26 "because they run the gates on a fixture" is therefore a wrong reason.

The two-names point is also true.
- The spec (openspec/specs/coverage-gate/spec.md:247 and :249) uses "each test that needs the guard to count assertions" in both lines.
- The archived change 2026-09-17-harden-gate-ledger/design.md:40 made those two lines one group of words on purpose.
- design.md:26 has the short form "needs the guard" twice, and design.md:22 has it once.

Proposed fix, judged separately
- proposal.md:7 fix is acceptable. It is 19 words and lints clean. It adds a third phrase, "needs a gate run without the error", for the same group of tests.
- design.md:26 fix is WRONG. I applied it in the copy and ran `node scripts/spec/gates.mjs lint --root <copy>`. It gives "ERROR STE-SENTENCE design.md:26 The sentence has 26 words. The limit is 25."

Correct fix (lint: 0 errors, 262 warnings, the same as the baseline)
- proposal.md:7: "Each other test of this file that needs the guard to count assertions has the option `GUARDED_RUN`." This is 18 words and uses the spec's one group of words. The proposal's paragraph 2 already explains the error.
- design.md D2 paragraph, split the sentence and give the scenario's full words in sentence 2: "It checks the scenario `coverage-gate-046`: each test that needs the guard to count assertions has a skip reason, and the other tests have none. The two tests need the guard to count assertions. Each test calls `passes(root, ['init'])`, and the gate stops with `COVERAGE-NO-TEST-CONTEXT` when the guard cannot count assertions." Sentence 2 is 24 words, the new sentences are 8 and 16 words, and the paragraph has 6 sentences (the limit).
- Optional: design.md:22 "needs the guard" could also become "needs the guard to count assertions". Sentence 1 is then 21 words.

The real repo was not changed by me. Its working tree already had unstaged changes to proposal.md, design.md and tasks.md before I started, and all my edits were in the copy.

## ste S1: real=True, severity fair=True, fix ok=False

REAL, major is fair, the proposed fix is wrong.

Cited text (git show HEAD:openspec/changes/archive/2026-09-24-ci-node-24-skip/proposal.md, line 7) is exactly as quoted: "The same errors show in the CI runs of 2026-09-22 to 2026-09-24. Earlier faults hid them." (The working tree was edited while I worked; proposal.md line 9 now has different text. I judged HEAD.) "show" and "hid" cannot both hold for one run. "Earlier faults" and "them" name nothing. Neither design.md nor tasks.md names a fault. So the text has two possible meanings. The other cited facts hold: ci-leak-cleanup/proposal.md:5 says a failed `npm run format:check` stops the job and the later steps do not run. .github/workflows/ci.yml has no continue-on-error (lines 15-55). The step order is doctor (l.42), format:check (l.45), check:boundaries (l.48), then npm test (l.51). ci-leak-cleanup/review/spec-adversary.md:31 also says so. "hid" is not flagged by the repo lint (scripts/spec/lib/ste.mjs checks only sentence length, paragraph length, passive voice and -ing words), and "hide" is already used in openspec/specs/osh/spec.md:572, so the word-approval doubt is not a defect.

The finding's premise is only half true. I measured it in private copies under scratchpad/n24-r1/skeptic-ste-S1 with `node scripts/format.mjs --check`. It passes at f219dbf and 22f6e09 (main before the credential-boundary merge). It fails with "Needs formatting: src/tooling/previewServing.test.mjs" at 9cb5307 and 45eb85e (the credential-boundary merge into main, 2026-09-23 22:10 -0400). At 22f6e09, `node scripts/setup-doctor.mjs --json` and `node scripts/check-package-boundaries.mjs` also pass. Also at 22f6e09 the tests [coverage-gate-049] (gates.test.mjs:980) and [coverage-gate-050] (:999) have no GUARDED_RUN. So the runs before the credential-boundary merge reached `npm test` and could show the two errors. This agrees with the lead's fact (1). The runs from that merge until the ci-leak-cleanup fix were stopped by the format step and could not show them. The finding's sentence is therefore wrong for the whole range, and it is right that HEAD line 7 disagrees with the ci-leak-cleanup prose.

The proposed fix is wrong. "in the runs of 2026-09-22 to 2026-09-24, so no run showed these errors" is false for the runs before the credential-boundary merge. It also contradicts the lead's fact (1) and the finding's own "if" condition. It lints clean (0 errors), but it makes the text untrue.

Correct fix: split the range at the format fault and use change names, not dates. Change names come from git and do not depend on a time zone. Replace the last two sentences of line 7 with: "The CI runs before the change `credential-boundary` show these errors. After that change, the step `npm run format:check` stopped the job before the step `npm test`. The first run after the change `ci-leak-cleanup` shows the errors again." Sentences have 13, 16 and 11 words, and the paragraph has 6 sentences. That is within the limits. I ran `node scripts/spec/gates.mjs lint --root <copy>` on it: 0 errors, and the only warning on that line is the old STE-ING "missing".

The lead's new working-tree paragraph (proposal.md:9) is close to this and acceptable if the dates come from `gh run list` in UTC. Credential-boundary was committed 2026-09-23 22:10 -0400, which is 2026-09-24 02:10 UTC. In local time, the runs on the evening of 09-23 would already have the format fault. Its second sentence should also say "before the change `ci-leak-cleanup`", because the first run after that change is also dated 2026-09-24.
