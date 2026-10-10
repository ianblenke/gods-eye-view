## 1. Write the tests

- [x] 1.1 Write the test for `app-container-001` in `src/tooling/appContainer.test.mjs`.
- [x] 1.2 Write the test for `app-container-002`.
- [x] 1.3 Write the test for `app-container-003`.
- [x] 1.4 Write the test for `app-container-004`.

## 2. Write the files

- [x] 2.1 Write the file `compose.codex.yaml`.
- [x] 2.2 Add the target `up-codex` to the Makefile.
- [x] 2.3 Write the document `docs/fork/codex-voice-docker.md`.
- [x] 2.4 Add the compose file and the test file to `openspec/ownership.json`.
- [x] 2.5 Add the test file to `scripts/format-scope.json`.

## 3. Check on the host

- [x] 3.1 Run the test file `src/tooling/appContainer.test.mjs` on the host.
- [x] 3.2 Name one fault of the files for each scenario.
- [x] 3.3 Run the named fault of each scenario.
- [x] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 3.5 Write `evidence/compose-config.txt` with the output of `docker compose config` for both files.
- [x] 3.6 Run the four checks of `make precheck` on the host.
- [x] 3.7 Run the STE lint on the host.
- [x] 3.8 Run `openspec validate codex-voice-container` on the host.

## 4. Lead work before and in Docker

- [x] 4.1 Start one container with the host network.
- [x] 4.2 Start one container with a bridge network.
- [x] 4.3 Start one container with the host network and the ports kept.
- [x] 4.4 Start one container with a Codex folder that does not exist.
- [x] 4.5 Write `evidence/e2e.txt` with the output of the four containers.
- [ ] 4.6 Run `make ratchet CHANGE=codex-voice-container`.
- [ ] 4.7 Run the two review agents.
- [ ] 4.8 Write review.md.
- [ ] 4.9 Run `make gates CHANGE=codex-voice-container` on the final tree.
