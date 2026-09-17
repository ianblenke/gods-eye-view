## 1. Fixtures and adapters

- [x] 1.1 Write the three synthetic fixtures under `src/data/fixtures/`.
- [x] 1.2 Write the test for `osh-024`.
- [x] 1.3 Write `src/data/oshSystems.js` until 1.2 passes.
- [x] 1.4 Write the test for `osh-025`.
- [x] 1.5 Write `src/data/oshDatastreams.js` until 1.4 passes.
- [x] 1.6 Write the test for `osh-026` and `osh-027`.
- [x] 1.7 Write `src/data/oshObservations.js` until 1.6 passes.

## 2. Datastream id boundary

- [x] 2.1 Write the test for `osh-020`, the full rejection list.
- [x] 2.2 Write the test for `osh-021`, the accepted ids and the guard.
- [x] 2.3 Write `server/providers/osh/ids.js` until 2.1 and 2.2 pass.

## 3. The one upstream call site

- [x] 3.1 Write the test for `osh-004`, the recorded GET calls.
- [x] 3.2 Write the test for `osh-013`, the redirect refusal.
- [x] 3.3 Write the test for `osh-014`, the page walk.
- [x] 3.4 Write the test for `osh-015`, the body cap and the timeout.
- [x] 3.5 Write `server/providers/osh/get.js` until 3.1 to 3.4 pass.

## 4. API root resolution

- [x] 4.1 Write the test for `osh-009`, the configured value as a hit.
- [x] 4.2 Write the test for `osh-010`, the next candidate after a miss.
- [x] 4.3 Write the test for `osh-011`, one probe per process.
- [x] 4.4 Write the test for `osh-012`, failure and the hold.
- [x] 4.5 Write `server/providers/osh/base.js` until 4.1 to 4.4 pass.

## 5. Newest observation cache

- [x] 5.1 Write the test for `osh-022`, the newest observation shape.
- [x] 5.2 Write the test for `osh-023`, the per-id cache.
- [x] 5.3 Write `server/providers/osh/observations.js` until 5.1 and 5.2 pass.

## 6. Provider routes

- [x] 6.1 Write the test for `osh-001`, `osh-002` and `osh-003`, the keyless behaviour.
- [x] 6.2 Write the test for `osh-005`, the text scan of the provider files.
- [x] 6.3 Write the test for `osh-006`, the method guard.
- [x] 6.4 Write the test for `osh-007` and `osh-008`, credentials and their secrecy.
- [x] 6.5 Write the test for `osh-016`, `osh-017`, `osh-018` and `osh-019`, the list cache.
- [x] 6.6 Write the test for `osh-035`, the two server hooks.
- [x] 6.7 Write `server/providers/osh.js` until 6.1 to 6.6 pass.
- [x] 6.8 Register `oshProxy()` in `server/providers/local.js`, before `keySetupEndpoint()`.
- [x] 6.9 Add `./server/providers/osh` to `package.json` and its boundary group.

## 7. Systems layer

- [x] 7.1 Write the test for `osh-028`, the browser source.
- [x] 7.2 Write `src/layers/osh/source.js` until 7.1 passes.
- [x] 7.3 Write the test for `osh-032`, the escaped detail HTML.
- [x] 7.4 Write `src/layers/osh/detail.js` until 7.3 passes.
- [x] 7.5 Write the test for `osh-029`, the entities and the stats.
- [x] 7.6 Write the test for `osh-030`, the datastream poll of the selected system.
- [x] 7.7 Write the test for `osh-031`, the moved marker.
- [x] 7.8 Write `src/layers/osh/index.js` until 7.5 to 7.7 pass.
- [x] 7.9 Write `src/data/osh.js` to wire the source and the default export.
- [x] 7.10 Add `./layers/osh` to `package.json` and its boundary group.
- [x] 7.11 Write the test for `osh-033`, the registry entry.
- [x] 7.12 Add the registry entry to `src/data/layerState.js` and the layer to `src/data/localLayers.js`.
- [x] 7.13 Change the registered-layer count in `src/data/layerState.test.mjs` from 16 to 17.

## 8. Repository hygiene and configuration

- [x] 8.1 Write the test for `osh-034`, the address and fixture-id scan.
- [x] 8.2 Add the three commented keys to `.env.example` until 8.1 passes.
- [x] 8.3 Run `npm run check:boundaries`.

## 9. Gates and review

- [x] 9.1 Run `make lint` until no STE error remains.
- [x] 9.2 Run `make ratchet CHANGE=osh-fusion` until all gates pass.
- [ ] 9.3 Run the review agents and record the result in `review.md`.
