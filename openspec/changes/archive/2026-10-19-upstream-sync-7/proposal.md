## Why

The owner wants a sync more often than once each week. On 2026-10-18 the owner told the lead to start the seventh sync.
Upstream has 37 commits after the sixth sync. The first-parent history of upstream has 13 commits in that range.

The commits add nine city bike systems in Spain and a shared function for the distance on a great circle.
They also fix the match of satellite catalog numbers, the station data of city bikes and the file watch of the dev server. They update three packages for security advisories.

The owner also asked the lead to remove the LAN address of the owner from a fork test.

## What Changes

- Merge the upstream commit `93ea088f4556a5a65b3292a2d15142d5a6c562bc` into the plan commit. The plan commit has the base commit `2f53da248ca36889c1465d0fb22d4c5be9b96419` as its parent.
- Resolve the content conflict in `server/standalone/vite.config.js`. `design.md` gives the resolution.
- Replace the LAN address of the owner in the owned test file `src/control/route.test.mjs` with the documentation address `192.0.2.10`.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Keep the upstream code as it is.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

The merge changes 46 files and adds 11 of them. None of the 46 files is in `openspec/ownership.json`.
The change also edits the owned test file `src/control/route.test.mjs`.

Rule 23: the 11 added files are upstream files, because the fork does not write them. The manifest lists only paths that the fork writes.
Two of the added files are code files: `server/standalone/unwatched-cache.js` and `src/geoDistance.js`.

Rule 25: the merge breaks no test with a scenario ID. The change retires no scenario and writes none again.
The change edits three tests with scenario IDs: two tests of `osh-control-028` and one test of `osh-control-039`. It keeps the text of both scenarios. Decision D4 gives the edit.

The change opens no new coverage gap for owned code. The adopt command records the gaps of the upstream files that the merge brings.

The upstream code adds no dependency and no route. `package.json` does not change.
`package-lock.json` changes the versions of `dompurify`, `sharp` and `source-map-js` and of the packages that `sharp` uses.
The change has no spec delta, because the merge changes no requirement of the fork.

The ratchet of this change removes 11 entries from `openspec/trace/ids.json`. These are the scenario IDs that sync 6 retired: `credential-boundary-007` to `credential-boundary-015`, `credential-boundary-017` and `credential-boundary-018`. The file `openspec/trace/retired-ids.json` keeps them.

## Known limits and later changes

- Known limit `host-node`: Host tests run on Node 26, and the image uses Node 24.21.0. Host coverage cannot replace the image measurement.
- Known limit `address-history`: The old LAN address stays in the Git history. The change does not edit archived records, and six archived files keep the address or a part of it. The full address is in `openspec/changes/archive/2026-10-15-osh-control-loopback/evidence/peer-address.txt` and in line 36 of `evidence/mutations-script.txt` of the same change. The subnet is in `evidence/networks.txt`, `design.md` and `review/spec-adversary.md` of `openspec/changes/archive/2026-10-13-reticulum-listener/`. The first three numbers are in `openspec/changes/archive/2026-10-10-codex-voice-container/evidence/e2e.txt`.
- Known limit `old-fault-039`: The archived fault 039 of `osh-control-loopback` adds the old LAN address to the loopback socket addresses. The edited test of `osh-control-039` does not use that address, so that old fault no longer makes the test fail. The second fault of decision D4 takes its place.
- Known limit `changelog`: Upstream puts each new changelog entry in a file under `changelog.d/`. The fork still edits `CHANGELOG.md`, so a later sync can have a conflict there again.
- Known limit `osh-source`: The OSH layer is not in the catalog source contracts of upstream. This is older than this change.
