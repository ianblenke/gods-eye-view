## Why

The owner wants a sync more often than once each week. On 2026-10-21 the owner told the lead to sync the fork with upstream again.
Upstream has 248 commits after the seventh sync. The first-parent history of upstream has 25 commits in that range: 21 pull requests and four direct commits.

The commits add Gemini Live as a second voice provider and a model-free World Packet boundary for the agent. They add camera packs for Taiwan freeways, Hong Kong and Florida (FL511, opt-in), and ground heights for the Norwegian cameras.
They change the Street Level layer to one provider with docked panels and a proxy that keeps tiles only in memory. They remove the movable panels of the rail.
They also fix the region names of the analyst, the route labels of flights and the catalog provenance of satellites. They fix the requests of Launch Library and the cross-site gate of the terrain route.

Upstream pull request #1228 adds the Ontario 511 key `ONTARIO_511_API_KEY`. The fork added the same key in the change `fix-ontario-511`.

## What Changes

- Merge the upstream commit `713285b554bbc99c8ae0261fe307beb3cbeb2adf` into the plan commit. The plan commit has the base commit `67342d000c56204abd2e08a1cf05d19dd2e99b69` as its parent.
- Resolve the conflicts in 16 files. `design.md` gives each resolution.
- Use the upstream code for the Ontario 511 key. Remove the fork module `server/providers/cctv/ontarioRequest.js` and its tests. Decision D2 gives the reason.
- Change the scenario `qa-scripts-023` for the two QA scripts that upstream removes.
- Edit four upstream tests, so that the tests measure the same coverage each time that they run and leave no live immediate. Decisions D6 and D7 give the edits.
- Run the adopt command for each upstream file that the merge brings and that has a coverage gap.
- Keep the upstream code as it is.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `live-sources`: The change removes the requirement "Ontario camera key".
- `qa-scripts`: The scenario `qa-scripts-023` counts 97 tracked QA scripts.

## Impact

The merge changes 268 files. It adds 74 files and removes 18 files. None of the 268 files is in `openspec/ownership.json`.

The change also removes the fork module `server/providers/cctv/ontarioRequest.js` and the fork test file `src/data/cctvOntarioKey.test.mjs`. It edits the fork test files `src/data/cctvOntarioRows.test.mjs` and `src/tooling/spec/qaRegister.test.mjs`. Of these four files, only `src/tooling/spec/qaRegister.test.mjs` is in `openspec/ownership.json`.
The change also edits four upstream test files. Decisions D6 and D7 give these edits.

Rule 23: the 74 added files are upstream files, because the fork does not write them. The manifest lists only paths that the fork writes.
Fifteen of the added files are code files. `evidence/added-code.txt` lists them.

Rule 25: the merge breaks two tests of the fork scenario `live-sources-005`. The merged file `server/providers/cctv/sources.js` does not call the fork module `ontarioRequest.js`. So the tests of `live-sources-002`, `live-sources-003` and `live-sources-004` test a module that the server does not use.
The change retires the four scenarios of the requirement "Ontario camera key". Decision D2 gives the reason.

The merge also breaks the test of `qa-scripts-023`. That scenario is for fork code. The change writes the scenario again for 97 QA scripts.

The change opens no new coverage gap for owned code. The adopt command records the gaps of the upstream files that the merge brings.

The upstream code adds the optional key `GEMINI_API_KEY` and the route `/api/gemini/token`. The route uses the same cross-site check as the other routes that cost money.
The upstream code adds no dependency, and `package-lock.json` does not change. `package.json` adds the export `./agent/world-packet` and removes the script `qa:panel-resize`.

## Known limits and later changes

- Known limit `host-node`: Host tests run on Node 26, and the image uses Node 24.21.0. Host coverage cannot replace the image measurement.
- Known limit `changelog`: Upstream puts each new changelog entry in a file under `changelog.d/`. The fork still edits `CHANGELOG.md`, so a later sync can have a conflict there again.
- Known limit `osh-source`: The OSH (OpenSensorHub) layer is not in the catalog source contracts of upstream. This is older than this change.
