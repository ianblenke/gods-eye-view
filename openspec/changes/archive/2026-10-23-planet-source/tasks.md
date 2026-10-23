## 1. Write the tests

- [x] 1.1 Write the tests for `planet-source-001`, `planet-source-002`, `planet-source-003`, `planet-source-004` and `planet-source-005` in `src/data/planetProxy.test.mjs`.
- [x] 1.2 Write the tests for `planet-source-006`, `planet-source-007`, `planet-source-008` and `planet-source-010` in the same file.
- [x] 1.3 Write the tests for `planet-source-011`, `planet-source-012`, `planet-source-013`, `planet-source-014` and `planet-source-015` in the same file.
- [x] 1.4 Write the test for `planet-source-031` in the same file.
- [x] 1.5 Write the tests for `planet-source-009` and `planet-source-016` in `src/data/planetUpstream.test.mjs`.
- [x] 1.6 Write the tests for `planet-source-017`, `planet-source-018` and `planet-source-019` in `src/data/planetScenes.test.mjs`.
- [x] 1.7 Write the tests for `planet-source-020`, `planet-source-021`, `planet-source-022`, `planet-source-023`, `planet-source-024`, `planet-source-025`, `planet-source-026`, `planet-source-027`, `planet-source-028`, `planet-source-029`, `planet-source-030` and `planet-source-032` in `src/data/planetThumbnails.test.mjs`.

## 2. Write the files

- [x] 2.1 Write `server/providers/planet/normalize.js`.
- [x] 2.2 Write `server/providers/planet/upstream.js`.
- [x] 2.3 Write `server/providers/planet/thumbnails.js`.
- [x] 2.4 Write `server/providers/planet.js`.
- [x] 2.5 Add the two plugins to `server/providers/local.js`.
- [x] 2.6 Add the new files to `openspec/ownership.json`.
- [x] 2.7 Format the new code files with Prettier.
- [x] 2.8 Write the entry in `CHANGELOG.md`.
- [x] 2.9 Write the paragraph in `DATA_SOURCES.md`.
- [x] 2.10 Write the block in `.env.example`.

## 3. Check on the host

- [x] 3.1 Run the tests of the plugins on the host.
- [x] 3.2 Write `evidence/api-description.txt` with the address, the date and the SHA-256 of each document of Planet that the lead read.
- [x] 3.3 Write `evidence/probe.txt` with the requests and the answer shape of the probe of 2026-10-22.
- [x] 3.4 Run each named test against its fault.
- [x] 3.5 Write `evidence/faults.txt` with the result of each fault.
- [x] 3.6 Run each test file on the host.
- [x] 3.7 Run the four checks of `make precheck` on the host.
- [x] 3.8 Run the STE lint on the host.
- [x] 3.9 Run `openspec validate planet-source --strict` on the host.

## 4. Lead work in the image

- [x] 4.1 Run `make ratchet CHANGE=planet-source`.
- [x] 4.2 Run the two review agents.
- [x] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=planet-source` on the final tree.
