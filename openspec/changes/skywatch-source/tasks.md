## 1. Write the tests

- [x] 1.1 Write the tests for `skywatch-source-001`, `skywatch-source-002`, `skywatch-source-003` and `skywatch-source-004` in `src/data/skywatchProxy.test.mjs`.
- [x] 1.2 Write the tests for `skywatch-source-009`, `skywatch-source-010`, `skywatch-source-013` and `skywatch-source-017` in the same file.
- [x] 1.3 Write the tests for `skywatch-source-014`, `skywatch-source-015`, `skywatch-source-016` and `skywatch-source-018` in the same file.
- [x] 1.4 Write the tests for `skywatch-source-019` and `skywatch-source-022` in the same file.
- [x] 1.5 Write the tests for `skywatch-source-005`, `skywatch-source-006`, `skywatch-source-007` and `skywatch-source-008` in `src/data/skywatchInput.test.mjs`.
- [x] 1.6 Write the tests for `skywatch-source-011` and `skywatch-source-012` in `src/data/skywatchUpstream.test.mjs`.
- [x] 1.7 Write the tests for `skywatch-source-020` and `skywatch-source-021` in `src/data/skywatchScenes.test.mjs`.

## 2. Write the files

- [x] 2.1 Write `server/providers/skywatch/validate.js`.
- [x] 2.2 Write `server/providers/skywatch/normalize.js`.
- [x] 2.3 Write `server/providers/skywatch/upstream.js`.
- [x] 2.4 Write `server/providers/skywatch.js`.
- [x] 2.5 Add the plugin to `server/providers/local.js`.
- [x] 2.6 Add the new files to `openspec/ownership.json`.
- [x] 2.7 Format the new code files with Prettier.
- [x] 2.8 Write the entry in `CHANGELOG.md`.
- [x] 2.9 Write the paragraph in `DATA_SOURCES.md`.
- [x] 2.10 Write the block in `.env.example`.

## 3. Check on the host

- [x] 3.1 Run the tests of the plugin on the host.
- [x] 3.2 Write `evidence/api-description.txt` with the address, the date, the version and the SHA-256 of the public API description.
- [x] 3.3 Run the named faults of the plugin.
- [x] 3.4 Write `evidence/faults.txt` with the result of each fault.
- [x] 3.5 Run each test file on the host.
- [x] 3.6 Run the four checks of `make precheck` on the host.
- [x] 3.7 Run the STE lint on the host.
- [x] 3.8 Run `openspec validate skywatch-source` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=skywatch-source`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=skywatch-source` on the final tree.
