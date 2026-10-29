## Why

The owner asked on 2026-10-28 to refresh the fork from upstream.
Upstream has 106 commits after the ninth sync. The first-parent history of upstream has 11 commits in that range, and each one merges a pull request.

The pull requests fix the Scene Director callbacks and the seek of layers. They also mark a stale traffic layer and pause polled refreshes while the tab is hidden.
They pause terrain requests after an error 429, and they change the text for a stale fire-perimeter snapshot.
Upstream also adds the locale `zh-Hant`, keeps layer errors in English in data, and releases version 0.3.0.

## What Changes

- Merge the upstream commit `2bcdca1c9a2bc0a34074577cc5f4de01d4759233` in two steps. The first step merges the commit `e608fee7` into the plan commit. The second step merges the later upstream head `2bcdca1c`. The plan commit has the base commit `e2637a5e` as its parent.
- Resolve the seven content conflicts. `design.md` gives the resolution of each file.
- Add the 20 fork texts to the new catalog `src/i18n/locales/zh-Hant.json` and remove its stale text.
- Add `zh-Hant.json` to the two fork packages that list `zh-CN.json` in `scripts/package-boundaries.json`.
- Change the limit of one upstream timing test to CPU time. Decision D5 gives the reason.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Keep the upstream code files as they are, except for the one test file of decision D5.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

Upstream changed 212 files between the shared ancestor and the commit `2bcdca1c`: 14 added, 128 removed and 70 changed (`evidence/diff-count.txt`). The removed files are changelog fragments of `changelog.d/` that the release 0.3.0 put into `CHANGELOG.md`.
17 files changed on both sides. Seven of them have a conflict.

Rule 23: the 14 added files are upstream files, because the fork does not write them. The manifest lists only paths that the fork writes.
The change adds no layer, no route and no QA script. It adds no layer token.

Rule 25: the merge breaks the run of `[i18n-catalogs-001]` for `zh-Hant`. Decision D2 fixes it, so the change retires no scenario and writes none again.
The scenario `i18n-catalogs-001` runs once for each shipped locale, so it covers `zh-Hant` with no new scenario. Decision D2 describes the work on the `zh-Hant` catalog.

The change has no spec delta, because the merge changes no requirement of the fork.
`package.json` changes only the version, which is now 0.3.0. `package-lock.json` changes the same version fields.

## Known limits and later changes

- Known limit `zh-Hant`: The lead wrote the 20 Traditional Chinese texts. No native speaker checked them.
- Known limit `changelog`: Upstream puts each new changelog entry in a file under `changelog.d/`. The fork still edits `CHANGELOG.md`, so a later sync can have a conflict there again.
- Known limit `cpu-time`: The edited test cannot see a delay that costs no CPU time. The old wall-time limit of 200 ms could see such a delay, but the limit failed the test under the load of the gates.
- Known limit `backfill`: Specs and tests for the new upstream areas of sync 9 are still open. This change does not add them.
