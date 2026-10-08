## Why

The backfill records data packs and project shares at commit `290b5d2`.
The director feature checks assets before display and carries local files in a scene bundle.
The source files of `src/director` stay the same at this commit and at main.

## What Changes

- Add requirements to the director capability.
- Tag tests in scope.
- Add tests for old code paths.
- Check assertions with code mutations.

## Capabilities

- Add requirements to `director`.

## Impact

The change edits tests and adds change documents.
It does not change production code or browser QA scripts.
The evidence records the ledger gaps and the host coverage sweep.
The lead updates the ledger after the gate image checks.

The scope sweep lists 22 old tests and 35 new scenarios.
The evidence gives the exact source commands for these totals.
The host coverage sweep closes the measured path gaps in scope.
The lead confirms those results in the gate image.

## Known limits and later changes

- Known limit `geojson-inherited-height`: the decoder checks coordinate values of the array, then reads an inherited height at line 27 of geojson.js.
  The case uses an inherited value at index 2.
  An inherited height can exceed the height limits.
  No scenario states this behavior.
- Known limit `session-signal-getter`: a custom signal getter can destroy the session at line 74 of session.js before the source call at line 100.
  The source still receives a call.
  The session can return true with resources in the ready state after destruction.
  No scenario states this behavior.
- Known limit `old-tests-outside-scope`: the project migration test and the author details test keep their names without tags.
  They check code outside this change.
- Known limit `code-probes-without-scenarios`: the scratch tests record the inherited height and signal getter code limits.
  The repository does not include these tests.
  The scratch file is `limits.test.mjs`.
- Known limit `row-m172`: the repository tests do not kill mutation row m172.
  Only the scratch test `limits.test.mjs` kills this row.
  Later changes `fix-director-*` add scenarios, repository tests and code changes for these two limits.

- Known limit `bundle-nonnumeric-length`: a custom Uint8Array length getter can return text instead of a number.
  The export helper then adds text to the total at line 157 of bundle.js.
  The byte check can reject three real bytes as excess total bytes.
  A later absent length can also make the total nonnumeric.
  No scenario states this behavior.
