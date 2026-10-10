## Context

Base commit: `13d715511b4c1aabf943de9c2ba25cb174d3db45`.
Upstream commit: `591f299d11f38a612629a274463196d57ae3862e`.
The command `git ls-remote upstream main` returned the upstream commit on 2026-10-10.
The shared ancestor is the commit `6be25595`, which sync 4 merged.

The first parent of the merge commit is the plan commit. The plan commit has the base commit as its parent.
The upstream commit is the second parent.
The lead must record the check of the second parent in `review.md`.

## Conflict resolutions

A trial merge in the clone reported six conflicts. All six are content conflicts in text files.

| File | Resolution |
|---|---|
| `CHANGELOG.md` | Keep the fork entries first and the upstream entries after them. |
| `docs/CURRENT-STATE.md` | Keep the upstream paragraphs first, because they belong to the introduction, and the fork Ontario section after them. |
| `src/app/constructCatalog.js` | Keep the upstream `source` option of the Directions and Recent Imagery calls, and the fork call `createApplicationOsh()` after them. |
| `src/data/layerState.test.mjs` | Keep the upstream layout and the fork token values 4, 5 and 6, because the OSH layer owns the token 3. |
| `src/layers/recentImagery/rendering.test.mjs` | Keep the fork tests and add the upstream test after them. |
| `src/layers/recentImagery/thumbnails.test.mjs` | Keep the fork tests and add the upstream test after them. |

## Decisions

### D1: The layer count

Two upstream tests count 30 layers: `src/app/constructCatalog.test.mjs` and `src/app/sourceComposition.test.mjs`.
The fork catalog has 31 layers, because it adds the OSH layer. The change edits both numbers to 31.
The fault is to remove `createApplicationOsh()` from the catalog. Both tests then fail.

### D2: No spec delta

The merge changes no requirement of the fork. No test with a scenario ID fails on the merged tree.
So the change has no spec delta, as sync 3 had none.

### D3: The adopt command

The merge brings upstream tests with no scenario ID and upstream files with a coverage gap.
The adopt command records them. The rule 21 check of the second parent goes into `review.md`.

### D4: The OSH layer and the source composition

The fork OSH layer has no entry in the catalog source contracts of upstream. The availability lookup treats a layer with no contract as available.
The change keeps this. An entry for OSH would need a default source, and this is a later change.

## Files and measures

The change edits two test files and adds the plan, the evidence and the review files. The merge changes 50 files.

The trace gate checks the scenario IDs and the links. The ledger gate checks the gaps of the upstream files against the adopt records.
The format check, the import direction check, the package boundary check and the layer token check measure the configuration. The prose lint checks STE.
The lead runs the gates in Docker and both review agents on the final tree.
