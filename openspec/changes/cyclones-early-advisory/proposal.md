## Why

The National Hurricane Center stamps each advisory in `CurrentStorms.json` with its nominal time, for example 21:00Z. The payload that the lead read on 2026-10-11 at 00:35Z shows that the advisory files are updated before that time. The field `publicAdvisory.fileUpdateTime` is 22.7, 27.0 and 24.5 minutes before the stamp of the three storms.
The server function `parseCycloneStatus()` rejects a time that is more than 5 minutes ahead of the server clock. So it rejects the whole file for part of each advisory cycle. The route `/api/cyclones` then sends the last good snapshot with the flag `stale`, or no storm when it has no usable snapshot.

The file `evidence/live-feed.txt` shows both parsers on this payload with a clock that the lead chose: 26 minutes before the stamp. The parser with 5 minutes rejects the file, and the parser with 90 minutes gives all 3 storms.
Upstream pull request #741 by the maintainer makes the same change. It is open.

## What Changes

- Add the constant `EARLY_ADVISORY_MS` with the value 90 minutes to `server/providers/cyclones.js`, and use it in `iso()` in place of 5 minutes. The hunk equals the hunk of upstream pull request #741.
- Add the test file `src/data/cyclonesEarlyAdvisory.test.mjs` with two tests. Add it to `openspec/ownership.json` and `scripts/format-scope.json`.
- Add the requirement "Advisory time window of the server parser" with the scenarios `cyclones-026` and `cyclones-027` to the capability `cyclones`.
- Write one entry in `CHANGELOG.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cyclones`: One added requirement with two scenarios. The other requirements and scenarios do not change.

## Impact

Rule 23: the test file is a file that the fork writes, so it goes into `openspec/ownership.json`. The file `server/providers/cyclones.js` is upstream code and stays out of the manifest.
The two changed lines of `server/providers/cyclones.js` run in every test that parses a status. The change opens no coverage gap.
The test file `src/data/cyclonesProxy.test.mjs` does not change, because it is upstream code. The pull request #741 adds one test there, and the fork does not carry it.

## Known limits and later changes

- Known limit `upstream-merge`: If upstream merges pull request #741, the next sync brings the same hunk. A conflict is possible in `CHANGELOG.md`. The fork test stays.
- Known limit `window`: The window of 90 minutes is the value of upstream. The payload shows an early update of about 25 minutes. A server clock that runs 90 minutes slow accepts a time that the National Hurricane Center has not yet published.
- Known limit `card-time`: In the early window, the storm card shows "issued" with a time that is ahead of the clock. The age label shows "just now", because `snapshotAgeSec()` in `src/data/layerSnapshot.js` clamps a negative age to 0.
