## 1. Diagnose before you fix

- [x] 1.1 Read `AGENTS.md` first.
- [x] 1.2 Read `teardown-guard`'s own `design.md` for the diagnostic method.
  - For each file in section 2 to 8, run the file with the force-exit flag and the tap reporter, inside the gate image.
  - Name the test and the timer that stays live, before you change anything.
  - A file that leaks prints every result, but its plan line prints late or not at all under a plain run.
  - The force-exit flag ends the process while the leak is still live, so its resource list is readable.
  - Keep all test names and current assertions. Add only the assertion that section 5's own notes describe.

## 2. `src/sharelink.celestial.test.mjs`

- [x] 2.1 Find the test and the timer that outlives it.
- [x] 2.2 Clear it with a clear call on the side of a race that loses, or a hook that always runs.
- [x] 2.3 Run the file.
- [x] 2.4 Confirm every test still passes, with the same names and assertions.
- [x] 2.5 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
- [x] 2.6 Confirm the plan line prints and the run exits cleanly.
- [x] 2.7 Report the test that held the timer.

## 3. `src/tooling/localServices.test.mjs`

- [x] 3.1 Find the test and the timer that outlives it.
  - Line 126 awaits a bare ten-millisecond delay. Confirm whether this site or another is the leak first.
- [x] 3.2 Clear it.
- [x] 3.3 Run the file.
- [x] 3.4 Confirm every test still passes, with the same names and assertions.
- [x] 3.5 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
- [x] 3.6 Confirm the plan line prints and the run exits cleanly.
- [x] 3.7 Report the test that held the timer.

## 4. `src/voice/gevRealtime.test.mjs`

- [x] 4.1 Find the two tests and the two timers that outlive them.
  - The gate recorded two live timers for this file.
- [x] 4.2 Clear each.
- [x] 4.3 Run the file.
- [x] 4.4 Confirm every test still passes, with the same names and assertions.
- [x] 4.5 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
- [x] 4.6 Confirm the plan line prints and the run exits cleanly.
- [x] 4.7 Report the two tests that held a timer.

## 5. `src/annotations/annotationEngine.test.mjs`

- [x] 5.1 Find the one test and the two timers that outlive it.
  - Lines 254 and 311 enable a mock timer. Confirm whether a mocked timer or a real one is the leak first.
  - One test, the one that checks a clear call against queued upgrades, holds both.
- [x] 5.2 Keep the default retry delays.
  - Round 1 passed an empty retry-delay list and skipped the retry wait instead. That also skipped the read `isStale()` makes of `clear()`'s state after the wait. That read is the only place any test exercises this real link. The isolated retry-function tests use a fake `isStale` instead.
- [x] 5.3 Enable the mock clock before `annotate()` runs, not after `clear()`.
  - A real timer made before the test enables the mock clock stays on its own clock. It outlives the test, whatever a later mock-clock tick does. A third, unreviewed draft of this fix made exactly that mistake, and a written check on `fetchesStarted` after the tick could not tell the difference. See `design.md`'s D1 for the full account of all three earlier drafts.
  - `AGENTS.md` rule 13 applies here. A fix needs a check that it works, not an assumption from its shape.
- [x] 5.4 Let the retry wait tick to completion on the mock clock.
- [x] 5.5 Capture no timer id.
  - `clear()` increases its generation counter before it aborts. `isStale()`'s check reads the generation counter first. So the counter, not the abort signal, is what a run of this line proves.
  - This change's prose in round 2 named the abort signal instead. That was wrong. `design.md` and `proposal.md` now name the counter.
- [x] 5.6 Add one assertion: the retry does not fetch again once its wait completes.
  - This restores what the round-1 fix dropped, and closes the round-2 fault the same fix carried. It is the one exception to "keep all current assertions" in this whole change.
- [x] 5.7 Change `isStale` in this call to a function that always returns false.
  - This is the mutation proof. `fetchesStarted` reads 4, not 2, once the mock clock ticks past the wait. Each started task retries once more. The new assertion fails. Confirmed.
- [x] 5.8 Run the file.
- [x] 5.9 Confirm every test keeps its original name.
- [x] 5.10 Confirm that only the test of queued upgrades gains the one new assertion.
- [x] 5.11 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
- [x] 5.12 Confirm the plan line prints and the run exits cleanly.
- [x] 5.13 Report the test that held the two timers.
  - The one that checks a clear call against queued upgrades. 22/22 tests pass. Clean exit. Repeated four times over, all clean.

## 6. `src/data/manager.test.mjs`

- [x] 6.1 Find the two tests and the two timers that outlive them.
  - Lines 2403 and 2456 race a two-second give-up timer against another path. The side that loses is the likely leak.
- [x] 6.2 Clear each timer on the side that loses.
- [x] 6.3 Run the file.
- [x] 6.4 Confirm every test still passes, with the same names and assertions.
- [x] 6.5 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
- [x] 6.6 Confirm the plan line prints and the run exits cleanly.
- [x] 6.7 Report the two tests that held a timer.

## 7. `src/data/militaryInstallations.test.mjs`

- [x] 7.1 Find the two tests and the two timers that outlive them.
  - Lines 575 and 632 each await a delay. Confirm which one, or both, are the leak first.
- [x] 7.2 Clear each.
- [x] 7.3 Run the file.
- [x] 7.4 Confirm every test still passes, with the same names and assertions.
- [x] 7.5 Run the file with the force-exit flag and the tap reporter, under a 60-second limit.
- [x] 7.6 Confirm the plan line prints and the run exits cleanly.
- [x] 7.7 Report the two tests that held a timer.

## 8. `src/tooling/spec/testGuard.test.mjs`

- [x] 8.1 Look for the leak among the tests that spawn a real child process.
  - Five repeats, and a run beside the rest of the project suite, found no live timer.
  - The lead independently repeated this three more times. Also clean each time.
  - No test and no timer to name. The leak stands as an open known limit, not fixed.
- [ ] 8.2 Clear the timer found.
  - Not done. No reproduction means no case that fails, to prove a fix against.
- [x] 8.3 Run the file.
- [x] 8.4 Confirm every test still passes, with the same names and assertions.
  - True, but this was never in question: no line in the file changed.
- [x] 8.5 Run the file with the force-exit flag and the tap reporter, five times over.
- [x] 8.6 Confirm the plan line prints and the run exits cleanly each time.
- [x] 8.7 Report the test that held the timer.
  - Clean every time. No test held a timer in any of these runs.

## 9. Gates and review

- [x] 9.1 Run the lint gate until no STE error remains.
- [x] 9.2 Run the ratchet gate for this change.
  - Confirm no new untraced test name in any of the seven files.
  - Confirm the leak check no longer names any of the seven files.
  - `Gates passed.` No `GATES-TEST-LEAK` error, for any file, including `testGuard.test.mjs`.
- [ ] 9.3 Run the full gate for this change. Read the command output for the verdict, not the result file.
- [ ] 9.4 Run the spec-adversary and STE-adversary review. Correct the findings. Record the result in `review.md`.
  - Round 1: both PASS. Spec-adversary's F1 named a text mismatch here, now corrected. STE-adversary gave 19 minor findings, all corrected in this file, `proposal.md` and `design.md`.
  - The round-1 spec-adversary's first attempt used the wrong repository copy. A later, corrected re-run found a major fault in the round-1 fix for section 5. The empty retry-delay list skipped the real retry wait. It skipped, with it, the only test of `isStale()`'s read after that wait.
  - Round 2: the tool for the review agents changed mid-round, from a Claude subagent to `codex -m gpt-6-astra`, on the user's own instruction. Round 2's spec-adversary found a second, different major fault in that same fix. The timer it captured was real, but the fix cleared it before it ever fired, so `isStale()` still never ran.
  - Round 2 also caught a wrong claim in this file's own prose: that the fix reads `engine.clear()`'s abort signal. `clear()` increases its generation counter first. `isStale()`'s check reads that counter first too. So the counter, not the signal, is what a run of this line actually proves.
  - Section 5 now mocks the clock before `annotate()` ever runs, and ticks the mock wait to completion. It asserts no second fetch follows, with a named mutation that proves the assertion is not vacuous. See section 5 for the full account.
