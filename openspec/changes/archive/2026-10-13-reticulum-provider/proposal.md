## Why

The owner asked on 2026-10-12 for a Reticulum data source. Reticulum carries no location in its core protocol. An operator who marks an interface as discoverable publishes its name, type, latitude and longitude as an infrastructure announce, and other nodes hear the announce.

A listener-only node ran on 2026-10-13 and heard 43 interfaces in 18 minutes. 35 of them had a position. Operators announce every 6 hours by default, so the count was not final. See `evidence/spike.txt`.

The owner chose to run our own listener and not to use a third-party map feed. The map feed `rmap.world` states no terms of use, and its data holds host addresses, interface keys and contact addresses.
This is change 1 of 3. This change adds the server provider and its privacy filter. Change 2 adds the listener container. Change 3 adds the globe layer.

## What Changes

- Add the provider `server/providers/reticulum.js` and register it in `server/providers/local.js`. The route is `/api/reticulum`.
- Add the capability `reticulum-source` with fourteen scenarios, `reticulum-source-001` to `reticulum-source-014`.
- Add the test file `src/data/reticulumProxy.test.mjs`. Add both new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- Write a section in `DATA_SOURCES.md`, a note and one setting in `.env.example` and one entry in `CHANGELOG.md`.

## Capabilities

### New Capabilities

- `reticulum-source`: Nine requirements. They cover the fields, the records, the positions, the age, the text bounds, the route, the source address, the source failure and the cache.

### Modified Capabilities

None.

## Impact

Rule 23: the two new code files are files that the fork writes, so they go into `openspec/ownership.json`. The file `server/providers/local.js` is upstream code and gets two changed lines.
This change adds no layer, no panel and no listener. Without a listener, the route says `unavailable`.

## Known limits and later changes

- Known limit `coverage`: The provider lists only the operators who opt in with `discoverable = yes`. The operator sets the position, and nobody checks it. A new listener has a partial list for its first hours.
- Known limit `privacy`: The data describes infrastructure and not people. The provider rounds each position to three decimals, which is about 110 m, and drops contact addresses, keys and host addresses. User locations travel in encrypted messages and a listener cannot read them.
- Known limit `names`: Operators choose the names. The provider removes control characters and angle brackets and cuts the length. A name can still be rude or wrong. A name can also hold an address or a contact that the operator typed. Format characters such as U+202E stay in a name after the provider cleans it. The cut counts UTF-16 units, so it can split a character that has two units.
- Known limit `id`: Reticulum builds the field `discovery_hash` from `transport_id` and the name. The provider drops `transport_id` and keeps the name. So the `id` is a stable pseudonym of a node and not a secret.
- Known limit `address`: The provider checks the text of the address and does not resolve a name. The local receivers resolve a name and pin the connection. Neither route has a same-site gate or a rate limit. The shared rule in `src/data/tapAddress.js` accepts the text `010.0.0.1`. The local receivers read the host through a URL parser first, so they refuse it. This provider refuses it with its own check.
- Known limit `licence`: The Reticulum software has a licence that forbids use in systems built to harm people and use as data to train AI. This change holds no Reticulum code. Change 2 runs the software as a separate service.
- Known limit `upstream`: Upstream issue #241 asks for one mesh layer for MeshCore and Reticulum. This change adds a separate source and does not wait for that issue.
- Known limit `scripts-as-text`: The files in `evidence/` that hold scripts hold them as text. No gate measures them.
