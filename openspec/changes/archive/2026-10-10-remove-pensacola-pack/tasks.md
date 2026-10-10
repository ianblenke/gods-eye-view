## 1. Remove the pack

- [x] 1.1 Delete the module `server/providers/cctv/pensacola.js`.
- [x] 1.2 Delete the test file `src/data/cctvPensacola.test.mjs`.
- [x] 1.3 Remove the import and the pack entry from `server/providers/cctv/catalog.js`.
- [x] 1.4 Remove the module from `scripts/package-boundaries.json`.
- [x] 1.5 Remove the test file from `scripts/format-scope.json`.
- [x] 1.6 Remove the module and the test file from `openspec/ownership.json`.

## 2. Remove the settings and the documents

- [x] 2.1 Remove the three settings from `.env.example`.
- [x] 2.2 Remove the row and the bullet from `DATA_SOURCES.md`.
- [x] 2.3 Remove the pack name from the CCTV row of `README.md`.
- [x] 2.4 Remove the pack name from the CCTV row of `docs/CURRENT-STATE.md`.
- [x] 2.5 Write the entry for the removal in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Search the repository for the word Pensacola, the three settings, and the pack and layer names and ids.
- [x] 3.2 Run each CCTV test file on the host.
- [x] 3.3 Run the four checks of `make precheck` on the host.
- [x] 3.4 Run the STE lint on the host.
- [x] 3.5 Run `openspec validate remove-pensacola-pack` on the host.

## 4. Lead work before and in Docker

- [x] 4.1 Run `make ratchet CHANGE=remove-pensacola-pack`.
- [x] 4.2 Add the IDs `live-sources-010` to `live-sources-030` to `openspec/trace/retired-ids.json`.
- [x] 4.3 Remove the 21 empty links of these IDs from `openspec/trace/links.json`.
- [ ] 4.4 Run the two review agents.
- [ ] 4.5 Write review.md.
- [ ] 4.6 Run `make gates CHANGE=remove-pensacola-pack` on the final tree.
