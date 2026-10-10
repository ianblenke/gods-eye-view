## 1. Write the tests

- [ ] 1.1 Write the test for `app-container-001` in `src/tooling/appContainer.test.mjs`.
- [ ] 1.2 Write the test for `app-container-002`.
- [ ] 1.3 Write the test for `app-container-003`.
- [ ] 1.4 Write the test for `app-container-004`.

## 2. Write the files

- [ ] 2.1 Write the file `compose.codex.yaml`.
- [ ] 2.2 Add the target `up-codex` to the Makefile.
- [ ] 2.3 Write the document `docs/fork/codex-voice-docker.md`.
- [ ] 2.4 Add the compose file and the test file to `openspec/ownership.json`.
- [ ] 2.5 Add the test file to `scripts/format-scope.json`.

## 3. Check on the host

- [ ] 3.1 Run the test file `src/tooling/appContainer.test.mjs` on the host.
- [ ] 3.2 Name one fault of the files for each scenario.
- [ ] 3.3 Run the named fault of each scenario.
- [ ] 3.4 Write `evidence/mutations.txt` with the result of each fault.
- [ ] 3.5 Write `evidence/compose-config.txt` with the output of `docker compose config` for both files.
- [ ] 3.6 Run the four checks of `make precheck` on the host.
- [ ] 3.7 Run the STE lint on the host.
- [ ] 3.8 Run `openspec validate codex-voice-container` on the host.

## 4. Lead work before and in Docker

- [ ] 4.1 Start one container with the host network and one with a bridge, and write `evidence/e2e.txt`.
- [ ] 4.2 Run `make ratchet CHANGE=codex-voice-container`.
- [ ] 4.3 Run the two review agents.
- [ ] 4.4 Write review.md.
- [ ] 4.5 Run `make gates CHANGE=codex-voice-container` on the final tree.
