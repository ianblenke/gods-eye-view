## Context

Base commit: `2f53da248ca36889c1465d0fb22d4c5be9b96419`.
Upstream commit: `93ea088f4556a5a65b3292a2d15142d5a6c562bc`.
The lead took the upstream commit from the output of `git ls-remote upstream main` on 2026-10-18.
The shared ancestor is the commit `73aec2e6`, which sync 6 merged.

The first parent of the merge commit is the plan commit. The plan commit has the base commit as its parent.
The upstream commit is the second parent.
The lead must record the check of the second parent in `review.md`.

The merge brings seven pull requests (#287, #761, #767, #839, #1094, #1101 and #1196) and six direct commits of upstream.

## Conflict resolutions

A merge of the same two commits in memory reports one file with a conflict. The file `evidence/conflicts.txt` shows the conflict list, and it shows that the merge commit differs from the automatic merge only in that file.

| File | Resolution |
|---|---|
| `server/standalone/vite.config.js` | Keep the fork function `standalonePlugins()` and the call `plugins: standalonePlugins()`. Add the upstream import of `unwatchedRuntimeDirsPlugin` and add the call `unwatchedRuntimeDirsPlugin()` as the last item of `standalonePlugins()`. See decision D1. |

## Decisions

### D1: The plugin list of the standalone server

The fork moved the plugin list of `server/standalone/vite.config.js` into the function `standalonePlugins()`. The fork test `src/tooling/bundleCredentials.test.mjs` builds a page with that list.
Upstream adds the plugin `unwatchedRuntimeDirsPlugin()` as the last item of the list in the config.
The change adds the plugin as the last item of `standalonePlugins()`. The config then has the same order of plugins as upstream.
The plugin applies only to the dev server, so the build of the fork test does not change.

The fault is to remove the call `unwatchedRuntimeDirsPlugin()` from `standalonePlugins()`. The two upstream tests of the plugin in `src/tooling/viteBuild.test.mjs` must then fail.

### D2: No spec delta

The merge changes no requirement of the fork. No test with a scenario ID fails on the merged tree.
The merge adds no QA script and no layer token.
So the change has no spec delta.

### D3: The adopt command

The merge brings upstream tests with no scenario ID and upstream files with a coverage gap.
The adopt command records them. The rule 21 check of the second parent goes into `review.md`.

### D4: The LAN address in a fork test

The owner asked on 2026-10-18 to remove the LAN address of the owner from the public fork.
The address is in four lines of the owned test file `src/control/route.test.mjs`. Three tests use it as an address of another machine: two tests of `osh-control-028` and one test of `osh-control-039`.
The change uses the documentation address `192.0.2.10` (RFC 5737) and its IPv4-mapped IPv6 form `::ffff:192.0.2.10` in place of the LAN address.
The code accepts only loopback hosts and loopback socket addresses, so the tests keep their meaning. The scenarios name no address, so their text does not change.

The three faults are in `server/providers/common/loopback-command.js`. Each fault must make a test fail:
- The first fault adds `192.0.2.10` to the loopback hosts. The two tests of `osh-control-028` must then fail.
- The second fault adds `192.0.2.10` to the loopback socket addresses. The test of `osh-control-039` must then fail.
- The third fault adds `::ffff:192.0.2.10` to the loopback socket addresses. The test of `osh-control-039` must then fail.

### D5: The image of the gates

`package-lock.json` changes the versions of `dompurify`, `sharp` and `source-map-js` and of the packages that `sharp` uses. The image `gods-eye-view:local` has the packages of the base commit.
The lead builds the image `gods-eye-view:sync7` from the merged tree and runs each Docker command of this change with `IMAGE=gods-eye-view:sync7`.
The host tests use a copy of the packages of that image.

## Files and measures

The change edits one owned test file and adds the plan, the evidence and the review files. The merge changes 46 files.

The trace gate checks the scenario IDs and the links. The ledger gate checks the gaps of the upstream files against the adopt records.
The four checks of `make precheck` check the format, the import directions, the package boundaries and the layer tokens. The prose lint checks STE.
The lead runs the gates in Docker and both review agents on the final tree.
