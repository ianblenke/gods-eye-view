**Round 2, spec adversary — osh-geo-discovery.** Scope: diff `b3d28e0`, against `020fb86`. Repo clean; all mutation work ran on a copy under the scratchpad. No network.

**1. BLOCKER — finding 4 is not closed. The three sync-throw tests are tagged `osh-029`, and what they assert is the literal negation of `osh-046`.**

`osh-046` (`specs/osh/spec.md:118-119`): **WHEN** the layer updates and the features getter throws → **THEN** `partial:true`, and sets no `error`. The new test at `src/data/oshLayer.test.mjs:1235` has a features getter that throws and asserts `error` set, `partial:false`.

A synchronous throw *is* "the features getter throws". No scenario anywhere distinguishes a thrown-in-the-argument-list throw from a rejected promise, so `osh-046` reads as covering both and saying the opposite. The tests then hang off `osh-029`, whose only error clause is "a failed **systems** fetch sets `error`" — a features getter is not a systems fetch. Round 1 asked why no scenario described that catch body; round 2 answered with three tests and no scenario. The trace gate cannot see this: it checks that a tag exists, not that the scenario claims what the test proves.

**2. Finding 5 is not closed, and I can demonstrate it.** `FEATURE_LABEL_DISTANCE_METERS` was exported so the test could assert `condition.far === FEATURE_LABEL_DISTANCE_METERS`. Both sides move together. I set the constant to `5_000` and ran the file: **48 pass, 0 fail.** `osh-045` says "the entity's label shows only within 200 km" and the proposal repeats it; nothing pins it. The fix added public API surface and bought no discrimination. `near === 0` is genuinely pinned; `far` is not.

**3. The nameless-feature test proves something `osh-045` does not claim.** It is a good test — I confirmed it — but `osh-045` has no THEN about a feature with no name. This is finding 7's shape, which *was* fixed by adding a THEN to `osh-046`; the same treatment was not applied here.

**4. Closing finding 3 orphaned two tests.** `osh-047`'s WHEN was narrowed to "the `system` query key **is present**" — correct, the contradiction with `osh-048` is gone. But `oshProxy.test.mjs:567` and `oshIds.test.mjs:102-103` still carry the `osh-047` tag and assert the absent case the new WHEN excludes. No `osh-047` THEN covers the fall-through.

**Mutation table** (all 47 in `oshLayer.test.mjs`; survivors re-run against all 251):

| # | mutation | reds | test |
|---|---|---|---|
| M1 | `FEATURE_LABEL_DISTANCE_METERS` 200_000→100_000 | **yes** | `[osh-045]` — S3 tautology confirmed fixed |
| M2 | `callSourceGetFois` de-`async` | **yes** | `[osh-046]` sync throw |
| M3 | `callSourceGetSystems` de-`async` | **no (251)** | equivalent mutant, withdrawn |
| M4 | catch stops setting `_lastError` | **yes** | dup-id + non-Error |
| M5 | catch `return true` | **yes** | `[osh-029]` duplicate feature id |
| M6 | `error?.message \|\|` → `error.message` | **yes** | `[osh-029]` thrown non-Error |
| M7 | drop `typeof source.getFois !== 'function'` guard | **no (251)** | genuine survivor; minor, accepted |
| M8 | feature label always built | **yes** | `[osh-045]` no-name |

**M3 is an equivalent mutant, not a gap.** With a sync-throwing `getSystems`, wrapper and no-wrapper both end at `_lastError = message; return false`. They differ only in the stale case. No test can red it without contrivance.

**Other adjudications.** `osh-047`'s new THEN reads true and is covered. `osh-046` reads true; no surviving asymmetry. The collapse lost nothing: the three deleted sync-throw tests proved (a) sync throw handled — now `osh-046`; (b) error clears on a later success — still held; (c) non-Error fallback — now the `evilSystem` test, which M6 reds. Seven carried scenarios byte-identical to `main`. Renames altered no assertion.

Verdict: FAIL
