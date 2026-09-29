# spec-adversary round 1 — osh-camera-link

Scope: full
Verdict: FAIL

## Findings

- [x] F1 critical `src/layers/osh/index.js:325` — the `if (linkedVideo) openVideoSession(...)` false branch (a matched, name-eligible camera system whose own datastreams have no `video: true` record) has no scenario line in `osh-097` and no test among the four `[osh-097]` tests in `src/data/oshLayer.test.mjs`. Corrected: added an AND line to the scenario and a fifth `[osh-097]` test; verified the file exists, reads its datastreams, and starts no video.
- [x] F2 major `src/data/oshRepositoryHygiene.test.mjs:11-30` — the new file `src/layers/osh/cameraLink.js` was never added to `PROVIDER_FILES`, so the stricter "no real-looking address" hygiene check silently skips it even though the same file's `[osh-034]` test count was updated in this change. Corrected: added it to `PROVIDER_FILES`.
- [x] F3 minor `src/layers/osh/index.js:322-324` — the `record.systemId === linkedRecord.id` filter in the fallback's `.find()` is never exercised distinctly from `record.video === true`. Corrected: strengthened the success test with a third, unrelated system with its own video datastream, listed before the matched one; verified by mutation.
- [x] F4 minor `design.md` doesn't name `cameraLink.js`/its test file per the design-doc file-naming rule. Corrected: added.

Also confirmed solid, no action needed: `findLinkedCameraSystem`'s own mutations, the faithful test move into `oshLayer.test.mjs`, the osh-034 count fix, the clean spec merge, and no behavioral regression from the `async`/`await` conversion of `openStreams()`.
