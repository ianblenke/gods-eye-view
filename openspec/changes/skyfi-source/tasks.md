## 1. Write the tests

- [ ] 1.1 Write the tests for `skyfi-source-001`, `skyfi-source-002`, `skyfi-source-003`, `skyfi-source-004` and `skyfi-source-005` in `src/data/skyfiProxy.test.mjs`.
- [ ] 1.2 Write the tests for `skyfi-source-006`, `skyfi-source-007`, `skyfi-source-008` and `skyfi-source-010` in the same file.
- [ ] 1.3 Write the tests for `skyfi-source-011`, `skyfi-source-012`, `skyfi-source-013`, `skyfi-source-014` and `skyfi-source-015` in the same file.
- [ ] 1.4 Write the test for `skyfi-source-031` in the same file.
- [ ] 1.5 Write the tests for `skyfi-source-009` and `skyfi-source-016` in `src/data/skyfiUpstream.test.mjs`.
- [ ] 1.6 Write the tests for `skyfi-source-017`, `skyfi-source-018` and `skyfi-source-019` in `src/data/skyfiScenes.test.mjs`.
- [ ] 1.7 Write the tests for `skyfi-source-020`, `skyfi-source-021`, `skyfi-source-022`, `skyfi-source-023`, `skyfi-source-024`, `skyfi-source-025`, `skyfi-source-026`, `skyfi-source-027`, `skyfi-source-028`, `skyfi-source-029`, `skyfi-source-030` and `skyfi-source-032` in `src/data/skyfiThumbnails.test.mjs`.

## 2. Write the files

- [ ] 2.1 Write `server/providers/skyfi/normalize.js`.
- [ ] 2.2 Write `server/providers/skyfi/upstream.js`.
- [ ] 2.3 Write `server/providers/skyfi/thumbnails.js`.
- [ ] 2.4 Write `server/providers/skyfi.js`.
- [ ] 2.5 Add the two plugins to `server/providers/local.js`.
- [ ] 2.6 Add the new files to `openspec/ownership.json`.
- [ ] 2.7 Format the new code files with Prettier.
- [ ] 2.8 Write the entry in `CHANGELOG.md`.
- [ ] 2.9 Write the paragraph in `DATA_SOURCES.md`.
- [ ] 2.10 Write the block in `.env.example`.

## 3. Check on the host

- [ ] 3.1 Run the four test files of the plugins with coverage on the host.
- [ ] 3.2 Write `evidence/api-description.txt` with the address, the date and the SHA-256 of each document of SkyFi that the lead read.
- [ ] 3.3 Write `evidence/probe.txt` with the requests and the answer shape of the probe of 2026-10-23.
- [ ] 3.4 Run each named test against its fault.
- [ ] 3.5 Write `evidence/faults.txt` with the result of each fault.
- [ ] 3.6 Run each test file on the host.
- [ ] 3.7 Run the four checks of `make precheck` on the host.
- [ ] 3.8 Run the STE lint on the host.
- [ ] 3.9 Run `openspec validate skyfi-source --strict` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=skyfi-source`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=skyfi-source` on the final tree.
