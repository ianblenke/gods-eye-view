## 1. Spec

- [x] 1.1 Write `specs/osh/spec.md` with the MODIFIED `osh-009` and the ADDED requirement with `osh-037`, `osh-038`, `osh-039` and `osh-040`.
- [x] 1.2 Write `proposal.md` with the Why, the measured statuses, the Impact and the known limits.
- [x] 1.3 Write `design.md` with the helper, the two guards and the gates.

## 2. Tests first

- [x] 2.1 Write the `[osh-038]` round-trip test in `src/data/oshProxy.test.mjs`. Run it. It must fail on the literal `+`.
- [x] 2.2 Write the `[osh-039]` text scan in `src/data/oshProxy.test.mjs`. Run it. It must fail on the two literal queries.
- [x] 2.3 Change the `[osh-009]` pinned URL in `src/data/oshBase.test.mjs` to the encoded form. Add the decode assertion. Run it; it must fail.
- [x] 2.4 Write the `[osh-037]` unit test of `oshListUrl()` and `OSH_LIST_FORMAT` in `src/data/oshGet.test.mjs`. Run it. It must fail because no export exists.
- [x] 2.5 Write the `[osh-037]` route-level query pins in `src/data/oshProxy.test.mjs`. Run it. It must fail.
- [x] 2.6 Write the `[osh-040]` next-link test in `src/data/oshProxy.test.mjs`. Run it. It must fail on the server's raw `f` value.
- [x] 2.7 Write the `[osh-040]` datastreams next-link test. Run it. It must fail: page 2 must carry no `f` key.
- [x] 2.8 Write `[osh-040]` tests for an omitted `f` and a doubled `f` key. Run them; each must fail.
- [x] 2.9 Write a `[osh-040]` test for a walk that loses the format across three pages. Run it; it must fail.

## 3. Code

- [x] 3.1 Add `OSH_LIST_FORMAT` and `oshListUrl()` to `server/providers/osh/get.js` until 2.4 passes.
- [x] 3.2 Replace `PROBE_PATH` in `server/providers/osh/base.js` with `PROBE_QUERY` and an `oshListUrl()` call until 2.3 passes.
- [x] 3.3 Replace the two literal URLs in `server/providers/osh.js` with `oshListUrl()` calls until 2.1, 2.2 and 2.5 pass.
- [x] 3.4 Run `npm run check:boundaries` and the full `node --test`. Confirm `osh-005` and `osh-034` pass with no edit.
- [x] 3.5 Keep the tests for `osh-010`, `osh-011` and `osh-012`. This change does not change their behaviour.
- [x] 3.6 Change `buildNextPageUrl()` in `server/providers/osh/get.js` to name `OSH_LIST_FORMAT` for an `f` key, until 2.6 passes.
- [x] 3.7 Change `buildNextPageUrl()` to drop the `f` key when the current page asked for none, until 2.7 passes.
- [x] 3.8 Add a safety check to `oshListUrl()` that throws when the built URL leaves the root's origin or path.
- [x] 3.9 Move the `oshListUrl()` call in `base.js` inside `probeOnce`'s `try`, so a throw records one candidate as a miss.
- [x] 3.10 Change `buildNextPageUrl()` to drop every `f` key first, then append `OSH_LIST_FORMAT` once, from `current` alone, until 2.8 and 2.9 pass.

## 4. Gates and review

- [x] 4.1 Run `make lint` until no STE error remains.
- [x] 4.2 Run `make ratchet CHANGE=fix-osh-probe-format`.
- [x] 4.3 Run `make gates CHANGE=fix-osh-probe-format`. Confirm `get.js`, `base.js` and `osh.js` stay at 100%.
- [x] 4.4 Run the review agents and record the result in `review.md`.
