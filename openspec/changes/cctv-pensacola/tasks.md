## 1. Write the tests

- [ ] 1.1 Write the test for `live-sources-010` in `src/data/cctvPensacola.test.mjs`.
- [ ] 1.2 Write the test for `live-sources-011`.
- [ ] 1.3 Write the test for `live-sources-012`.
- [ ] 1.4 Write the test for `live-sources-013`.
- [ ] 1.5 Write the test for `live-sources-014`.
- [ ] 1.6 Write the test for `live-sources-015`.
- [ ] 1.7 Write the test for `live-sources-016`.
- [ ] 1.8 Write the test for `live-sources-017`.
- [ ] 1.9 Write the test for `live-sources-018`.
- [ ] 1.10 Write the test for `live-sources-019`.
- [ ] 1.11 Write the test for `live-sources-020`.
- [ ] 1.12 Write the test for `live-sources-021`.
- [ ] 1.13 Write the test for `live-sources-022`.
- [ ] 1.14 Write the test for `live-sources-023`.
- [ ] 1.15 Write the test for `live-sources-024`.
- [ ] 1.16 Write the test for `live-sources-025`.
- [ ] 1.17 Write the test for `live-sources-026`.

## 2. Write the code

- [ ] 2.1 Write the module `server/providers/cctv/pensacola.js`.
- [ ] 2.2 Add the pack `pensacola` to `server/providers/cctv/catalog.js`.
- [ ] 2.3 Add the module to the group `cctv-provider` in `scripts/package-boundaries.json`.
- [ ] 2.4 Add the module and its test file to `openspec/ownership.json`.
- [ ] 2.5 Add the test file to `scripts/format-scope.json`.

## 3. Write the documents

- [ ] 3.1 Add the three settings to `.env.example`.
- [ ] 3.2 Write the notice of the FL511 use limit in `DATA_SOURCES.md`.
- [ ] 3.3 Add the Pensacola pack to the CCTV row of `README.md`.
- [ ] 3.4 Add the Pensacola pack to the CCTV row of `docs/CURRENT-STATE.md`.
- [ ] 3.5 Write the entry for the pack in `CHANGELOG.md`.

## 4. Check on the host

- [ ] 4.1 Run the test file `src/data/cctvPensacola.test.mjs` on the host.
- [ ] 4.2 Run the named fault of each test and write `evidence/mutations.txt`.
- [ ] 4.3 Run the four checks of `make precheck` on the host.
- [ ] 4.4 Run the STE lint on the host.
- [ ] 4.5 Run `openspec validate cctv-pensacola` on the host.
- [ ] 4.6 Run each test file of `src/data` and `src/tooling/spec` on the host.

## 5. Lead work before and in the image

- [ ] 5.1 Check one real layer answer and one real frame, and write `evidence/live-check.txt`.
- [ ] 5.2 Run `make ratchet CHANGE=cctv-pensacola`.
- [ ] 5.3 Run the two review agents.
- [ ] 5.4 Write review.md.
- [ ] 5.5 Run `make gates CHANGE=cctv-pensacola` on the final tree.
