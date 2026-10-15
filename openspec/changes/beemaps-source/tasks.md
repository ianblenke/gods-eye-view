## 1. Write the tests

- [ ] 1.1 Write the tests for `beemaps-source-001`, `beemaps-source-002`, `beemaps-source-003` and `beemaps-source-004` in `src/data/beemapsProxy.test.mjs`.
- [ ] 1.2 Write the tests for `beemaps-source-005`, `beemaps-source-012` and `beemaps-source-013` in the same file.
- [ ] 1.3 Write the tests for `beemaps-source-016`, `beemaps-source-017`, `beemaps-source-018`, `beemaps-source-019` and `beemaps-source-020` in the same file.
- [ ] 1.4 Write the tests for `beemaps-source-021`, `beemaps-source-022`, `beemaps-source-023`, `beemaps-source-024` and `beemaps-source-028` in the same file.
- [ ] 1.5 Write the tests for `beemaps-source-005`, `beemaps-source-006`, `beemaps-source-007`, `beemaps-source-008`, `beemaps-source-009`, `beemaps-source-010` and `beemaps-source-011` in `src/data/beemapsInput.test.mjs`.
- [ ] 1.6 Write the tests for `beemaps-source-014`, `beemaps-source-015` and `beemaps-source-023` in `src/data/beemapsUpstream.test.mjs`.
- [ ] 1.7 Write the tests for `beemaps-source-016`, `beemaps-source-017` and `beemaps-source-018` in `src/data/beemapsBudget.test.mjs`.
- [ ] 1.8 Write the tests for `beemaps-source-025`, `beemaps-source-026`, `beemaps-source-027` and `beemaps-source-028` in `src/data/beemapsFrames.test.mjs`.

## 2. Write the files

- [ ] 2.1 Write `server/providers/beemaps/validate.js`.
- [ ] 2.2 Write `server/providers/beemaps/normalize.js`.
- [ ] 2.3 Write `server/providers/beemaps/budget.js`.
- [ ] 2.4 Write `server/providers/beemaps/upstream.js`.
- [ ] 2.5 Write `server/providers/beemaps.js`.
- [ ] 2.6 Add the plugin to `server/providers/local.js`.
- [ ] 2.7 Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [ ] 2.8 Write the entry in `CHANGELOG.md`, the paragraph in `DATA_SOURCES.md` and the block in `.env.example`.

## 3. Check on the host

- [ ] 3.1 Run the tests of the provider on the host.
- [ ] 3.2 Write `evidence/api-description.txt` with the address, the date, the version and the SHA-256 of the public API description.
- [ ] 3.3 Run the named faults of the provider.
- [ ] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [ ] 3.5 Run the provider against a local fake upstream.
- [ ] 3.6 Write `evidence/local-run.txt` with the output of that run.
- [ ] 3.7 Run the four checks of `make precheck` on the host.
- [ ] 3.8 Read the exit status of each check.
- [ ] 3.9 Run the STE lint on the host.
- [ ] 3.10 Run `openspec validate beemaps-source` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=beemaps-source`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=beemaps-source` on the final tree.
