Verdict: PASS

Tree read: `/home/ianblenke/docker/gev-ci`, branch `ci-leak-cleanup`, tip 7e97d92, read as a working tree. This run had only Read, Grep and Glob, with no shell. I ran no `node --test`, no mutation and no `git diff`. I read the round-2 diff file and the current files. I could not check the gate warnings, because no gate output reached me beyond the lead's line "only REVIEW-MISSING, 0 STE errors".

- [ ] F1 minor `/home/ianblenke/docker/gev-ci/src/data/trafficTiming.test.mjs:340` The new comment says the optimizer and the watcher "started most of these timers". No run named a timer for this file, and the known limit `trafficTiming-timer-unnamed` says so. The proposal says only "the two Vite features that started timers in the other tests". Write: "which started timers in the other Vite tests". The unchanged lines 165-166 also say "(found on the CI runner)" for this file. That claim is out of round-2 scope, but the same edit can correct it.
- [ ] F2 minor `/home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-leak-cleanup/tasks.md:46-48` Tasks 6.6, 6.7 and 6.8 are checked. `review.md` does not exist yet and round 2 is open. This breaks AGENTS rule 17. The precedent `test-teardown-cleanup` left its review tasks unchecked during the review. Uncheck the three tasks, or check them in the commit that adds `review.md`. The gate REVIEW-MISSING still stops the build, so this hides nothing.
- [ ] F3 minor `/home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-leak-cleanup/design.md:5` and `proposal.md:11` The text states the cause of the Docker/runner difference as fact: "The difference is the time at which each timer fires." No run measured it.
  - The Node version is the same (`.node-version` is 24.21.0 and `Dockerfile:5` uses `node:24.21.0-bookworm-slim`). The OS, the CPU count and a whole-project run under coverage differ.
  - For `previewServing`, a tracer on the base that lists no `Timeout` cannot tell "never created" from "fired early".
  - Write: "The cause of the difference is not measured. The time at which a timer fires is the likely cause." Or add this to the known limit `leak-is-timing-dependent`.
- [ ] F4 minor `/home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-leak-cleanup/tasks.md:4` Task 1.2 says "Run the CI workflow on a temporary branch". The round-1 text of the task and `design.md` D3 name a temporary workflow file. `ci.yml` runs only on a pull request or a push to `main`. Say which workflow ran the tracer, and which run gave the gates and the format check.
- [ ] F5 minor `/home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-leak-cleanup/design.md:40` "The same run on the branch without the fixes" names two different runs as one. Write "A run of the same command on the branch without the fixes".

Checked, and it holds:
- **Code and test diff.** It changes only the comment in `src/data/trafficTiming.test.mjs`. Test names, assertions and config are unchanged since round 1.
- **The retained wait.** The 50 ms timer that survives a module request is real in the Vite 6.4.3 source.
  - `_registerRequestProcessing` is called at `dep-Dm0c1Wj2.js:35745`.
  - `markIdAsDone` then calls `checkIfCrawlEndAfterTimeout`, which arms a 50 ms `setTimeout` at line 48189.
  - `cancel()` (line 48162) only sets a flag, so the 750 ms wait still covers this timer.
  - The comment states "not confirmed by a run".
- **The Vite options.** `isDepOptimizationDisabled` is true for `noDiscovery` with an empty `include` (line 14726). The 200 ms timer is in `runOptimizer` (line 47285).
- **The flights layer claims.**
  - `enrichment.js:46` sets the drip timer.
  - `lifecycle.js:311` clears it only in teardown.
  - The file calls `ensureFleetModel` only in the shared fleet-loader body (lines 279 and 313).
  - No later test needs a drained queue, so `enrichment-queue-stops` holds.
  - The mock is the first statement of the test body (line 252).
- **The ledger.** `gaps.json:4204` already records `src/layers/flights/enrichment.js` at the worst end (88/21/4), with an "unstable" range in `history.jsonl:11`. No line names `ci-leak-cleanup`. The known limit `enrichment-coverage-moves` is accurate. The lead's Docker gate reported no ledger change.
- **The ratchet task.** The removed task is right. No scenario, test name or code file changes. `coverage-gate-048` to `coverage-gate-050` already cover the leak check, so no new scenario is needed.
- **The format claims.** Only `src/tooling/previewServing.test.mjs` is in `scripts/format-scope.json`, and round 2 did not change it. Neither `make gates` nor `scripts/spec` runs the format check or `check:boundaries`, so `gates-skip-ci-steps` is right.
- **The job names and the stop.** The names "Node 24.14.0", "Node 26.x" and "Windows onboarding" match `ci.yml`. `ci.yml` has no `continue-on-error`, so a failed format step stops the job.
- **Round-1 corrections.** The round-1 spec findings F1 to F7 are correct in the current text. F5 is corrected, but it adds F1 above.

Not verified by execution:
- Removing `watch: null` from `previewServing`.
- Removing `optimizeDeps` from `previewServing`.
- Removing the mock line from `trackedModelRegime`.
- Running the tracer on `trafficTiming`.

The lead's runner evidence covers each fix at file level. The base leaked in all three files, and the fix branch leaked in none. For `trafficTiming` no run named a timer, so no per-setting mutation can show a fix. The known limit `trafficTiming-timer-unnamed` records this.
