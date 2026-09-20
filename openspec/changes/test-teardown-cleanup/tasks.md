## 1. Diagnose before you fix

- [ ] 1.1 Read `AGENTS.md` first, then read `teardown-guard`'s own `design.md` for the diagnostic method.
  - For each file in section 2 to 8, run the file with the force-exit flag and the tap reporter, inside the gate image.
  - Name the test and the timer that stays live, before you change anything.
  - A leaking file prints every result, but its plan line prints late or not at all under a plain run.
  - The force-exit flag ends the process while the leak is still live, so its resource list is readable.
  - Change no test name and no assertion. The fix clears a timer. It does not change what a test checks.

## 2. `src/sharelink.celestial.test.mjs`

- [x] 2.1 Find the test and the timer that outlives it.
- [x] 2.2 Clear it with a clear call on the losing side of a race, or a hook that always runs.
- [x] 2.3 Run the file. Confirm every test still passes, with the same names and assertions.
- [x] 2.4 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
  - Confirm the plan line prints and the run exits cleanly. Report the test that held the timer.

## 3. `src/tooling/localServices.test.mjs`

- [x] 3.1 Find the test and the timer that outlives it.
  - Line 126 awaits a bare ten-millisecond delay. Confirm whether this site or another is the leak first.
- [x] 3.2 Clear it.
- [x] 3.3 Run the file. Confirm every test still passes, with the same names and assertions.
- [x] 3.4 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
  - Confirm the plan line prints and the run exits cleanly. Report the test that held the timer.

## 4. `src/voice/gevRealtime.test.mjs`

- [x] 4.1 Find the two tests and the two timers that outlive them.
  - The gate recorded two live timers for this file.
- [x] 4.2 Clear each.
- [x] 4.3 Run the file. Confirm every test still passes, with the same names and assertions.
- [x] 4.4 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
  - Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 5. `src/annotations/annotationEngine.test.mjs`

- [x] 5.1 Find the two tests and the two timers that outlive them.
  - Lines 254 and 311 enable a mock timer. Confirm whether a mocked timer or a real one is the leak first.
- [x] 5.2 Clear each.
- [x] 5.3 Run the file. Confirm every test still passes, with the same names and assertions.
- [x] 5.4 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
  - Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 6. `src/data/manager.test.mjs`

- [x] 6.1 Find the two tests and the two timers that outlive them.
  - Lines 2403 and 2456 race a two-second give-up timer against another path. The loser is the likely leak.
- [x] 6.2 Clear each losing timer.
- [x] 6.3 Run the file. Confirm every test still passes, with the same names and assertions.
- [x] 6.4 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
  - Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 7. `src/data/militaryInstallations.test.mjs`

- [x] 7.1 Find the two tests and the two timers that outlive them.
  - Lines 575 and 632 each await a delay. Confirm which one, or both, are the leak first.
- [x] 7.2 Clear each.
- [x] 7.3 Run the file. Confirm every test still passes, with the same names and assertions.
- [x] 7.4 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
  - Confirm the plan line prints and the run exits cleanly. Report the two tests that held a timer.

## 8. `src/tooling/spec/testGuard.test.mjs`

- [x] 8.1 Look for the leak among the tests that spawn a real child process.
  - This file's leak did not reproduce in one isolated run. See `proposal.md`'s known limit.
  - Repeat the run several times, and also run this file beside the rest of the project suite.
- [x] 8.2 Clear the timer found.
- [x] 8.3 Run the file. Confirm every test still passes, with the same names and assertions.
- [x] 8.4 Run the file with the force-exit flag and the tap reporter, five times over.
  - Confirm the plan line prints and the run exits cleanly each time. Report the test that held the timer.

## 9. Gates and review

- [ ] 9.1 Run the lint gate until no STE error remains.
- [ ] 9.2 Run the ratchet gate for this change.
  - Confirm no new untraced test name in any of the seven files.
  - Confirm the leak check no longer names any of the seven files.
- [ ] 9.3 Run the full gate for this change. Read the command output for the verdict, not the result file.
- [ ] 9.4 Run the spec-adversary and STE-adversary review. Correct the findings. Record the result in `review.md`.
