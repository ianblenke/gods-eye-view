## 1. Write the tests

- [x] 1.1 Write the test for `live-sources-010` in `src/data/cctvPensacola.test.mjs`.
- [x] 1.2 Write the test for `live-sources-011`.
- [x] 1.3 Write the test for `live-sources-012`.
- [x] 1.4 Write the test for `live-sources-013`.
- [x] 1.5 Write the test for `live-sources-014`.
- [x] 1.6 Write the test for `live-sources-015`.
- [x] 1.7 Write the test for `live-sources-016`.
- [x] 1.8 Write the test for `live-sources-017`.
- [x] 1.9 Write the test for `live-sources-018`.
- [x] 1.10 Write the test for `live-sources-019`.
- [x] 1.11 Write the test for `live-sources-020`.
- [x] 1.12 Write the test for `live-sources-021`.
- [x] 1.13 Write the test for `live-sources-022`.
- [x] 1.14 Write the test for `live-sources-023`.
- [x] 1.15 Write the test for `live-sources-024`.
- [x] 1.16 Write the test for `live-sources-025`.
- [x] 1.17 Write the test for `live-sources-026`.
- [x] 1.18 Write the test for `live-sources-027`.
- [x] 1.19 Write the test for `live-sources-028`.
- [x] 1.20 Write the test for `live-sources-029`.
- [x] 1.21 Write the test for `live-sources-030`.

## 2. Write the code

- [x] 2.1 Write the module `server/providers/cctv/pensacola.js`.
- [x] 2.2 Add the pack `pensacola` to `server/providers/cctv/catalog.js`.
- [x] 2.3 Add the module to the group `cctv-provider` in `scripts/package-boundaries.json`.
- [x] 2.4 Add the module and its test file to `openspec/ownership.json`.
- [x] 2.5 Add the test file to `scripts/format-scope.json`.

## 3. Write the documents

- [x] 3.1 Add the three settings to `.env.example`.
- [x] 3.2 Write the notice of the FL511 use limit in `DATA_SOURCES.md`.
- [x] 3.3 Add the Pensacola pack to the CCTV row of `README.md`.
- [x] 3.4 Add the Pensacola pack to the CCTV row of `docs/CURRENT-STATE.md`.
- [x] 3.5 Write the entry for the pack in `CHANGELOG.md`.

## 4. Check on the host

- [x] 4.1 Run the test file `src/data/cctvPensacola.test.mjs` on the host.
- [x] 4.2 Name one fault of the code for each scenario.
- [x] 4.3 Run the named fault of each scenario.
- [x] 4.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 4.5 Run the four checks of `make precheck` on the host.
- [x] 4.6 Run the STE lint on the host.
- [x] 4.7 Run `openspec validate cctv-pensacola` on the host.
- [x] 4.8 Run each test file of `src/data` and `src/tooling/spec` on the host.

## 5. Lead work before and in Docker

- [x] 5.1 Check one real layer answer.
- [x] 5.2 Check one real frame through the route `/api/cctv/frame/:id`.
- [x] 5.3 Write `evidence/live-check.txt` with the output of both checks.
- [ ] 5.4 Run `make ratchet CHANGE=cctv-pensacola`.
- [ ] 5.5 Run the two review agents.
- [ ] 5.6 Write review.md.
- [ ] 5.7 Run `make gates CHANGE=cctv-pensacola` on the final tree.
