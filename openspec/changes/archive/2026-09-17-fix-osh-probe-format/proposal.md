## Why

The provider probes each API root candidate with a query that names the format `application/geo+json`. A `+` in the value of a query key means a space. The server reads the value as `application/geo json`, a format it does not know.

The owner measured this on 2026-09-17, with the same credentials the provider uses. The probe answered `400` from the host, with the message "Unsupported format: application/geo json". From inside the application container, it answered `302` to the server's web root. The same path with no `f` key answered `200` from both places.

So every candidate misses. The API root never resolves. The route `/api/osh/systems` answers `502` with `base_unresolved`. The layer `osh-systems` reports that it could not start.

The owner also measured three corrected requests. `f=application%2Fgeo%2Bjson` answered `200` with a `features` array. `f=json` answered `200` with an `items` array. A request with no `f` key answered `200` with an `items` array. The first form keeps the format the design asked for, so this change keeps it.

Round 6 of the review of `osh-fusion` read this same `+`. It reported that page 1 and page 2 decode to the same value, so the walk added no fault. That was true, and it was not the question: both pages decoded to `application/geo json`, the value the server refuses. No agent could check that the server accepts the value, because no test can contact it. This change adds the check a test can make with no server: that each query the provider sends decodes to the value the code names.

## What Changes

- Add `OSH_LIST_FORMAT` and a helper, `oshListUrl()`, to `server/providers/osh/get.js`. The helper takes a root, a path and a query object, and it builds a URL with `URLSearchParams`. A value such as `application/geo+json` then reaches the query as its own encoded bytes, never as part of a literal string.
- Add a safety check to `oshListUrl()`. It throws when the built URL leaves the root's origin or the root's path, the same shape of check `assertObservationUrl()` runs in `ids.js`.
- Change the base-probe URL in `server/providers/osh/base.js`. It moves from a literal path with a query attached to one call of `oshListUrl()`.
- Change the two literal list URLs in `server/providers/osh.js` to `oshListUrl()` calls. The systems list keeps the `f` key. The datastreams list keeps its current query, with no `f` key.
- Add a test that drives the probe, both list routes and the observation route through a fixture fetch. It checks that each recorded upstream query equals its own `URLSearchParams` round trip, byte for byte.
- Add a text scan of the provider files. It refuses a query value with `+`, `%`, `#` or a space, and it refuses a literal query written next to a URL.
- Change `buildNextPageUrl()` in `server/providers/osh/get.js`. On a walked next-page link, it forces `f` to the provider's own format, written once, when the current page already asked for one. Otherwise it drops the key. It never carries the link's own value. That format holds across every later page of the walk.
- Add tests that drive a next-page link with an `f` key, on both the systems and the datastreams walk. They check that the walked request keeps or drops `f` to match what the current page asked for.
- Add tests for a link that omits `f`, a walk with a middle link that omits the format, and a link that carries `f` twice. They check that the provider never loses the format, and that `f` never reaches the wire twice.

## Capabilities

### Modified Capabilities
- `osh`: the API root probe, the list requests and the page walk build their query from named parts, not from a literal string.

## Impact

- Changed files: `server/providers/osh/get.js`, `server/providers/osh/base.js`, `server/providers/osh.js`, `src/data/oshGet.test.mjs`, `src/data/oshBase.test.mjs`, `src/data/oshProxy.test.mjs`, `openspec/specs/osh/spec.md`, `openspec/trace/gaps.json`, `openspec/trace/history.jsonl`, `openspec/trace/ids.json`, `openspec/trace/links.json`.
- Gaps that this change opens: none. `get.js`, `base.js` and `osh.js` stay at 100% line, branch and function coverage.
- Gaps that this change closes: none. This change corrects a request value and adds tests for a property no earlier test checked. It opens no new gap and closes no open one.
- No response, log line, fixture or spec text in this change carries a host name or a system id. It also carries no datastream id and no count from the owner's server. The corrected format string and its encoded form are values the design already asked for, not server metadata.
- The ratchet run of this change recorded `src/data/labelArbiter.js` at 52 not-covered branches, with a branch total of 407. This change never touches that file.
- Each run gives that file 50 or 52 not-covered branches, with a branch total of 405 or 407. The covered branch count stays 355, so the file loses no coverage. The entry holds the count of the last run, and a later run can give the other count.
- The known limit `banked-branch-count`, in the archived change `2026-09-17-harden-gate-ledger`, names this V8 branch-count instability.
- The gate also reports 6 STE warnings, passive voice in test names from `osh-fusion`, older than this change.

## Known limits and later changes

- `osh-no-live-test` (narrowed): No test proves that the server accepts a query value. The new round-trip test proves that each query the provider sends decodes to the value the code names. That is the half of this fault a test can check with no server.
- `osh-format-measured-by-hand` (new): The owner measured, by hand, that the server accepts `f=application%2Fgeo%2Bjson` on the systems list, and the same list with no `f` key. A later server version can refuse either. The fix is one value in `OSH_LIST_FORMAT` or one key in a query object, each already covered by a test.
- `osh-query-scan-is-text` (new): The text scan checks the shape of a query value, not whether the server accepts it. A value such as `f=geojson`, wrong but shaped like a plain word, would pass the scan and still fail the server. The round-trip test, `osh-038`, is the stronger of the two guards, and the scan is the weaker one. It catches the one hole `osh-038` leaves: a later route that writes a literal query in a path no test drives.
- `osh-query-scan-blind-spots` (new): The scan's bad-byte check reads only a pair's value, not its key. A hand-encoded key, such as `limit%3D1`, passes. Neither rule checks for a `#` written into a `path` literal, which `oshListUrl()` keeps as a URL fragment. A value built by string concatenation leaves an empty value in the literal at scan time, and passes. A query written outside the five scanned files also passes. A byte written as a source escape, such as `f=application\x2Bjson`, also passes, because the scan reads the literal characters of the source text.
- `osh-datastreams-no-format` (new): The datastreams list still names no format. The owner measured only the systems list. A later change that adds an unmeasured format value would risk the same fault this change removes.
- `osh-probe-format-fixed` (new): The probe asks only for `application/geo+json`. A server that lists systems as plain JSON only would refuse every candidate. The owner also measured that `f=json` and no `f` key both work, so a later change can add a second probe form, with a test.
- `osh-observations-query-literal` (new): `server/providers/osh/ids.js` still builds `OSH_OBSERVATIONS_QUERY` as one fixed string, not with `oshListUrl()`, and that file is the datastream id boundary of design decision D13. It is the one place a browser value reaches an upstream URL against an account that can delete streams. `assertObservationUrl()` fails closed today: it compares a raw id against a value `observationUrl()` already encodes. A change to this file would give the same bytes with no new behaviour, so it would risk the boundary for no gain. `osh-038` round-trips the observations URL at run time, and `osh-039` scans `ids.js` for a bad byte, so both guards already cover it. A later change can convert this third place, with its own task.
- `osh-page-link-repeat` (new): A next link that repeats `current` byte for byte makes the walk refetch that page, up to the 20-page cap. This loop predates this change; the rebuild does not create it.
