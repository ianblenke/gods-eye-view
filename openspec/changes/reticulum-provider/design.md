## Context

Base commit: `1675a813` (main, after the merge of `tampa-preset`).
A provider in this project is a Vite plugin that mounts one handler under `/api/<name>`. The file `server/providers/cyclones.js` is the model for the route, the cache and the stale answer.
The file `src/data/tapAddress.js` holds the shared rule for an address that the operator sets. The rule allows a `host:port` of the loopback, a private network, `localhost` or a `.local` name. The file `src/sources/httpBody.js` reads a response body with a byte cap.

## Decisions

### D1: The provider is the only filter

A listener container runs the Reticulum software and serves the list of discovered interfaces as JSON on a loopback port. Change 2 adds that container.

The listener sends the raw list. The provider keeps an allowed set of fields and drops the rest. The gates image has no Python, so only the provider code can carry tests, and the privacy rules must be in code that has tests.
The raw list never goes into a volume that the app container shares. The provider reads it over the local address and keeps nothing of it.

### D2: The fields of a record

The `type` is the class name of the interface without the word `Interface`, in lower case, for example `rnode`. The provider keeps `id`, `type`, `name`, `latitude`, `longitude`, `heightM`, `hops`, `lastHeard`, `status` and, for an RNode, `radio`. The `id` is the first 16 characters of the field `discovery_hash`. A valid hash has exactly 64 lowercase hexadecimal characters, and the provider drops a record with any other hash.

The provider drops the fields `config_entry`, `reachable_on`, `port`, `ifac_netname`, `ifac_netkey`, `operator_lxmf_address`, `transport_id`, `network_id`, `stamp`, `value`, `impl_name` and `version`. The first six hold addresses, keys or contacts. The others identify a node or the software and are not needed.

The provider rounds each position to three decimals. An operator can run a gateway at home, and 110 m is enough for a globe.
A position is valid when both numbers are finite and the pair is not (0, 0). The latitude must be between -90 and 90, and the longitude must be between -180 and 180.

### D3: The age rules follow Reticulum

Reticulum marks an interface unknown after 24 hours, stale after 3 days and removes it after 7 days. The provider computes the status from `last_heard` with the same limits, so it does not depend on the status field of the listener.

### D4: Names, cache and failure

The provider removes control characters and angle brackets from a name and cuts it to 80 characters. It uses "Unnamed" and the type for an empty name. It keeps at most 5000 interfaces, the most recently heard first.
The provider caches the document for 60 seconds. When the listener fails, it serves the last good document for 2 hours with `stale` true. The timeout is 8 seconds and the byte cap is 4 MiB.

### D5: The tests

The tests use fixtures that have the shape of the records that the listener test of 2026-10-13 produced. The names and positions are made up. Every sensitive field holds a canary string, and the tests search the output for the canary.
The tests of the route use a fake request and a fake response, like the tests of the cyclone route.

## Files and measures

The change adds `server/providers/reticulum.js` and `src/data/reticulumProxy.test.mjs`. It edits `server/providers/local.js`, `openspec/ownership.json`, `scripts/format-scope.json`, `DATA_SOURCES.md`, `.env.example` and `CHANGELOG.md`.

The trace gate checks that the tests carry the IDs `reticulum-source-001` to `reticulum-source-011`. The coverage gate needs 100% of lines, branches and functions in both new files. The prose lint checks STE.
The named faults measure whether a change of a field list, a limit or a rule makes a test fail.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show the public infrastructure of the Reticulum network. Keep only the fields that an operator publishes on purpose, and drop keys, host addresses and contact addresses."
