## Context

This change reads commit `5fd416b9ed4a80c9a1ceeded81836aa69f3ebc0c` on branch `backfill-share-codec`.
The source document is `docs/SHARE-LINK-FORMAT.md`.
The history contains the short-link format change at `da02fd86`.

## Decisions

The delta adds a new capability with backfill origins.
Tests call public exports with local data.
Each scalar, flag, panel, parameter and option uses a distinct test value.
Tests inspect bytes and decoded values to detect shared encoder and decoder faults.

The mutation helper restores each production file after each mutation.
The audit names each decision and key loop.
The evidence records host coverage and does not state a gate verdict.

## Files

The production scope consists of these modules:

- `src/share/follow.js`
- `src/share/legacyShareState.js`
- `src/share/shareLinkPath.js`
- `src/share/viewCodec.js`
- `src/share/wire.js`

The tests use adjacent test files.
The import sweep includes tests outside this directory.
This change keeps those tests unchanged.

## Known limits

The limits below describe commit `5fd416b9ed4a80c9a1ceeded81836aa69f3ebc0c`.
The evidence gives the host measurements and probe commands.

### Known limit `share-codec-absent-option`

The false path at `src/share/viewCodec.js:307` cannot run through the public codec API with the current registry.
Every option spec names an own key of the frozen absent table.
The normalizer selects keys from the fixed registry before this helper runs.
Custom option owners and keys cannot change that registry.
Tests try absent options, custom option values, an unknown owner and a mirror owner.

### Known limit `share-codec-inferred-view`

The write at `src/share/viewCodec.js:941` cannot run through the public API.
The normalizer returns only the literal view kinds from `thingView` or `normalizeView`.
The encoder infers that same kind before it compares the values.
Tests try each entity, an invalid entity, a future view name and a getter that removes its entity.

### Known limit `share-codec-enum-entry`

The return at `src/share/viewCodec.js:1063` cannot run through the public API.
The loop at line 1304 excludes each absent entry before the call at line 1311.
The parser creates each present entry as an object.
A custom code object cannot supply a private entry because the decoder accepts only primitive strings.
Tests try absent enums, unknown enum codes, text names and wrong wire types.

### Known limit `share-codec-entity-entry`

The return at `src/share/viewCodec.js:1211` cannot run through the public API.
The caller returns at line 1255 when the entity entry is absent.
The next call at line 1263 therefore supplies an entry from the fixed entity table.
Tests try absent ids, unknown kinds, duplicate ids and invalid ids.

### Known limit `share-codec-host-worker-coverage`

The main module leaves source branches at `src/share/viewCodec.js:544`, line 866 and line 870 unused with the current tables.
A view input cannot change the defaults that the module captures at import.
The isolated worker changes source tables before its own import.
That test reaches the alternate paths without changes to the production files.

The host main report does not include worker branch coverage.
A separate inspector snapshot records those worker paths.
The evidence lists the main result and the worker witnesses separately.

The standard style table enables detection, so line 544 does not select OFF.
Only Normal lacks style parameters, and Normal cannot call the parameter encoder.
Thus the normal module does not use the fallback at line 866.
The normalizer copies each default parameter key before the encoder, so line 870 does not skip a key.
The worker uses an inactive detection source and an incomplete shader table to reach these paths.

### Known limit `share-codec-partial-fix`

At `src/share/viewCodec.js:1232`, the decoder accepts a fix with only one coordinate.
It gives the other coordinate the value zero.
The encoder writes both coordinates.
No scenario states this behavior.

### Known limit `share-codec-style-getter`

At `src/share/viewCodec.js:658`, the normalizer reads the style property twice.
A getter can change the name between those reads.
The encoder can then write an unknown style name, which the decoder reports with the Normal fallback.
No scenario states this behavior.

## Gates and review

The host cannot supply the QA purpose lines from the full gates.
The lead runs the ratchet and gates in the calibrated container.
The lead gets both formal reviews before the merge.

### Known limit `share-codec-old-title`

The old title below contains the banned word `malformed`.
The owner forbids a change to that title.
This change keeps the test without a tag.
New tests under `share-codec-034` check invalid payloads.

```text
src/share/viewCodec.test.mjs
malformed input is rejected with a reason, never thrown
```

## Measurement commands

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/measure.py
cd /home/ianblenke/docker/gev-work/sharecodec && node /home/ianblenke/docker/gev-tools/sharecodec/test-audit.mjs
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/verify.py
cd /home/ianblenke/docker/gev-work/sharecodec && node /home/ianblenke/docker/gev-tools/sharecodec/worker-coverage.mjs
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/coverage-merge.py
```

## Purpose at archive time

The lead sets this Purpose at archive time:

Describe how the share codec writes a view of the globe as a short code, reads that code back, and reads the old link form.

## Correction source

The correction check reads commit `4cf8e3706060658bf303d3d6e49643d0a4cb6a9f`.
The earlier tables keep their source commit.
