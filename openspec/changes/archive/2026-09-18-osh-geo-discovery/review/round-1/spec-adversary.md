**Round 1, spec adversary — osh-geo-discovery.** Scope: full, against `b3d28e0`.

**1. BLOCKER — a spec'd behaviour with no test at all; deleting the code passes the suite.**
`src/layers/osh/index.js:382-384` clears the selection when the selected feature leaves the refreshed list. **No test in the repository exercises the true branch.** Every test that calls `update()` after a feature click either never updates afterwards, or updates while the feature is still present. So an implementation that omits those three lines — a selection stuck on a vanished feature, polling a host forever — satisfies every test.

This is asserted twice in the delta: `specs/osh/spec.md:186` ("a later refresh that drops the feature clears both") and `:134` ("with its entity and **any selection of it**"). The `osh-049` test checks only that the *entity* goes; the click there picked a system entity, so `_selectedFeatureId` is null and the branch is never entered.

Plan task 5.6 names exactly this as a thing to rule out; `tasks.md:68` marks 5.6 done. It did not land. **Also: if the coverage gate reports 100% branch for `src/layers/osh/index.js`, that number is wrong — re-check it.**

*Caught by:* a test that selects a feature, drops it from the next `getFois()`, and asserts `selectedFeatureId`, `selectedId` and the poll all stop.

**2. `osh-049`'s poll clause does not discriminate.** `spec.md:131` says a selection of that system, "and its poll", stay across that refresh. The single `osh-049` test asserts `getStats().selectedId` only. `stopPolling()` (`index.js:59`) clears the timer and bumps `_pollGeneration` without touching `_selectedId`, so an implementation that stops the poll on every refresh passes unchanged. The union itself *is* well tested — count, entity, rename-in-place, and keyRequired-then-reappear is a genuinely good discriminator against clear-on-omission. Only the poll half proves nothing.

*Caught by:* advancing the fake timer past 15 s after the refresh that omits the system, and asserting the datastreams call count increased.

**3. `osh-047` asserts behaviour the route does not have, and contradicts `osh-048`.** `spec.md:195` WHEN covers the `system` value being "absent with another key present" and THEN requires `400 {error:'bad_system'}` with zero upstream requests. The route (`server/providers/osh.js:262`) gates on `searchParams.has('system')`, so `/datastreams?limit=5` falls through to the global list and **does** make an upstream call. `osh-048` says the opposite. No test sends that case. Fix the WHEN, or the two scenarios disagree and a future implementer can legally 400 every extra query key.

**4. Minor — `osh-045` label rule is vaguer than the code.** `spec.md:181` says "within 200 km"; the test asserts only that `distanceDisplayCondition` is truthy. 20 m or 20 000 km passes. `FEATURE_LABEL_DISTANCE_METERS` is unpinned by any test.

**5. Minor — `spec.md:133`** "only a `keyRequired` answer, `disable()` or `destroy()` empties the system map." `disable()` does **not** empty it; only `keyRequired` and `destroy()` do.

**6. Minor — code no scenario covers.** A `getFois()` resolving `keyRequired:true` yields an empty feature list with `partial:false` and no error, tested under `osh-046`, but no THEN line describes that silent-empty path.

**Clean on the hard constraints.** All 7 MODIFIED requirement texts and all 7 carried scenarios are byte-identical to `main`, verified by parse-and-compare against `git show main:openspec/specs/osh/spec.md`. One `method:` literal in the tree — `'GET'` at `server/providers/osh/get.js:75`; no POST/PUT/PATCH/DELETE string, no `body:` key, no raw transport import. No real host, id, count or place name in the change directory or the fixtures; every fixture id carries a `sys-`/`ds-`/`foi-fixture-` prefix; every host is `*.example`. Both pins were updated. I made no network call.

Verdict: FAIL
