# Review: ci-leak-cleanup

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-24
Gates: make gates CHANGE=ci-leak-cleanup passed
Rounds: 2
Scope: diff 282ca08
Reviewed-Tree: 86f51e3a9b336f5fbeffb804de7765afc3817ea84a91f3294dbc1f1c9b8f8ffa

## Findings

- [x] Round 1 ste-adversary S1 to S7 (major): the step of the format check in the CI jobs, the tracer that named the timers of two files only, the evidence sentences, the source of the leaking timers, the military test that sets no timer, the run of the fix branch, and the three tests that use Vite. All corrected. The skeptics confirmed each finding and corrected three of the proposed fixes.
- [x] Round 1 ste-adversary S8 to S32 (minor): word choice, passive voice, one word for one thing, tasks with two instructions, and the known limits for the timer of `trafficTiming.test.mjs`. Corrected at the places that the findings name. S16 is kept in part, because the perfect tenses state the fact of one run.
- [x] Round 1 spec-adversary F1 to F7 (minor): the verdict is PASS. The non-goal wording, the evidence wording, task 1.4, the coverage wording, the comment about the wait, the drip timer of the flights layer, and the step of the CI jobs. All corrected or recorded as the known limits `local-gates-cannot-prove-it`, `flights-drip-timer-mocked`, `enrichment-queue-stops` and `enrichment-coverage-moves`.
- [x] Round 2 spec-adversary F1 to F5 (minor): the verdict is PASS. The wording of a comment, the state of the review tasks, the cause of the difference between the Docker image and the runner, the name of the temporary workflow, and one sentence about two runs. All corrected.
- [x] Round 2 ste-adversary S33 to S50 (minor): the verdict is PASS. Word choice, one word for one thing, the claim about the wait of 750 ms, the acceptance test, the format check on the runner, and two comments of `src/data/trafficTiming.test.mjs`. All corrected.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since the commit `282ca08`. The diff holds the comment change and the three documents against their round-1 text.
- [x] Trace: no test name, scenario or gap changes. The gates report no stale trace, and the ratchet has nothing to record.
- [x] Constraints: the change touches no OSH file and adds no network call. No test name changes and no assertion changes.

## Evidence on the GitHub runner

The runs used a temporary workflow on a temporary branch of the fork. The branch is deleted. The runner is Ubuntu 24.04 with four CPUs and Node 24.21.0.

- [x] On the branch without the fixes, the gates listed `GATES-TEST-LEAK` for `src/data/trackedModelRegime.test.mjs`, `src/tooling/previewServing.test.mjs` and `src/data/trafficTiming.test.mjs`. The format check named `src/tooling/previewServing.test.mjs`.
- [x] The tracer named a 200 ms and a 50 ms timer of the Vite dependency optimizer in `src/tooling/previewServing.test.mjs`. It named a 165 ms drip timer of the flights layer in `src/data/trackedModelRegime.test.mjs`.
- [x] On the branch with the fixes, the gates without the tracer listed no `GATES-TEST-LEAK`. The tracer listed no pending timer for the three files. The format check printed no error.

## Coverage of the changed code files

No code file changes. The three changed files are test files.

## Mutation proof

Each mutation removes one fix in a private copy, and the tracer runs the file in the Docker image with the force-exit flag.

- [x] Remove the mock timer from `src/data/trackedModelRegime.test.mjs`: the tracer lists one pending `Timeout`, the drip timer.
- [x] Remove `watch: null` from `src/tooling/previewServing.test.mjs`: the tracer lists one pending `Timeout`, the 1000 ms throttle timer of the file watcher.
- [x] Remove the optimizer options from `src/tooling/previewServing.test.mjs`: the Docker image shows no leak. The runner showed two timers on the branch without the fixes. This mutation does not reproduce in the image.
- [x] Remove the options from `src/data/trafficTiming.test.mjs`: the Docker image shows no leak. The whole-project gates on the runner listed one `Timeout` on some runs. This mutation does not reproduce in the image.
