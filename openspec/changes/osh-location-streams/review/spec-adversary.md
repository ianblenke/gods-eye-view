# Spec adversary — osh-location-streams

Round 1, scope full, read against `9895b38`. The evidence is mutation: 42
mutants across five batteries, each scored RED, SURVIVED, EQUIVALENT or
TIMEOUT, with the tree named per result. Nothing below rests on reading alone
except where it says so.

## Findings

- [x] FINDING blocker osh-029 [read at 7a78a88] carried "and none for a system with no `Point`" byte-identical from main, while osh-042 and osh-057 in the same delta place a system with no `Point` from a fresh stream location. A contradiction between scenarios, not a silence: the clause was false for this change's own headline behaviour on the first refresh a position stream answers. Fixed at 5d86da4, which qualified the clause the way osh-042's own reads, and added `placed` to the getStats() enumeration the same scenario omitted.
- [x] FINDING minor osh-046 [read at 0e44403] pinned `keyRequired` for the features read and never for the locations read. Mutant L9, ignoring `keyRequired` on locations, survived at 0e44403 in 13s with a full plan. A spec gap as well as a test gap. Fixed at 87e602c; the mutant now reddens `[osh-046] a locations getter that resolves keyRequired:true alone gives an empty location list, with partial:false and no error`.
- [x] FINDING minor osh-057 [read at 0e44403] asserted `getStats().placed.stream` by name while nothing pinned it. Mutant L7, counting every placed system rather than only stream-placed ones, survived at 0e44403 in 13s with a full plan. Fixed at 87e602c; the mutant now reddens `[osh-057] getStats().placed.stream counts only the stream-placed system, not the geometry-placed one`.
- [x] FINDING minor src/data/oshSystems.js:136 [read at 87e602c] read `location.foiId ? featureById.get(foiId) : featureByUid.get(foiUid)` while osh-042 says "`foiId` or `foiUid` names a held feature", so a location carrying an unheld `foi@id` alongside a held `samplingFeatureUid` was dropped where the scenario says it moves — and the scenario's two clauses disagreed with each other on that input. Fixed at 85c4a27 to `featureById.get(foiId) ?? featureByUid.get(foiUid)`. The obvious test, exercising foiId-set-with-foiUid-null and the reverse, passes under the old ternary too and would have proved nothing; the one that kills the mutant is `[osh-042] a location with an unheld foiId but a held foiUid still moves that feature` at oshSystems.test.mjs:256, where reverting leaves the feature at lon 1 instead of 11.
- [x] FINDING minor src/layers/osh/index.js:402 [read at 87e602c] is an EQUIVALENT mutant and not a gap. Inverting held-name over placeholder-name precedence cannot be killed by any test: `isPlaceholder` is true only for records built at oshSystems.js:175, whose `name` is null by :90, so both orderings agree on every reachable input. Its survival is correct behaviour by the instrument. The genuine precedence gap was `effectiveName` at :139, and it is fixed and pinned.
- [x] FINDING minor src/layers/osh/index.js:383 [found by the ratchet, closed at 702e61e] the `placedIds.has(id)` disjunct of the retirement skip — a branch created by this change's own osh-057 counter fix hours earlier — had no test of its own. Raised as LEDGER-NEW-COVERAGE-GAP. Closed by `[osh-057] a placeholder that gains a held record and a Point on a later refresh is not counted as retired`, which dropping the disjunct reddens. Recorded because the gate found a gap this change introduced that no reviewer saw.

## Withdrawn

Seven findings were raised from a superseded `7a78a88` copy of the tree, or
were investigated and dropped, and do not stand at 0e44403 or later. Each is
named with what was claimed and why it failed, because the cause was identical
almost every time — reading a tree that had already moved — and a reader
should be able to see it.

- [x] FINDING blocker WITHDRAWN osh-031/osh-032 base text — claimed the delta replaced main's text and dropped every OSH_CLOCK_SKEW_MAX_MS line. Already fixed in 3aed244 before this review began: at 0e44403 osh-031 carries "or further below zero than `OSH_CLOCK_SKEW_MAX_MS`, or null" and osh-032 carries all four clauses plus "below its time".
- [x] FINDING blocker WITHDRAWN osh-051 list-position binding — claimed no test discriminates positional binding, on a census showing every axisID pair Lat-before-Lon. False: oshObservations.test.mjs:694 is `[osh-051] binds by axisID, not by list position: Lon listed before Lat still binds correctly`, from b188e19, and the real census is 10 Lat to 8 Lon.
- [x] FINDING blocker WITHDRAWN osh-042 unheld-feature cross-placement — mutant M16 survived on 7a78a88; RED at 0e44403 in 13s, naming `[osh-042] a fresh location naming an unknown feature is dropped entirely — it never places its own systemId as a fallback`.
- [x] FINDING blocker WITHDRAWN osh-052 samplingFeatureUid wiring — mutant M12 survived on 7a78a88; RED at 0e44403 in 13s, naming `[osh-052] a schema-bound samplingFeatureUid reaches the page record as foiUid, end to end`.
- [x] FINDING minor WITHDRAWN osh-055 white-space guard — mutant M19 survived on 7a78a88; RED at 0e44403 in 13s, naming `[osh-055] refuses a value that holds white space, even though it would otherwise parse as a URN`.
- [x] FINDING minor WITHDRAWN osh-056 snapshot-name clause — mutant M22 survived on 7a78a88; RED at 0e44403 in 13s, naming `[osh-056] a candidate whose system is already in the systems snapshot uses that name, with no by-id read`.
- [x] FINDING minor WITHDRAWN server/providers/osh.js:234 missing `f` key — claimed the property-filter list URL omits the `f` key every other list fetcher sends. Investigated and dropped: the split is by endpoint, not oversight. `systems` at :274 and `fois` at :292 send `f: OSH_LIST_FORMAT`; `datastreams` does not, at the pre-existing global list at :283 as well as the new filtered one, and osh-048 already pins that a datastreams request carries no `f` key.

## What was attacked, and held

The three deletions of D51 hold, checked against their callers rather than
against coverage — the standard D51 itself sets, since a mutation that fails to
redden is equally consistent with a missing test. `vectorReaderOf()`'s array
guard: its sole caller `walkForVector` tests `Array.isArray(field.coordinates)`
before calling. `readFinite()`'s null-path guard: `extractOshLocation` checks
`reader.lat` and `reader.lon` at entry and reaches the height only through
`reader.alt ? …`. The `|| null` on `systemId`: both candidate sources are
`mapOshDatastreams()` and the per-host stamp, each guaranteeing a string or
null. A `javascript:` URI does pass the property filter; it becomes an
`observedProperty` query value and is never fetched, and the design records it.

The frame rule discriminates in both directions, and not by one rule doing both
jobs. An absent `referenceFrame` binds: mutant M1 reddens `[osh-051] reads the
no-frame Vector fixture — the measured aircraft shape — with no referenceFrame
at all`. An ECEF vector does not, by its frame independently of its axes: M2,
accepting EPSG 4978, reddens `[osh-051] a frame outside EPSG 4979/4326 gives
null even with valid axis ids`, while X/Y/Z axis ids fail on their own.

GET-only holds on every new call. No OpenSensorHub host, id, count or place
name appears in the provider, the adapters, the layer, the fixtures or
`.env.example`; the vendor property URI lives in `OSH_LOCATION_PROPERTIES`,
empty in the example. Base text: osh-020, 021, 024, 025, 029, 030, 033, 041,
047, 048 and 049 are byte-identical to `git show main:`; osh-047 and osh-048
sit under "Datastreams of one system" as they do on main; no requirement text
changed.

## Found here, fixed elsewhere

`src/data/oshLayer.test.mjs` has 63 `layer.destroy(viewer)` calls and exactly
one `finally`. A failing assertion skips teardown, `_pollTimer` stays armed,
and `node --test` cannot exit: the suite prints its failure and then hangs,
with no `1..N` plan line. Two consequences follow. A real layer regression
reaches CI as a build timeout rather than a red test — and a timeout reads as
infrastructure and gets retried, so the signal exists and nobody acts on it. It
also silently breaks mutation testing: five mutants returned no reading across
two batteries, on loaded and quiet machines alike, and all five were reds. This
change did not introduce it and does not fix it; it is queued as its own
change, whose fix is `t.after(() => layer.destroy(viewer))` at every site.

## On the instrument

Five reds were discarded before the harness was fixed, and that belongs in the
record rather than only in the result. One battery printed a timeout tag beside
the word SURVIVED — a label that reads correctly to its author and wrongly to
everyone else. Two batteries read stdout only on process exit, so a suite that
fails and then hangs returned nothing at all. One leaked a container on every
timeout, because a `subprocess.run` timeout around `docker run` kills the
client and leaves the daemon's container running; the orphans then slowed every
later mutant until the battery died of its own exhaust. A false survivor is the
expensive direction of error — it sends an implementer to write a test for a
hole that does not exist — and four of this review's own blockers were exactly
that, from a stale tree rather than a broken instrument, but at the same cost.
Check the hash first, not last. The harness contract that resulted is recorded
in `coverage-is-not-proof`.

## Mutation table

| # | Mutation | Tree | Result |
|---|---|---|---|
| L1 | placeholder enters the union map | 0e44403 | RED x3 |
| L2 | retiredPlaceholders += 0 | 0e44403 | RED |
| L3 | selection not exempt from the retirement count | 0e44403 | SUPERSEDED by d043b2c |
| L4 | disable the selected re-add at index.js:427 | 0e44403 | RED — `not ok 58 - [osh-057] a selected stream-placed system keeps its entity at its last position until deselected` |
| L5 | drop the streamSystemName label fallback | 0e44403 | RED |
| L6 | invert held-name precedence | 87e602c | EQUIVALENT |
| L7 | placed.stream counts every placed system | 87e602c | RED — fix proven |
| L8 | partial not set by a failed locations read | 0e44403 | RED |
| L9 | ignore keyRequired on locations | 87e602c | RED — fix proven |
| L10 | layer sends a candidate of its own | 0e44403 | RED |
| L11, L12, L13 | detail name fallback, placedBy, renderPlacedBy | 0e44403 | RED, all naming `[osh-057] the detail for a selected stream-placed placeholder shows Placed by…` |
| S1 | drop the `ageMs < -OSH_CLOCK_SKEW_MAX_MS` lower bound | 0e44403 | RED — `not ok 104 - [osh-031] a newest result from far ahead of the clock leaves the entity where it was` |
| INV | reinstate the selected-id disjunct in the retirement skip | d043b2c | RED — 0 !== 1 at the new unplaced assertion, with the entity-presence and selectedId assertions above it necessarily evaluated and passed |
| M1-M23 | schema, page, placement, URL and provider mutants | 7a78a88 | 18 RED, 5 SURVIVED — four now RED at 0e44403, M3 settled by the b188e19 test |

Verdict: PASS
