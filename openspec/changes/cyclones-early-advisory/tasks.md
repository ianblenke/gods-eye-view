## 1. Write the tests

- [x] 1.1 Write the test for `cyclones-026` in `src/data/cyclonesEarlyAdvisory.test.mjs`.
- [x] 1.2 Write the test for `cyclones-027` in the same file.

## 2. Write the code and the documents

- [x] 2.1 Add the constant `EARLY_ADVISORY_MS` to `server/providers/cyclones.js`.
- [x] 2.2 Use the constant `EARLY_ADVISORY_MS` in `iso()` in place of `5 * 60_000`.
- [x] 2.3 Add the test file to `openspec/ownership.json` and `scripts/format-scope.json`.
- [x] 2.4 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run the test file `src/data/cyclonesEarlyAdvisory.test.mjs` on the host.
- [x] 3.2 Run the test file `src/data/cyclonesProxy.test.mjs` on the host.
- [x] 3.3 Run the named faults of the window.
- [x] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.5 Run the four checks of `make precheck` on the host.
- [x] 3.6 Run the STE lint on the host.
- [x] 3.7 Run `openspec validate cyclones-early-advisory` on the host.
- [x] 3.8 Write `evidence/live-feed.txt` with the times of the public feed and the result of both parsers.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=cyclones-early-advisory`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=cyclones-early-advisory` on the final tree.
