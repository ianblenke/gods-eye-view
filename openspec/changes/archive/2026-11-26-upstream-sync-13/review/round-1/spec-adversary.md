Commit read: `2433ce4c90ea01267fb719a5d1112f240b21253b` (branch `upstream-sync`), plus the uncommitted archive `openspec/changes/archive/2026-11-26-upstream-sync-13/` and the working-tree edits in `openspec/specs/` and `openspec/trace/`, all under `/home/ianblenke/docker/gev-work/upstream-sync-13`. This is round 1, full scope. I ran no code and no mutations. The only error in the gate log is `REVIEW-MISSING`.

Verdict: FAIL

- [ ] FINDING major F1 `/home/ianblenke/docker/gev-work/upstream-sync-13/src/app/controls.js:95` and `/home/ianblenke/docker/gev-work/upstream-sync-13/src/camera.js:84-86` (commit 2433ce4c9). The code does not decide on "the page plays the opening". It passes `opening: openingWanted()`, which reads only reduced motion, the embed state, `?intro=0` and `?story` or `?stories`. The later start sequence can refuse the opening after the camera is already at Taiwan with no flight.
  - **Rejected share code.** `parseInitialHash` sets `rejectedShareCode` and returns null (`src/sharelink.js:170-186`), so `hasShareState` is false. `openingWanted()` is true, so no flight starts. `src/app/startupChrome.js:60-64` then refuses the opening. A user with a bad `/share/<code>` link gets no opening and no flight.
  - **Street Level link with no share state.** A hash with `sl=` and no `lat` or `lon` is not a share. `src/standalone/startupChrome.js:13` sets `playOpening` to null, but `openingWanted()` does not read the hash. The links that the app builds carry `lat` and `lon`, so this case needs a hand-made link.
  - **Opening that returns null or is skipped.** `playOpeningIntro` returns null when the logo SVG is not inline yet (`src/app/openingIntro.js:261-264`; `index.html:56` starts with an `<img>`). `startupChrome` also skips the opening after a newer navigation.
  - **Host with no `playOpening`.** The default in `startApplicationChrome` is null, so a host that does not use the standalone chrome never plays an opening, but still loses the flight.
  - **What this contradicts.** `openspec/specs/startup-view/spec.md:7` says the camera MUST fly when there is no share state and the page plays no opening. Line 54 ties "no flight" to a page that plays the opening. Design D4 says "With no opening, the fork flight stays". All three are false for the paths above. `startup-view-007` tests only the reduced-motion split, so no test sees this.
  - **Correction.** Either make the start view use the same conditions as the chrome (at least the rejected code and the Street Level link) and add a test for each. Or change both requirements and D4 to say that the rule follows `openingWanted()`, and name each path above in "Known limits and later changes".

- [ ] FINDING minor F2 `/home/ianblenke/docker/gev-work/upstream-sync-13/openspec/changes/archive/2026-11-26-upstream-sync-13/tasks.md:12-13` (commit 2433ce4c9). The new requirement "Opening start view" and the changed "Default camera pose" have `Origin: spec-first`. `tasks.md` has no task for the tests of `startup-view-006`, `startup-view-007` or `startup-view-001` before the code task 1.8. Add the test task before the code task.

- [ ] FINDING minor F3 `/home/ianblenke/docker/gev-work/upstream-sync-13/openspec/changes/archive/2026-11-26-upstream-sync-13/proposal.md:12,18,29` (commit 2433ce4c9). Line 12 says "A later task lists them", and line 18 says "None yet. A later task adds a backfill capability". Both are plan-time text that the finished change does not complete or close. Line 29 names one edited upstream test, but design D3 names two (`mountApplicationViews.test.mjs` and `qaAircraftViewSheetOutput.test.mjs`). State the final result in these lines.

What I checked and found sound:
- **Normal start.** The order is: planet view, controls construction, Taiwan view, tools, then the opening after the restore and a delay of at least 1000 ms. The opening takes the Taiwan pose as its target. I found no other camera move in that gap on the paths I read.
- **Other start paths.** Reduced motion, `?intro=0`, Stories and embed links keep the flight. Valid share links keep their view.
- **Tests.** `startup-view-001`, `006` and `007` assert their THEN lines. By reading, removing the `opening` argument would fail `007`.
- **Retired scenarios.** `location-presets-003` and `007` are in `retired-ids.json` and absent from `links.json`. The preset choice is still reachable through the Omnibar chips.
- **Child process edit.** The empty `NODE_V8_COVERAGE` in `qaAircraftViewSheetOutput.test.mjs` is named by the known limit `qa-coverage`.
- **Conflict markers.** A search found none.

Skipped or only partly checked: I did not read the conflict hunks of `DATA_SOURCES.md`, `package.json` or `scripts/package-boundaries.json`. I did not verify the translation text, the count of 6 new leak records against the base, or all of `trafficTiming.test.mjs`. I also did not check the second parent of the merge, so the lead must rely on the precheck run and the adopt check for these.
