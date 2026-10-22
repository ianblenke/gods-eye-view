## 1. Write the tests

- [ ] 1.1 Write the tests for `planet-source-001`, `planet-source-002`, `planet-source-003`, `planet-source-004` and `planet-source-005` in `src/data/planetProxy.test.mjs`.
- [ ] 1.2 Write the tests for `planet-source-006`, `planet-source-007`, `planet-source-008` and `planet-source-010` in the same file.
- [ ] 1.3 Write the tests for `planet-source-011`, `planet-source-012`, `planet-source-013`, `planet-source-014` and `planet-source-015` in the same file.
- [ ] 1.4 Write the test for `planet-source-031` in the same file.
- [ ] 1.5 Write the tests for `planet-source-009` and `planet-source-016` in `src/data/planetUpstream.test.mjs`.
- [ ] 1.6 Write the tests for `planet-source-017`, `planet-source-018` and `planet-source-019` in `src/data/planetScenes.test.mjs`.
- [ ] 1.7 Write the tests for `planet-source-020` to `planet-source-030` and `planet-source-032` in `src/data/planetThumbnails.test.mjs`.

## 2. Write the files

- [ ] 2.1 Write `server/providers/planet/normalize.js`.
- [ ] 2.2 Write `server/providers/planet/upstream.js`.
- [ ] 2.3 Write `server/providers/planet/thumbnails.js`.
- [ ] 2.4 Write `server/providers/planet.js`.
- [ ] 2.5 Add the two plugins to `server/providers/local.js`.
- [ ] 2.6 Add the new files to `openspec/ownership.json`.
- [ ] 2.7 Format the new code files with Prettier.
- [ ] 2.8 Write the entry in `CHANGELOG.md`.
- [ ] 2.9 Write the paragraph in `DATA_SOURCES.md`.
- [ ] 2.10 Write the block in `.env.example`.

## 3. Check on the host

- [ ] 3.1 Run the tests of the plugins on the host.
- [ ] 3.2 Write `evidence/api-description.txt` with the address, the date and the SHA-256 of each document of Planet that the lead read.
- [ ] 3.3 Write `evidence/probe.txt` with the requests and the answer shape of the probe of 2026-10-22.
- [ ] 3.4 Run each named test against its fault.
- [ ] 3.5 Write `evidence/faults.txt` with the result of each fault.
- [ ] 3.6 Run each test file on the host.
- [ ] 3.7 Run the four checks of `make precheck` on the host.
- [ ] 3.8 Run the STE lint on the host.
- [ ] 3.9 Run `openspec validate planet-source --strict` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=planet-source`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=planet-source` on the final tree.
