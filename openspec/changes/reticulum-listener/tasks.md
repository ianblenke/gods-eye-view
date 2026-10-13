## 1. Write the tests

- [ ] 1.1 Write the tests for `reticulum-listener-001` and `reticulum-listener-002` in `src/data/reticulumListener.test.mjs`.
- [ ] 1.2 Write the tests for `reticulum-listener-003`, `reticulum-listener-004` and `reticulum-listener-005` in the same file.
- [ ] 1.3 Write the tests for `reticulum-listener-006`, `reticulum-listener-007` and `reticulum-listener-008` in the same file.
- [ ] 1.4 Write the tests for `reticulum-listener-009`, `reticulum-listener-010` and `reticulum-listener-011` in the same file.
- [ ] 1.5 Write the tests for `reticulum-listener-012`, `reticulum-listener-013` and `reticulum-listener-014` in the same file.

## 2. Write the files

- [ ] 2.1 Write the Dockerfile, the program and the default config in `docker/reticulum/`.
- [ ] 2.2 Write the compose file `compose.reticulum.yaml`.
- [ ] 2.3 Add the two targets to the Makefile.
- [ ] 2.4 Write the document `docs/fork/reticulum-docker.md`.
- [ ] 2.5 Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`.
- [ ] 2.6 Change the note in `.env.example`, the section in `DATA_SOURCES.md` and the entry in `CHANGELOG.md`.

## 3. Check on the host

- [ ] 3.1 Run the test file `src/data/reticulumListener.test.mjs` on the host.
- [ ] 3.2 Run the test files that read the compose files, the Makefile and the manifests on the host.
- [ ] 3.3 Run the named faults of the files and write `evidence/mutations.txt`.
- [ ] 3.4 Run both `docker compose config` commands and write the output to `evidence/compose-config.txt`.
- [ ] 3.5 Build the image, start the listener, and write the output of the real run to `evidence/real-run.txt`.
- [ ] 3.6 Stop the listener and delete its test containers, networks and volume.
- [ ] 3.7 Run the four checks of `make precheck` on the host.
- [ ] 3.8 Run the STE lint on the host.
- [ ] 3.9 Run `openspec validate reticulum-listener` on the host.

## 4. Lead work in the image

- [ ] 4.1 Run `make ratchet CHANGE=reticulum-listener`.
- [ ] 4.2 Run the two review agents.
- [ ] 4.3 Write review.md.
- [ ] 4.4 Run `make gates CHANGE=reticulum-listener` on the final tree.
