## 1. Diagnose before you fix

- [ ] 1.1 For each file in section 2 to 8, run `node --test --test-force-exit --test-reporter=tap <file>` inside the gate image, then check `process.getActiveResourcesInfo()` style evidence (the gate's own guard, or a temporary `process.on('exit', ...)` probe) to name the test and the timer that stays live.
  - Read `AGENTS.md` first, and the "Decisions" section of `teardown-guard`'s `design.md` (in the `gev-teardown` tree, branch `teardown-guard`) for the reference technique: a file with a leak prints every result but its `1..N` plan line prints late or not at all under a plain run, and `--test-force-exit` ends the process while the leak is still in the active-resource list.
  - Change no test name. Change no assertion. The fix clears a timer; it does not change what a test checks.

## 2. `src/sharelink.celestial.test.mjs`

- [ ] 2.1 Find the test and the timer or interval that outlives it.
- [ ] 2.2 Clear it: `clearTimeout`/`clearInterval` on the losing side of a race, or a `t.after()` hook, whichever the test's own shape calls for.
- [ ] 2.3 Run `node --test src/sharelink.celestial.test.mjs`. Confirm every test still passes, with the same names and assertions.
- [ ] 2.4 Run `node --test --test-force-exit --test-reporter=tap src/sharelink.celestial.test.mjs` under a 60-second `timeout`. Confirm the plan line prints and the run exits cleanly. Report the test that held the timer.

## 3. `src/tooling/localServices.test.mjs`

- [ ] 3.1 Find the test and the timer that outlives it. Line 126 has a bare `await new Promise((resolve) => setTimeout(resolve, 10))`; confirm whether this one or another site is the leak before changing anything.
- [ ] 3.2 Clear it.
- [ ] 3.3 Run `node --test src/tooling/localServices.test.mjs`. Confirm every test still passes, with the same names and assertions.
- [ ] 3.4 Run `node --test --test-force-exit --test-reporter=tap src/tooling/localServices.test.mjs` under a 60-second `timeout`. Confirm the plan line prints and the run exits cleanly. Report the test that held the timer.

## 4. `src/voice/gevRealtime.test.mjs`

- [ ] 4.1 Find the two tests and the two timers that outlive them. The gate recorded two `Timeout` resources for this file.
- [ ] 4.2 Clear each.
- [ ] 4.3 Run `node --test src/voice/gevRealtime.test.mjs`. Confirm every test still passes, with the same names and assertions.
- [ ] 4.4 Run `node --test --test-force-exit --test-reporter=tap src/voice/gevRealtime.test.mjs` under a 60-second `timeout`. Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 5. `src/annotations/annotationEngine.test.mjs`

- [ ] 5.1 Find the two tests and the two timers that outlive them. Lines 254 and 311 enable `t.mock.timers`; confirm whether a mocked timer or a real one (lines 282, 339, 398) is the leak before changing anything.
- [ ] 5.2 Clear each.
- [ ] 5.3 Run `node --test src/annotations/annotationEngine.test.mjs`. Confirm every test still passes, with the same names and assertions.
- [ ] 5.4 Run `node --test --test-force-exit --test-reporter=tap src/annotations/annotationEngine.test.mjs` under a 60-second `timeout`. Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 6. `src/data/manager.test.mjs`

- [ ] 6.1 Find the two tests and the two timers that outlive them. Lines 2403 and 2456 race a 2-second `setTimeout(() => resolve('starved'), 2000)` against another path; when the other path wins, the 2-second timer is the likely leak.
- [ ] 6.2 Clear each losing timer.
- [ ] 6.3 Run `node --test src/data/manager.test.mjs`. Confirm every test still passes, with the same names and assertions.
- [ ] 6.4 Run `node --test --test-force-exit --test-reporter=tap src/data/manager.test.mjs` under a 60-second `timeout`. Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 7. `src/data/militaryInstallations.test.mjs`

- [ ] 7.1 Find the two tests and the two timers that outlive them. Line 575 awaits a `FLOOR_RESOLVE_DEADLINE_MS + 200` delay; confirm whether this one is a race against another path, or line 632's shorter delay is the leak.
- [ ] 7.2 Clear each.
- [ ] 7.3 Run `node --test src/data/militaryInstallations.test.mjs`. Confirm every test still passes, with the same names and assertions.
- [ ] 7.4 Run `node --test --test-force-exit --test-reporter=tap src/data/militaryInstallations.test.mjs` under a 60-second `timeout`. Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 8. `src/tooling/spec/testGuard.test.mjs`

- [ ] 8.1 This file's leak did not reproduce in one isolated run (`proposal.md`'s "Known limits"). Look at the tests that spawn a real child process — `[coverage-gate-025]`, `[coverage-gate-031]`, `[coverage-gate-033]`, `[coverage-gate-036]`, `[coverage-gate-037]`, `[coverage-gate-038]`, `[coverage-gate-039]`, `[coverage-gate-040]` — for one whose spawned child, or whose own wait on that child, can leave a timer armed.
  - Repeat the run several times, and also run this file alongside the rest of the project suite, since the leak surfaced only under that load.
- [ ] 8.2 Clear the timer found.
- [ ] 8.3 Run `node --test src/tooling/spec/testGuard.test.mjs`. Confirm every test still passes, with the same names and assertions.
- [ ] 8.4 Run `node --test --test-force-exit --test-reporter=tap src/tooling/spec/testGuard.test.mjs` under a 60-second `timeout`, repeated at least five times. Confirm the plan line prints and the run exits cleanly each time. Report the test that held the timer.

## 9. Gates and review

- [ ] 9.1 Run `make lint` until no STE error remains.
- [ ] 9.2 Run `make ratchet CHANGE=test-teardown-cleanup`. Confirm no new untraced test name in any of the seven files, and confirm `GATES-TEST-LEAK` no longer names any of them.
- [ ] 9.3 Run `make gates CHANGE=test-teardown-cleanup`. Read the command output for the verdict, not `results.json`.
- [ ] 9.4 Run the spec-adversary and STE-adversary review. Correct the findings. Record the result in `review.md`.
