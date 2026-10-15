## 1. Write the tests

- [ ] 1.1 Write the tests for `beemaps-burst-control-002`, `beemaps-burst-control-003`, `beemaps-burst-control-004`, `beemaps-burst-control-008`, `beemaps-burst-control-009`, `beemaps-burst-control-010`, `beemaps-burst-control-011`, `beemaps-burst-control-015` and `beemaps-burst-control-033` in `src/data/beemapsBurstValidate.test.mjs`.
- [ ] 1.2 Write the tests for `beemaps-burst-control-013` in `src/data/beemapsBurstQuotes.test.mjs`.
- [ ] 1.3 Write the tests for `beemaps-burst-control-021`, `beemaps-burst-control-022` and `beemaps-burst-control-023` in `src/data/beemapsBurstCredits.test.mjs`.
- [ ] 1.4 Write the tests for `beemaps-burst-control-028`, `beemaps-burst-control-039` and `beemaps-burst-control-040` in `src/data/beemapsBurstLedger.test.mjs`.
- [ ] 1.5 Write the tests for `beemaps-burst-control-030` and `beemaps-burst-control-031` in `src/data/beemapsBurstAudit.test.mjs`.
- [ ] 1.6 Write the tests for `beemaps-burst-control-016`, `beemaps-burst-control-017`, `beemaps-burst-control-018`, `beemaps-burst-control-019`, `beemaps-burst-control-034` and `beemaps-burst-control-035` in `src/data/beemapsBurstUpstream.test.mjs`.
- [ ] 1.7 Write the tests for `beemaps-burst-control-001`, `beemaps-burst-control-005`, `beemaps-burst-control-006`, `beemaps-burst-control-007`, `beemaps-burst-control-012`, `beemaps-burst-control-014`, `beemaps-burst-control-036` and `beemaps-burst-control-037` in `src/data/beemapsBurstProxy.test.mjs`.
- [ ] 1.8 Write the tests for `beemaps-burst-control-020`, `beemaps-burst-control-024`, `beemaps-burst-control-025`, `beemaps-burst-control-026`, `beemaps-burst-control-027`, `beemaps-burst-control-029` and `beemaps-burst-control-032` in the same file.
- [ ] 1.9 Write the test for `beemaps-burst-control-038` in `src/data/beemapsBurstScan.test.mjs`.

## 2. Write the files

- [ ] 2.1 Write `server/providers/beemaps-burst/validate.js`.
- [ ] 2.2 Write `server/providers/beemaps-burst/quotes.js`.
- [ ] 2.3 Write `server/providers/beemaps-burst/credits.js`.
- [ ] 2.4 Write `server/providers/beemaps-burst/ledger.js`.
- [ ] 2.5 Write `server/providers/beemaps-burst/audit.js`.
- [ ] 2.6 Write `server/providers/beemaps-burst/upstream.js`.
- [ ] 2.7 Write `server/providers/beemaps-burst.js`.
- [ ] 2.8 Add the plugin to the list in `server/providers/local.js`.
- [ ] 2.9 Add the package and the files to `scripts/package-boundaries.json`.
- [ ] 2.10 Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [ ] 2.11 Add the four variables to `.env.example`.
- [ ] 2.12 Write the entry in `CHANGELOG.md` and the paragraph in `DATA_SOURCES.md`.

## 3. Check on the host and in the image

- [ ] 3.1 Run the tests of the new files on the host.
- [ ] 3.2 Run the tests of the new files in the image.
- [ ] 3.3 Run the named faults of the plugin.
- [ ] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [ ] 3.5 Run the plugin in a real Vite server with a fake upstream.
- [ ] 3.6 Write `evidence/local-run.txt` with the output of that run.
- [ ] 3.7 Run the four checks of `make precheck` on the host.
- [ ] 3.8 Read the exit status of each check.
- [ ] 3.9 Run the STE lint on the host.
- [ ] 3.10 Run `openspec validate beemaps-burst-control` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=beemaps-burst-control`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=beemaps-burst-control` on the final tree.
