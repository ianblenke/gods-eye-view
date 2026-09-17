## Why

God's Eye View shows live open data from public feeds. The project owner also runs an OpenSensorHub server with private sensor systems. The globe cannot show these systems today. No code in the repository connects to OpenSensorHub.

The account for that server has create and delete rights. A request with the wrong method can destroy a real sensor stream. So this change must prove that the program sends only GET requests. It must also prove that the program never contacts the server when `OSH_URL` is not set.

The exact API root of the server is not known. The provider must find it from a short list of candidates with GET requests only. It must report which candidate answered, never the host name.

The change shows the systems as markers, and the newest result of each datastream of the selected system. A result with a location moves the marker. This is the first change where a browser value reaches the upstream URL. The change limits that value to a datastream id with a strict pattern.

## What Changes

- Add the provider `server/providers/osh.js` and its modules `osh/get.js`, `osh/base.js`, `osh/ids.js` and `osh/observations.js`.
- Add the routes `GET /api/osh/status`, `GET /api/osh/systems`, `GET /api/osh/datastreams` and `GET /api/osh/observations?datastream=<id>`.
- Read `OSH_URL`, `OSH_USERNAME` and `OSH_PASSWORD` on the server only, at request time. The browser never receives them.
- Send only GET requests to the OpenSensorHub server, all through one function `oshGet`. Refuse a redirect. Refuse a browser request with another method.
- Resolve the API root once per process from three candidates with GET probes. Report the name of the candidate that answered, not the URL.
- Answer `503 {error:'no_key'}` and `{hasKey:false}` when `OSH_URL` is not set, as `/api/firms` does. Do not contact the server in that case.
- Check each datastream id against a strict pattern before it becomes part of a URL. Refuse other values with `400` and no upstream request.
- Keep the systems and the datastreams in a memory cache with a five-minute TTL. Keep the newest observation of each datastream for 15 seconds. Serve the stale cache when the server fails.
- Add the pure adapters `src/data/oshSystems.js`, `src/data/oshDatastreams.js` and `src/data/oshObservations.js`.
- Add the browser layer `osh-systems`. It shows one marker and one label for each system with a point geometry.
- Show the datastreams and the newest result of the selected system through a pure `renderOshDetail()` function. Move the marker when a result has a location.
- Register the layer in `src/data/localLayers.js` and in `LAYER_STATE_REGISTRY` with the token `o`.
- Add the three keys as commented, empty lines to `.env.example`.

## Capabilities

### New Capabilities
- `osh`: the OpenSensorHub provider, the API root resolution, the datastream boundary and the systems layer.

## Impact

- New files at 100% coverage from the first commit: `server/providers/osh.js`, `server/providers/osh/base.js`, `server/providers/osh/get.js`, `server/providers/osh/ids.js`, `server/providers/osh/observations.js`, `src/data/oshSystems.js`, `src/data/oshDatastreams.js`, `src/data/oshObservations.js`, `src/data/osh.js`, `src/layers/osh/index.js`, `src/layers/osh/source.js`, `src/layers/osh/detail.js`.
- Changed files: `server/providers/local.js`, `src/data/localLayers.js`, `src/data/layerState.js`, `src/data/layerState.test.mjs`, `package.json`, `scripts/package-boundaries.json`, `.env.example`, `src/data/fixtures/README.md`.
- Each changed file gets one small, focused edit:
  - `local.js` gets one import and one call.
  - `localLayers.js` gets one import and one list item.
  - `layerState.js` gets one frozen object.
  - `layerState.test.mjs` gets its registry count updated.
  - `package.json` gets two exports, and the boundaries file gets two groups.
  - `.env.example` gets three commented keys, and the fixtures readme gets one entry.
- Gaps that this change opens: none.
- Gaps that this change closes: `src/data/localLayers.js` had an open gap of 23 untested lines. Its new import and its new list entry bring the whole file under test, so the gate closes that gap.
- The ledger records a larger total and a new hash for `src/data/layerState.js`, from its one new frozen registry entry. Its open gap stays the same size: 68 lines, 75 branches and 5 functions not covered, all pre-existing debt this change does not touch.
- The ledger records a larger total for `server/providers/common/http.js`, whose two shared functions now also run under the OSH tests. This change does not edit that file, so its hash stays the same. Its open gap stays the same size too: 19 lines, 4 branches and 2 functions not covered.
- Across this change's ratchet runs, the ledger recorded `src/data/labelArbiter.js` move between 50 and 52 not-covered branches more than one time. This change never touches that file.
- Each run gives that file 50 or 52 not-covered branches, with a branch total of 405 or 407. The covered branch count stays 355 for both, so the file loses no coverage. The entry holds the count of the last run, and a later run can give the other count. The count tolerance from `simplify-ledger` absorbs a difference this size.
- The known limit `banked-branch-count`, recorded in the archived change `2026-09-17-harden-gate-ledger`, names this V8 branch-count instability.

## Known limits and later changes

- `osh-shape-inferred`: This change infers every OSH payload shape, never checked against a live server. The first live run can show a different shape.
- `osh-latest-query-inferred`: This change infers the query `resultTime=latest`, with low confidence. If the server refuses it, the observations route answers `502` and the fix is one constant.
- `osh-system-link-inferred`: This change infers the link from a datastream to its system (`system@id`), with low confidence. Without it, a selected system shows no datastreams.
- `osh-location-keys-inferred`: The marker moves only for a result with `lat`/`lon` (or `latitude`/`longitude`) keys or `geometry.coordinates`. A custom schema with other names shows rows but does not move the marker.
- `osh-candidates-fixed`: The root resolution tries three candidates. A server behind another prefix fails all three, and the fix is one more entry in that list.
- `osh-probe-hold`: After a full miss the provider waits 60 seconds before it probes again.
- `osh-id-pattern-strict`: The route refuses a datastream id outside the pattern `^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$`, with `400`. That pattern widens only with a rejection test to match it.
- `osh-selected-only-motion`: Only the selected system polls its datastreams, so only its marker moves. A route for every system is a later change.
- `osh-point-only`: The layer does not show a system without a Point geometry.
- `osh-basic-auth-only`: HTTP Basic authentication only.
- `osh-no-disk-cache`: The caches live in memory and are empty after a server restart.
- `osh-detail-host-provisional`: `renderOshDetail()` and the layer accept a detail host element, but no panel wires one in yet. Its placement is a later change.
- `osh-no-key-setup`: The three keys are not in the Key Setup UI, Pinokio, the setup doctor or dev-fresh. A later change, `osh-key-setup`, adds them.
- `osh-get-test-is-text`: `osh-005` reads `server/providers/osh.js`, the files it discovers under `server/providers/osh/`, the files it discovers under `src/data/osh*.js`, and `server/providers/common/http.js`, as text. A `fetch` call in any other module the provider imports is outside this proof. `osh-004` would not catch it either, since it records only the injected `fetchImpl`. Code that reaches `fetch` through an alias would also pass the scan. `scripts/package-boundaries.json` bounds which modules `server/providers/osh.js` can import at all, but nothing ties that boundary check to this scan. `osh-004` and the review stay the second line of defense.
- `osh-no-live-test`: No test proves the server accepts the requests. A manual first run with a read-only account does.
- `osh-no-stream`: No WebSocket or MQTT connection. The layer polls the routes on a timer.
- `osh-hygiene-scope-limited`: `osh-034` refuses a URL with a scheme whose host is not `localhost` and not a reserved `*.example` host. It also refuses an IPv4 literal, with or without a port. It refuses a dotted token with an explicit port, but not when its last label is `example` or a source-file extension. It does not find a bare dotted host with no scheme and no port, written alone in a comment or a string. A rule that catches that also catches an ordinary dotted property path in this codebase, such as `payload.features`. The reviewers check new fixtures and new prose by hand.
