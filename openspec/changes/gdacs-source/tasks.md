## 1. Write the tests

- [ ] 1.1 Write the tests for `gdacs-source-001`, `gdacs-source-002` and `gdacs-source-003` in `src/data/gdacsProxy.test.mjs`.
- [ ] 1.2 Write the tests for `gdacs-source-004`, `gdacs-source-005`, `gdacs-source-006` and `gdacs-source-007` in the same file.
- [ ] 1.3 Write the tests for `gdacs-source-008`, `gdacs-source-009` and `gdacs-source-010` in the same file.
- [ ] 1.4 Write the tests for `gdacs-source-011`, `gdacs-source-012` and `gdacs-source-013` in the same file.
- [ ] 1.5 Write the tests for `gdacs-source-014`, `gdacs-source-015` and `gdacs-source-016` in the same file.
- [ ] 1.6 Write the tests for `gdacs-source-017` and `gdacs-source-018` in the same file.
- [ ] 1.7 Write the tests for `gdacs-source-019`, `gdacs-source-020`, `gdacs-source-021` and `gdacs-source-022` in the same file.
- [ ] 1.8 Write the tests for `gdacs-source-023`, `gdacs-source-024` and `gdacs-source-025` in the same file.

## 2. Write the code and the documents

- [ ] 2.1 Write the provider in `server/providers/gdacs.js`.
- [ ] 2.2 Register the provider in `server/providers/local.js`.
- [ ] 2.3 Add the two new files to `openspec/ownership.json`.
- [ ] 2.4 Add the two new files to `scripts/format-scope.json`.
- [ ] 2.5 Write the section in `DATA_SOURCES.md`.
- [ ] 2.6 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [ ] 3.1 Run the test file `src/data/gdacsProxy.test.mjs` on the host.
- [ ] 3.2 Run the test files that list the providers on the host.
- [ ] 3.3 Run the named faults of the provider, with one fault for each rule and each limit of the spec.
- [ ] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [ ] 3.5 Run the provider once against the real feed with a script outside the repository.
- [ ] 3.6 Write `evidence/live-run.txt` with the counts of that run and the counts of the raw feed.
- [ ] 3.7 Run the four checks of `make precheck` on the host.
- [ ] 3.8 Run the STE lint on the host.
- [ ] 3.9 Run `openspec validate gdacs-source --strict` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=gdacs-source`.
- [ ] 4.2 Read the verdict of the ratchet.
- [ ] 4.3 Ask the owner to accept the interpretation of the license in the Known limit `license-inferred`.
- [ ] 4.4 Run the two review agents.
- [ ] 4.5 Write review.md.
- [ ] 4.6 Run `make gates CHANGE=gdacs-source` on the final tree.
