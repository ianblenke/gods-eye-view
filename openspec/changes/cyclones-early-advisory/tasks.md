## 1. Write the tests

- [x] 1.1 Write the test for `cyclones-026` in `src/data/cyclonesEarlyAdvisory.test.mjs`.
- [x] 1.2 Write the test for `cyclones-027` in the same file.

## 2. Write the code and the documents

- [x] 2.1 Add the constant `EARLY_ADVISORY_MS` to `server/providers/cyclones.js` and use it in `iso()`.
- [x] 2.2 Add the test file to `openspec/ownership.json` and `scripts/format-scope.json`.
- [x] 2.3 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run the test file `src/data/cyclonesEarlyAdvisory.test.mjs` on the host.
- [x] 3.2 Run the test file `src/data/cyclonesProxy.test.mjs` on the host.
- [x] 3.3 Run the named faults of the window and write `evidence/mutations.txt`.
- [x] 3.4 Run the four checks of `make precheck` on the host.
- [x] 3.5 Run the STE lint on the host.
- [x] 3.6 Run `openspec validate cyclones-early-advisory` on the host.
- [x] 3.7 Write `evidence/live-feed.txt` with the times of the public feed and the result of both parsers.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=cyclones-early-advisory`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=cyclones-early-advisory` on the final tree.
