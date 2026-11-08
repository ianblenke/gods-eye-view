## Why

The first real UP42 call found two host rules that the source did not support.
The ten-host cap also omitted five archive hosts.
The failure log did not name the failure kind.

## What Changes

- Search all selected hosts through a queue of at most 24 calls.
- Send one collection per call for vantor-3d and vexcel-v2.
- Merge scenes from good calls of each host.
- List a host as failed only when all its calls fail.
- Mark an answer as truncated when a host has a partial failure.
- Keep four concurrent calls and one daily count per new search.
- Add fixed failure kinds and checked host names to search logs.
- Add the failure kind to thumbnail logs.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `up42-source`: Change host search, incomplete answers, host failures and the secret-output scenario.
- `up42-thumbnails`: Add a failure log requirement.

## Impact

The base tree is commit `990d28286da22b1c3063eb2a0ef0e18f79e730c6`.
The change edits upstream.js and up42.js under server/providers, plus up42-thumbnails/thumbnails.js.
It edits the source upstream, proxy and thumbnail tests under src/data.
It adds changelog.d/1433-up42-search-hosts.md.

It adds no code file and changes no ownership path.
No trace gap must open. The lead must re-link the changed scenario hashes with the ratchet command.

The delta replaces scenarios 015, 016, 017 and 023 of up42-source.
The daily-count and answer-store requirements stay true and need no replacement.
The tests for 015 and 016 change with their scenario text. Their titles stay unique.
The browser layer and SkyWatch files stay unchanged.

## Known limits

- Known limit `single-collection-hosts`: The fixed set comes from the probe on 2026-11-08. A new host with that rule fails until the set changes.
- Known limit `call-cap`: The client sends at most 24 search calls. Calls above that cap receive no request.
- Known limit `first-page`: The client does not follow a next link.
- Known limit `count-in-ram`: A restart clears the daily count and answer store.
- Known limit `display-terms`: This change does not resolve UP42 display terms.
- Known limit `probe-snapshot`: The probe facts describe 2026-11-08. The tests use fake fetch and do not repeat the probe.
