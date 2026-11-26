Commit read: `ee0b84752` in `/home/ianblenke/docker/gev-work/upstream-sync-13`, plus the uncommitted archive `openspec/changes/archive/2026-11-26-upstream-sync-13/` and the edits in `openspec/specs/` and `openspec/trace/`. This is round 2, with scope diff `2433ce4c9`. I ran no code and no mutations. The only error in the gate log is `REVIEW-MISSING`.

**Round-1 findings**

- **F1 (major) is corrected.**
  - `rejectedShareCode` is set before `controls.js` reads it. The `ApplicationShell` constructor creates `this.shareLinkManager` (`src/ui/applicationShell.js:550`). It then calls `attachLinks` synchronously (line 596), which runs `parseInitialHash` and `_parseShareCode` (`src/sharelink.js:216`). `createApplicationControls` reads the value only after `new Controls(...)` returns.
  - A rejected code returns null state, so `hasShareState` is false. The controls then pass `opening: false`, and the default flight starts. `src/app/startupChrome.js:63` also refuses the opening in this case.
  - The third assertion of `startup-view-007` needs one flight with `openingWanted()` true and a rejected code. By reading, it fails without the new condition. This agrees with the lead's mutation.
  - The requirement "Opening decision", D4, the main spec and the code agree. The Known limit `opening-fallback` names the Street Level link, the logo that is not inline and the host with no opening. The first and third agree with `src/standalone/startupChrome.js:13` and with the null default of `playOpening`. The second agrees with the null return at `src/app/openingIntro.js:264`. The newer-navigation case is not named, but the text gives its list as examples only, and in that case another navigation owns the camera.
- **F2 (minor) is corrected.** Test task 1.8 now comes before code task 1.9.
- **F3 (minor) is corrected.** The plan-time text is gone, and the proposal now refers to both upstream test edits in D3.

**Other checks on the diff**

- The delta specs agree with the main specs, and the Purpose lines agree with D2 and D4.
- The test names for `startup-view-001`, `006` and `007` agree with `links.json`.
- The changed comments in `src/camera.js` and `mountApplicationViews.test.mjs` are true.
- The ledger gap counts for `src/app/controls.js` stay at 1 branch and 1 function. The branch total rose from 9 to 10, and the history lines name this change.

**New findings**

- [ ] FINDING minor `/home/ianblenke/docker/gev-work/upstream-sync-13/openspec/specs/startup-view/spec.md:65` (and line 70, and the same text in the archived delta). The requirement uses "page settings" and does not define the term. The code means `openingWanted()`: no reduced motion, not embedded, no `?intro=0`, and no `?story` or `?stories`. A reader can think that a Street Level link or a logo that is not inline is also part of the "settings". The Known limit `opening-fallback` says that it is not. The fork scenario asserts only the reduced-motion condition; the other conditions have assertions in `src/app/openingIntro.test.mjs` without this scenario ID. Name the conditions in the requirement or in `design.md` D4, or record this as a known limit. Do this without a new requirement text if the author wants to keep the scenario hash.

Not checked: I ran no tests, I did not confirm that the shipped page inlines the logo SVG before the opening starts, and I did not read the round-1 STE report.

Verdict: PASS
