## Context

Base commit: `1675a813` (main, after the merge of `tampa-preset`).
A provider in this project is a Vite plugin that mounts one handler under `/api/<name>`. The file `server/providers/cyclones.js` is the model for the route, the cache and the stale answer.
The file `src/data/tapAddress.js` holds the shared rule for an address that the operator sets. The rule allows a `host:port` with an IPv4 loopback host, an IPv4 private host, `localhost` or a `.local` name. The file `src/sources/httpBody.js` reads a response body with a byte cap.

## Decisions

### D1: The provider is the only filter

A listener container runs the Reticulum software and serves the list of discovered interfaces as JSON on a loopback port. Change 2 adds that container.

The listener sends the raw list. The provider keeps an allowed set of fields and drops the rest. The gates image has no Python, so only the provider code can carry tests, and the privacy rules must be in code that has tests.
The raw list never goes into a volume that the app container shares. The provider reads it over the local address and keeps nothing of it.

### D2: The fields of a record

The `type` is the class name of the interface without the word `Interface`, in lower case, for example `rnode`. The provider keeps `id`, `type`, `name`, `latitude`, `longitude`, `heightM`, `hops`, `lastHeard`, `status` and, for an RNode, `radio`. The `id` is the first 16 characters of the field `discovery_hash`. A valid hash has exactly 64 lowercase hexadecimal characters, and the provider drops a record with any other hash. Reticulum builds the hash from `transport_id` and `name`, so the `id` is a stable pseudonym of the node.

The provider drops the fields `config_entry`, `reachable_on`, `port`, `ifac_netname`, `ifac_netkey`, `operator_lxmf_address`, `transport_id`, `network_id`, `stamp`, `value`, `impl_name` and `version`. The first six hold addresses, keys or contacts. The fields `transport_id` and `network_id` identify a node or a network. The fields `stamp` and `value` hold the proof of work of the announce. The fields `impl_name` and `version` name the software. The provider needs none of them.

The provider rounds each position to three decimals. An operator can run a gateway at home, and 110 m is enough for a globe.
A position is valid when both numbers are finite and the pair is not (0, 0). The latitude must be between -90 and 90, and the longitude must be between -180 and 180.

### D3: The age rules follow Reticulum

Reticulum marks an interface unknown after 24 hours, stale after 3 days and removes it after 7 days. The provider computes the status from `last_heard` with the same limits, so it does not depend on the status field of the listener.

### D4: Names, cache and failure

The provider removes control characters and angle brackets from a name. The control characters are U+0000 to U+001F and U+007F to U+009F. The provider cuts a name to 80 characters. It uses "Unnamed" and the type for an empty name. It keeps at most 5000 interfaces, the most recently heard first.

The provider caches the document for 60 seconds. Requests that come while the first waits share one request to the listener. When the listener fails, the provider serves the last good document for 2 hours with `stale` true. The timeout is 8 seconds and the byte cap is 4 MiB.
The request to the listener refuses a redirect, so a listener cannot send the server to another host.

The provider also refuses a host that a URL parser reads as another address. The shared rule reads `010.0.0.1` as 10.0.0.1, and a URL parser reads it as 8.0.0.1. It also refuses a host that a URL parser rejects, such as `10.0.0.08`.

### D5: The tests

The tests use fixtures that have the shape of the records that the listener test of 2026-10-13 produced. The names and positions are made up. Every sensitive field holds a canary string, and the tests search the output for the canary. A fake fetch follows a redirect to a good list unless the request refuses it.
The tests of the route use a fake request and a fake response, like the tests of the cyclone route.

## Files and measures

The change adds `server/providers/reticulum.js` and `src/data/reticulumProxy.test.mjs`. It edits `server/providers/local.js`, `openspec/ownership.json`, `scripts/format-scope.json`, `DATA_SOURCES.md`, `.env.example` and `CHANGELOG.md`.

The trace gate checks that the tests carry the IDs `reticulum-source-001` to `reticulum-source-014`. The coverage gate needs 100% of lines, branches and functions in `server/providers/reticulum.js`. The test file is not in the coverage inventory. The prose lint checks STE.
The named faults measure whether a change of a field list, a limit or a rule makes a test fail.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show the public infrastructure of the Reticulum network. Keep only the public fields of each discoverable interface, and drop keys, host addresses and contact addresses."
