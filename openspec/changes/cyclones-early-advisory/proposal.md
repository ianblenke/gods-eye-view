## Why

The National Hurricane Center stamps each advisory in `CurrentStorms.json` with its nominal time, for example 21:00Z. Upstream reports that the file appears up to about half an hour before that time.
The server function `parseCycloneStatus()` rejects a time that is more than 5 minutes ahead of the server clock. So it rejects the whole file for part of each advisory cycle, and every storm disappears from the layer.

On 2026-10-11 at 00:35Z the lead read the public feed. It had 3 storms and the header `Last-Modified: Sat, 10 Oct 2026 23:56:00 GMT`. Two storms had the position time 00:00Z, which is 4 minutes ahead of that header.
The file `evidence/live-feed.txt` runs both parsers on this payload with a clock 26 minutes before the stamp. The parser with 5 minutes rejects the file, and the parser with 90 minutes gives all 3 storms.
Upstream pull request #741 by the maintainer makes the same change. It is open and has not been merged.

## What Changes

- Add the constant `EARLY_ADVISORY_MS` with the value 90 minutes to `server/providers/cyclones.js`, and use it in `iso()` in place of 5 minutes. The hunk equals the hunk of upstream pull request #741.
- Add the test file `src/data/cyclonesEarlyAdvisory.test.mjs` with two tests. Add it to `openspec/ownership.json` and `scripts/format-scope.json`.
- Add the requirement "Advisory time window of the status route" with the scenarios `cyclones-026` and `cyclones-027` to the capability `cyclones`.
- Write one entry in `CHANGELOG.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cyclones`: One added requirement with two scenarios. The existing requirements and scenarios do not change.

## Impact

Rule 23: the test file is a file that the fork writes, so it goes into `openspec/ownership.json`. The file `server/providers/cyclones.js` is upstream code and stays out of the manifest.
The two changed lines of `server/providers/cyclones.js` run in every test that parses a status. The change opens no coverage gap.
The test file `src/data/cyclonesProxy.test.mjs` does not change, because it is upstream code. The pull request #741 adds one test there, and the fork does not carry it.

## Known limits and later changes

- Known limit `upstream-merge`: If upstream merges pull request #741, the next sync brings the same hunk. A conflict is possible only in `CHANGELOG.md`. The fork test stays.
- Known limit `window`: The window of 90 minutes is the value of upstream. A clock that runs 90 minutes fast makes the server accept a time that the NHC has not yet published.
