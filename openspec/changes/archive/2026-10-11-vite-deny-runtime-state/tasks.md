## 1. Write the tests

- [x] 1.1 Write the test for `dev-server-files-001` in `src/tooling/devServerFiles.test.mjs`.
- [x] 1.2 Write the test for `dev-server-files-002` in the same file.

## 2. Write the code and the documents

- [x] 2.1 Add the two entries to `server.fs.deny` in `build/vite.js`.
- [x] 2.2 Add the test file to `openspec/ownership.json` and `scripts/format-scope.json`.
- [x] 2.3 Write one sentence about the folders in `SECURITY.md`.
- [x] 2.4 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [x] 3.1 Run the test file `src/tooling/devServerFiles.test.mjs` on the host.
- [x] 3.2 Run the named faults of the deny list.
- [x] 3.3 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.4 Run the four checks of `make precheck` on the host.
- [x] 3.5 Run the STE lint on the host.
- [x] 3.6 Run `openspec validate vite-deny-runtime-state` on the host.
- [x] 3.7 Write `evidence/probe.md` with the requests to a scratch server that uses the new config.

## 4. Lead work in the image

- [x] 4.1 Run `make ratchet CHANGE=vite-deny-runtime-state`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=vite-deny-runtime-state` on the final tree.
