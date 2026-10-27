# Review: upstream-sync-9

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-27
Gates: make gates CHANGE=upstream-sync-9 passed
Rounds: 3
Scope: diff 424c34f3
Reviewed-Tree: 8d9c044ef6f60675f8074901aafe438a1b6917a26985028cba83b1a7aeff3c44

## Rule 21 check

The merge commit `ea54ccf9` has the parents `aa4e9df4` (the plan commit) and `15de9d738c4a85be1a96726c6114181caef87eeb`. On 2026-10-27, `git ls-remote upstream main` gave `15de9d738c4a85be1a96726c6114181caef87eeb`, so the upstream remote has the second parent. `evidence/upstream-check.txt` gives the commands and their output. The adopt command used `--from 15de9d738c4a85be1a96726c6114181caef87eeb`.

Resolved files: `Dockerfile`, `SECURITY.md`, `build/vite.js`, `compose.yaml`, `scripts/qa-transit-scenes.mjs`, `server/standalone/vite.config.js`, `src/app/constructCatalog.js`, `src/app/constructCatalog.test.mjs`, `src/app/sourceComposition.test.mjs`, `src/camera.js`, `src/data/layerState.test.mjs`, `src/data/layerStateTokenLedger.test.mjs`, `src/data/localLayers.js`, `src/data/manager.test.mjs`, `src/dockerLauncher.test.mjs`, `src/hud.js`, `src/layers/wind/index.test.mjs`, `src/ui/layerPanel.js` and `src/ui/locationControls.test.mjs`.

## Findings

Round 1 had the scope full, at the commit 7ff92e91. Both reviewers gave FAIL. The corrections changed only files under `openspec/` (documents, evidence and nine named faults that the lead ran on the host). So the lead did not move the change back from the archive, and ran no new ratchet. The commit 424c34f3 holds the corrections. Round 2 had the scope diff 7ff92e91, at the commit 424c34f3. Both reviewers gave PASS.

After round 2, the Spec gates job of CI failed twice with `GATES-TEST-LEAK` for `src/tooling/viteBuild.test.mjs` (decision D17, `evidence/ci-leak.txt`). The lead added a wait of 2000 ms after each `server.close()` in that test file (commit d192f322). The tree changed, so round 3 had the scope diff 424c34f3, at the commit 17c2c5a5. Both reviewers gave PASS.

The reports of round 1 are in `review/round-1/`. The reports of round 2 are in `review/round-2/` and in `review/`. The reports of round 3 are in `review/round-3/`. Each file holds a copy of the report that the lead shortened. The lead removed the lists of checked points and shortened some texts. Each finding keeps its meaning.

Four ratchet runs came before the review. Run 1 stopped on `COVERAGE-DIFF` for `src/hud.js` line 285 (the new test `src/hudMarkingsDom.test.mjs`). Run 2 stopped on `GATES-RATCHET` (the coverage of `src/sources/sourceSlot.js` and 26 test names of `zh-CN`; decisions D14 and D15). Run 3 stopped on three `STE-WORD` errors in test titles. Run 4 gave only `REVIEW-MISSING`.

### Round 1 (commit 7ff92e91)

- [x] FINDING major (spec adversary) The goal of `design.md` named a Known limit `host-timing` that does not exist. Fixed: the goal says that the host skips the allocation test and the gates run it.
- [x] FINDING major (spec adversary) The sentence "Keep the upstream code as it is, except..." listed two edits and left out the others. Fixed: `proposal.md` and `design.md` point to the 19 conflict files and to `evidence/adapted-files.txt`.
- [x] FINDING major (spec adversary) No named fault covered the fork edits of the token, the QA count, the Events group, `wind-010`, `recent-imagery-044`, the cyclone labels and the source slot. Fixed: nine faults, run on the host, in `evidence/faults.txt`.
- [x] FINDING major (STE adversary) Same as the first finding of the spec adversary (the false reference to `host-timing`). Fixed.
- [x] FINDING major (STE adversary) Five tasks gave two instructions. Fixed: tasks 1.7 to 1.28.
- [x] FINDING minor (spec adversary) The CPU-time faults were longer than the limits, and D13 did not say that the limit of the KML roots grows. Fixed: D13 and the Known limit `cpu-time` state the weaker limit.
- [x] FINDING minor (spec adversary) The comment of `scripts/qa-layer-token-twochar.mjs` says "03" and one line is long. Kept: the lead accepts this minor finding under the owner rule. The script computes the token, and a change to the script needs another ratchet.
- [x] FINDING minor (spec adversary) Known limit `allocation-load` said "when the machine was loaded". Fixed: the text states only what `evidence/first-adopt.txt` shows.
- [x] FINDING minor (spec adversary) One task covers eight carried `osh` IDs, and the test tasks come after the code tasks. Kept: the lead accepts this minor finding under the owner rule. The one-task pattern is the established pattern.
- [x] FINDING minor (spec adversary) No limit named the rule `.hud-classification` in `cyber.css`. Fixed: Known limit `hud-classification-css`.
- [x] FINDING minor (spec adversary) The evidence did not name the commit of the checks or of each adapted file. Fixed: `evidence/checks.txt` and `evidence/adapted-files.txt`.
- [x] FINDING minor (STE adversary) "It also stops to export" is not STE. Fixed.
- [x] FINDING minor (STE adversary) "A replaced update" had more than one meaning. Fixed.
- [x] FINDING minor (STE adversary) The words "stale text" and "shipped locale" in the spec `i18n-catalogs`. Kept: the lead accepts this minor finding under the owner rule. A change of spec text changes the scenario hashes and needs another ratchet.
- [x] FINDING minor (STE adversary) "a fake page element" and "named volumes" are loose terms, and the sentence "except for the two lines" counted three edits. Fixed for "fake" (now "stub") and for the sentence. Kept for "named volumes": the lead accepts this minor finding under the owner rule.

### Round 2 (commit 424c34f3)

- [x] FINDING minor (spec adversary) `evidence/faults.txt` did not name the line of the wind fault. Fixed: the text names the return and the check before it.

### Round 3 (commit 17c2c5a5)

- [x] FINDING minor (spec adversary) D17 said "twice in two runs of the same commit", but `evidence/ci-leak.txt` describes one run with two attempts. Fixed: "in two attempts of the same run".
- [x] FINDING minor (spec adversary) The clause "as the memory of an earlier leak of the same kind suggests" named no source in the repository. Fixed: "as an earlier leak of the same kind showed".
- [x] FINDING minor (spec adversary) D17 sat after the section "Purpose at archive time". Fixed: D17 follows D16.
- [x] FINDING minor (STE adversary) Same as the first two findings of the spec adversary. Fixed.
