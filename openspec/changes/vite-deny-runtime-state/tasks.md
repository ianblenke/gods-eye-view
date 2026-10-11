## 1. Write the tests

- [ ] 1.1 Write the test for `dev-server-files-001` in `src/tooling/devServerFiles.test.mjs`.
- [ ] 1.2 Write the test for `dev-server-files-002` in the same file.

## 2. Write the code and the documents

- [ ] 2.1 Add the two entries to `server.fs.deny` in `build/vite.js`.
- [ ] 2.2 Add the test file to `openspec/ownership.json` and `scripts/format-scope.json`.
- [ ] 2.3 Write one sentence about the folders in `SECURITY.md`.
- [ ] 2.4 Write one entry in `CHANGELOG.md`.

## 3. Check on the host

- [ ] 3.1 Run the test file `src/tooling/devServerFiles.test.mjs` on the host.
- [ ] 3.2 Run the named faults of the deny list and write `evidence/mutations.txt`.
- [ ] 3.3 Run the four checks of `make precheck` on the host.
- [ ] 3.4 Run the STE lint on the host.
- [ ] 3.5 Run `openspec validate vite-deny-runtime-state` on the host.
- [ ] 3.6 Write `evidence/probe.md` with the requests to a scratch server that uses the new config.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=vite-deny-runtime-state`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=vite-deny-runtime-state` on the final tree.
