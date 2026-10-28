## Why

The owner asked on 2026-10-28 to refresh the fork from upstream.
Upstream has 106 commits after the ninth sync. The first-parent history of upstream has 11 commits in that range, and each one merges a pull request.

The pull requests fix the Scene Director callbacks and the seek of layers. They also mark a stale traffic layer, pause polled refreshes while the tab is hidden, pause terrain requests after an error 429, and change how a stale fire-perimeter snapshot reads.
Upstream also adds the locale `zh-Hant`, keeps layer errors in English in data, and ships the version 0.3.0.

## What Changes

- Merge the upstream commit `2bcdca1c9a2bc0a34074577cc5f4de01d4759233` in two steps. The first step merges the commit `e608fee7` into the plan commit, and the second step merges the commit `2bcdca1c` of the newer upstream head. The plan commit has the base commit `e2637a5e` as its parent.
- Resolve the seven content conflicts. `design.md` gives the resolution of each file.
- Add the 20 fork texts to the new catalog `src/i18n/locales/zh-Hant.json` and remove its stale text.
- Add `zh-Hant.json` to the two fork packages that list `zh-CN.json` in `scripts/package-boundaries.json`.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Keep the upstream code as it is.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

The merge changes 212 files: 14 added, 128 removed and 70 changed. The removed files are changelog fragments of `changelog.d/` that the release 0.3.0 folded into `CHANGELOG.md`.
17 files changed on both sides. Seven of them have a conflict.

Rule 23: the 14 added files are upstream files, because the fork does not write them. The manifest lists only paths that the fork writes.
The change adds no layer, no route and no QA script. It adds no layer token.

Rule 25: the merge breaks no test with a scenario ID. The change retires no scenario and writes none again.
The scenario `i18n-catalogs-001` runs once for each shipped locale, so it covers `zh-Hant` with no new scenario. Decision D2 gives the fork texts.

The change has no spec delta, because the merge changes no requirement of the fork.
`package.json` changes only the version, which is now 0.3.0. `package-lock.json` changes the same version fields.

## Known limits and later changes

- Known limit `zh-Hant`: The lead wrote the 20 Traditional Chinese texts. No native speaker checked them.
- Known limit `changelog`: Upstream puts each new changelog entry in a file under `changelog.d/`. The fork still edits `CHANGELOG.md`, so a later sync can have a conflict there again.
- Known limit `backfill`: Specs and tests for the new upstream areas of sync 9 are still open. This change does not add them.
