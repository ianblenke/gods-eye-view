## 1. Write the tests

- [x] 1.1 Write the tests for `gdacs-source-001`, `gdacs-source-002` and `gdacs-source-003` in `src/data/gdacsProxy.test.mjs`.
- [x] 1.2 Write the tests for `gdacs-source-004`, `gdacs-source-005` and `gdacs-source-006` in the same file.
- [x] 1.3 Write the tests for `gdacs-source-007`, `gdacs-source-008` and `gdacs-source-009` in the same file.
- [x] 1.4 Write the tests for `gdacs-source-010`, `gdacs-source-011`, `gdacs-source-012` and `gdacs-source-013` in the same file.
- [x] 1.5 Write the tests for `gdacs-source-014` and `gdacs-source-015` in the same file.
- [x] 1.6 Write the tests for `gdacs-source-016`, `gdacs-source-017` and `gdacs-source-018` in the same file.
- [x] 1.7 Write the tests for `gdacs-source-019` and `gdacs-source-020` in the same file.
- [x] 1.8 Write the tests for `gdacs-source-021`, `gdacs-source-022`, `gdacs-source-023` and `gdacs-source-024` in the same file.
- [x] 1.9 Write the tests for `gdacs-source-025`, `gdacs-source-026` and `gdacs-source-027` in the same file.

## 2. Write the code and the documents

- [x] 2.1 Write the provider in `server/providers/gdacs.js`.
- [x] 2.2 Register the provider in `server/providers/local.js`.
- [x] 2.3 Add the two new files to `openspec/ownership.json`.
- [x] 2.4 Add the two new files to `scripts/format-scope.json`.
- [x] 2.5 Write the section in `DATA_SOURCES.md`.
- [x] 2.6 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run the test file `src/data/gdacsProxy.test.mjs` on the host.
- [x] 3.2 Run the test files that list the providers on the host.
- [x] 3.3 Run one named fault for each rule and each limit of the spec.
- [x] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.5 Run the provider once against the real feed with a script outside the repository.
- [x] 3.6 Write `evidence/live-run.txt` with the counts of the run, the counts of the raw feed and the size of the document.
- [x] 3.7 Run the four checks of `make precheck` on the host.
- [x] 3.8 Run the STE lint on the host.
- [x] 3.9 Run `openspec validate gdacs-source --strict` on the host.

## 4. Lead work in the image

- [x] 4.1 Run `make ratchet CHANGE=gdacs-source`.
- [x] 4.2 Read the verdict of the ratchet.
- [x] 4.3 Ask the owner to accept the interpretation of the license in the Known limits `license-inferred` and `license-owner-step`.
- [x] 4.4 Run the two review agents.
- [x] 4.5 Write review.md.
- [x] 4.6 Run `make gates CHANGE=gdacs-source` on the final tree.
