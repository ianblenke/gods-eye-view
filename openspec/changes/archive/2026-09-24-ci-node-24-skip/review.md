# Review: ci-node-24-skip

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-24
Gates: make gates CHANGE=ci-node-24-skip passed
Rounds: 3
Scope: diff 4b4ae4a
Reviewed-Tree: 6b89cdb1f052a30e9b2ea56dacc969d332ec1aea00ee7716d62dee91693d9bbf

## Findings

- [x] Round 1 ste-adversary S1 to S4 (major): the runs where the job reached the step `npm test`, the two tests that check the gate report of a live timer, the criterion for the option `GUARDED_RUN`, and the two tests with the tag `[coverage-gate-049]`. All corrected. The skeptics confirmed each finding.
- [x] Round 1 ste-adversary S5 to S15 (minor): word choice, one word for one thing, the range of Node versions that `package.json` accepts, the two lists that a test checks, and the acceptance task. Corrected at the places that the findings name. S15 (a task that checks the CI job after the push) is kept, because the CI run after the push is the acceptance test, and the lead reports it.
- [x] Round 1 spec-adversary F1 to F4 (minor): the verdict is PASS. The test names, the criterion for the option, the run dates, and two gaps. All corrected, or recorded as the known limits `local-gates-cannot-prove-it`, `later-steps-not-yet-run-on-24-14` and `coverage-gate-030-no-option`.
- [x] Round 2 ste-adversary S1 and S2 (major): the dates need a time zone and a split by the change `ci-leak-cleanup`, and the goal and task 1.5 must name the one assertion that changes. Both corrected as the findings propose. The minors S3 to S11 are corrected too.
- [x] Round 2 spec-adversary F1 to F4 (minor): the verdict is PASS. All corrected.
- [x] Round 3 spec-adversary: the verdict is PASS, with no finding.
- [x] Round 3 ste-adversary S1 and S2 (minor): the verdict is PASS. The build step comes after the allocation probes, and one line names the list for `gates.test.mjs`. Both corrected.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since the commit `308e3ba`, and round 3 since `4b4ae4a`. The code and test files did not change after round 1.
- [x] Trace: no test name, scenario or gap changes. The first gates run failed the test `[coverage-gate-046]`, because it pins the list of tests with the option. The list now has the two names, and the second gates run passed.
- [x] Constraints: the change touches no OSH file and adds no network call.

## Evidence

- [x] In the CI run after `ci-leak-cleanup`, the job "Node 24.14.0" failed exactly the tests `[coverage-gate-049]` and `[coverage-gate-050]` with the error `COVERAGE-NO-TEST-CONTEXT`. The other three jobs passed.
- [x] The tests of both changed files pass on Node 26 on the host. The proof that the job passes on Node 24.14.0 is the CI run after the push.

## Coverage of the changed code files

No code file changes. The two changed files are test files.
