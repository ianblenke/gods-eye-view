## 1. Write the tests

- [x] 1.1 Write the tests for `reticulum-source-001`, `reticulum-source-002` and `reticulum-source-003` in `src/data/reticulumProxy.test.mjs`.
- [x] 1.2 Write the tests for `reticulum-source-004`, `reticulum-source-005` and `reticulum-source-006` in the same file.
- [x] 1.3 Write the tests for `reticulum-source-007`, `reticulum-source-008` and `reticulum-source-009` in the same file.
- [x] 1.4 Write the tests for `reticulum-source-010` and `reticulum-source-011` in the same file.
- [x] 1.5 Write the tests for `reticulum-source-012` and `reticulum-source-013` in the same file.

## 2. Write the code and the documents

- [x] 2.1 Write the provider in `server/providers/reticulum.js`.
- [x] 2.2 Register the provider in `server/providers/local.js`.
- [x] 2.3 Add the two new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [x] 2.4 Write the section in `DATA_SOURCES.md` and the line in `.env.example`.
- [x] 2.5 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run the test file `src/data/reticulumProxy.test.mjs` on the host.
- [x] 3.2 Run the test files that list the providers on the host.
- [x] 3.3 Run the named faults of the provider.
- [x] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.5 Run the four checks of `make precheck` on the host.
- [x] 3.6 Run the STE lint on the host.
- [x] 3.7 Run `openspec validate reticulum-provider` on the host.
- [x] 3.8 Write `evidence/spike.txt` with the counts of the listener test.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=reticulum-provider`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=reticulum-provider` on the final tree.
