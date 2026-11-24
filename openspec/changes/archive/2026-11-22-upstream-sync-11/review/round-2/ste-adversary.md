Verdict: FAIL

Commit read: `8047d72a2` in `/home/ianblenke/docker/gev-work/upstream-sync-11`. Round 2, scope `diff 08b1338c2`. I read the files and the log `sync11-docs4.log`. I did not run the lint or any test.

All paths below are in `/home/ianblenke/docker/gev-work/upstream-sync-11/openspec/changes/archive/2026-11-22-upstream-sync-11/`, unless the path starts with `src/`.

Round 1 findings: I checked each one against the text. All are fixed, with one exception, the "ratchet" finding. `design.md:24` still has "ratchet", and I report it as F3 below.

The `-ing` and passive warnings for the new lines in the log do not show a new fault. The `-ing` words are "hiding", "setting", "timing", "passing", "remaining" and "needing". F3 and F4 cover the ones in text that changed in this round. The passive warnings are "is removed", "are retired", "is given", "is placed" and "is configured". Old copied spec text is out of scope. The same applies to the `share-codec` and `voice-panel` lines.

- [x] FINDING major tasks.md:32 "Keep these scenarios of `osh`: osh-057, osh-031, osh-059, osh-061, osh-062." Disagrees with the delta spec and with the line before it.
  - `osh-031` already appears in task 1.29 (line 31), so the ID is listed twice.
  - `osh-059` is not in `specs/osh/spec.md`. The delta modifies only the requirements "Systems layer" and "Entity depth and horizon". In `openspec/specs/osh/spec.md` the ID `osh-059` is at line 477, in the requirement "Feature entities", which the change does not modify. The delta spec mentions `osh-059` only as a reference (line 94).
  - The delta spec lists `osh-057` in "Systems layer". The task lists no scenario that the delta spec does not hold, except `osh-059`.
  - Write: "Keep these scenarios of `osh`: osh-057, osh-061, osh-062."

- [x] FINDING minor design.md:24 "Upstream gives no exception to the ratchet." Round 1 asked for "boundary tests" in place of "ratchet", and this line was missed. "Ratchet" is also the command `make ratchet`, so it has two meanings. Write: "Upstream gives no exception to the boundary tests."

- [x] FINDING minor proposal.md:54 and specs/osh/spec.md:108 "the hiding", "Leave the hiding beyond the horizon". "hiding" is a verb that the text uses as a noun and an `-ing` word. Write: "No test of the fork shows that the renderer hides the points." and "Leave the hiding of points beyond the horizon to the renderer" becomes "Let the renderer hide the points beyond the horizon".

- [x] FINDING minor proposal.md:54 "the layer sets `horizonCull` and the tests check that setting." "setting" is a noun from a verb. Write: "the layer sets `horizonCull`, and the tests check its value."

- [x] FINDING minor proposal.md:56 "The record never ends." It has two possible meanings: the record has no end date, or the record never shrinks. Both are true, so the severity is minor. Write: "The record has no end date." Also write "a leak depends on the timing of the run" as "the run time decides whether a leak occurs", because "timing" is an `-ing` word.

- [x] FINDING minor specs/coverage-gate/spec.md:33 "depends on the timing of the run". This has the same fault as the previous finding. Write: "because the run time decides whether a live timer occurs".

- [x] FINDING minor design.md:50 "The test file `src/hudMarkingsDom.test.mjs` is removed." This is passive, and the active form is possible. Write: "The change removes the test file `src/hudMarkingsDom.test.mjs`."

- [x] FINDING minor proposal.md:38 "scenarios are retired" This is passive, and the active form is possible. Write: "Decision D6 retires scenarios of these capabilities."

- [x] FINDING minor src/voice/panel/inactivityBranches.test.mjs:62 "refuses a bad new limit". "bad" is vague. Write: "refuses a new limit that is not valid". This is a test name and the fault is not a banned word, so the severity is minor.

Checked and true against the code, with no finding:
- `coverage-gate-107` against `scripts/spec/gates.mjs:120`.
- The count of 114 `GATES-TEST-LEAK` entries in `openspec/trace/upstream-test-findings.json`.
- The nine retired-and-rewritten scenario IDs in `proposal.md:19`, `proposal.md:33-35` and `design.md:77`.
- The seven upstream tokens and the fork tokens in `proposal.md:50` and `design.md:40-44`.
- The scenarios 009 to 011 of `up42-scene-overlay` against `proposal.md:52`.

Not checked: the retired-scenario IDs in the other delta specs, and `openspec/specs/` against the delta text. I did not check whether `voice-panel-034` suits both of its tests. The scenario says the timer cancels its task when destroyed. The two tests check an aborted signal and a timer that stops being quiet. I read them as one topic.
