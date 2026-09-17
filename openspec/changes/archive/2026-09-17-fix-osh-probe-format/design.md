## Context

The base probe and the systems list send a query value of `application/geo+json` inside a literal query string. `URLSearchParams` reads a `+` in a value as a space, so the server reads `application/geo json` and refuses it. The owner measured this by hand on 2026-09-17, with no test able to reach the server. This design adds one helper that builds every list query from parts, and eleven tagged tests that catch the class of fault with no server.

## Changed files

Changed: `server/providers/osh/get.js`, `server/providers/osh/base.js`, `server/providers/osh.js`, `src/data/oshGet.test.mjs`, `src/data/oshBase.test.mjs`, `src/data/oshProxy.test.mjs`, `openspec/specs/osh/spec.md`, `openspec/trace/gaps.json`, `openspec/trace/history.jsonl`, `openspec/trace/ids.json`, `openspec/trace/links.json`.

## Goals / Non-Goals

**Goals:**
- Build every upstream list query from named parts, never from a literal string with a query already attached.
- Catch, with no server, the property that a query value the code names must reach the wire as that value.
- Keep the systems probe on the GeoJSON format the design asked for.

**Non-Goals:**
- A live check that the server accepts a value. `osh-no-live-test` still names this limit.
- A format value for the datastreams list. `osh-datastreams-no-format` names this limit.

## Decisions

### D24 One helper builds every list query

`oshListUrl(root, path, query)`, in `server/providers/osh/get.js`, takes a resolved or a candidate root, a fixed path and a query object. It builds the URL with `new URL(path, root)`, checks it with a safety check, then writes the query with `URLSearchParams`:

```js
export const OSH_LIST_FORMAT = 'application/geo+json';

export function oshListUrl(root, path, query) {
  const url = new URL(path, root);
  if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) {
    throw new Error('OSH list URL failed the safety check');
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) params.set(key, value);
  url.search = params.toString();
  return url;
}
```

A safety check re-reads the built URL. It throws when the URL leaves the root's origin or the root's path, the same shape of check `assertObservationUrl()` runs in `ids.js`. `path` is a fixed literal at every call site, so the check cannot throw at a call site today. It still holds if a later call site names a path built some other way.

`URLSearchParams` encodes `+`, `/`, `%`, `&`, `=`, `#` and a space in every value it writes. A caller names the value it means; the serializer writes the bytes on the wire. This mirrors `buildNextPageUrl()` in the same file, which already rebuilds a next-page query from parsed values, never from a raw query string.

Call sites:
- `base.js` replaces `PROBE_PATH` with a frozen `PROBE_QUERY` object, then builds the probe URL with a call to `oshListUrl(url, 'systems', PROBE_QUERY)`, inside `probeOnce`'s per-candidate `try`. A throw there records one candidate as a miss, the same as a network error; it does not stop the whole probe pass.
- `osh.js` builds the systems list URL with `oshListUrl()`, called with the path `systems` and a query object that holds a `limit` and an `f` key.
- `osh.js` builds the datastreams list URL with `oshListUrl()`, called with the path `datastreams` and a query object that holds only a `limit` key. The owner measured only the systems list, so an unmeasured format value on the datastreams list would risk the same fault this change removes.

`server/providers/osh/ids.js` keeps its own fixed query string, `limit=1&resultTime=latest`, unchanged. Every byte of that string is one a parser reads the same way encoded or not, and `assertObservationUrl()` already checks the built URL against it. This change does not touch the datastream-id boundary.

This change adds no new file under `server/providers/osh/`. `osh-005` counts that folder at four files. `get.js` already holds the builder of a page-link URL, `buildNextPageUrl()`, and both `base.js` and `osh.js` import `oshListUrl()` from it.

### D25 A round-trip test proves the sent bytes match the named value, with no server

A test drives the base probe, the systems list, the datastreams list and one observation fetch through a fixture fetch, the way `osh-004` does. For each recorded upstream URL, it parses the query with `URLSearchParams`, serializes it again, and asserts the two strings are byte for byte equal. It asserts that a decoded `f` value equals `application/geo+json`, and that no decoded value holds a space.

The old literal, `f=application/geo+json`, fails this test: it decodes to `application/geo json` and re-serializes to `f=application%2Fgeo+json`, a different string. The corrected query, built by `oshListUrl()`, round-trips to itself. This is the test that would have caught the fault with no live server.

### D26 A text scan refuses a hand-built or a mis-encoded query

A second test reads, as text, `server/providers/osh.js` and the four files `osh-005` discovers under `server/providers/osh/`. The same helper `osh-005` uses strips comments first. For every quoted string, a key is a run with no `&`, `=` or white space, at the start or after a `?` or `&`. The test refuses a pair whose value holds `+`, `%`, `#` or a space. It also refuses a string that holds `?` followed by any `key=value` pair.

The first rule catches a hand-encoded or a mis-encoded value, such as the corrected string `f=application%2Fgeo%2Bjson` written by hand instead of built by `oshListUrl()`. The second rule catches a return to a literal query such as `systems?limit=1`, the shape of the original fault. `ids.js`'s fixed string, `limit=1&resultTime=latest`, has no bad byte and carries no `?`, so it passes both rules. `application/geo+json` alone passes the first rule, because it has no `=`; it only becomes a query value through `oshListUrl()`.

### D27 Keep the provider's own format on the page walk

Round 1 of this change's review found that `buildNextPageUrl()` still carried a server's own `f` value on a walked next-page link. A server can repeat the format this provider sent back into its next link. It can write that value with a raw `+`, the same fault this change fixes everywhere else. `buildNextPageUrl()` now names `OSH_LIST_FORMAT` for an `f` key on every walked page, never the link's own value. The fix holds the rule from the round-5 review of `osh-fusion`: every URL this provider sends is one it built.

`osh-040` drives a next link that carries `f=application/geo+json`, a raw value no test drove before. It asserts that the walked request still carries `f=application%2Fgeo%2Bjson`. `osh-038` could not catch this fault, because its fixture list has no next link, so no page walk runs.

Round 2 found that the fix above was too wide: it forced `f` onto the datastreams walk, a list that never asks for a format. `buildNextPageUrl()` now reads `current`, the URL this provider already sent, to decide. When the link and `current` both carry `f`, the rebuild forces `OSH_LIST_FORMAT`; otherwise it drops the key. Two new `osh-040` tests each drive one branch. One drives a next link with a different valid value, `f=json`, and the walk still ends at `application/geo+json`. The other drives a datastreams next link with an `f` key, and the walk still ends with none.

Round 3 found three more bugs in the fix above. First, a link that omitted `f` entirely left that page with no format, even though `current` had asked for one. A page in the server's default shape has no top-level `geometry`, and `mapOshSystems()` in `src/data/oshSystems.js` keeps a record only for a `Point` geometry. `mapOshSystems()` dropped that page's items, with no log line. Second, the loss then continued: once one page lost the format, the next page's `current` also lacked it, so the format never returned. Third, a next-page link with two `f` keys wrote the provider's format onto the wire twice.

`buildNextPageUrl()` now drops every `f` key the candidate carries, then appends `OSH_LIST_FORMAT` once, only when `current` already had one. Page 2 gets `f` only when page 1 did. Page 3 then reads that from page 2's own URL, never from a link in between, so the provider cannot lose the format. Three new tests drive this: an omitted `f`, a walk of three pages that loses the format, and a doubled `f` key.

### D28 How the gates measure the requirements

Coverage: `get.js`, `base.js` and `osh.js` stay at 100% line, branch and function coverage. The helper has one loop and one check with two clauses. One test drives each clause, and one test drives the pass. Trace: `osh-037` tags three tests, `osh-038` and `osh-039` each tag one test, `osh-040` tags six tests, and the changed `osh-009` test keeps its tag.

Spec lint: the added requirement has a MUST sentence, a sentence with two MUST NOT clauses, an origin line and four scenarios. Each scenario has one WHEN line and one or more THEN lines. STE lint: this file and the proposal, the spec delta and the tasks file.
