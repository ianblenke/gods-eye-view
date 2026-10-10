## Why

The owner wants the Codex OAuth voice feature (the ChatGPT sign-in) in the Docker app. The server answers its three OAuth routes only for connections from the same machine, and it reads the Codex file `auth.json` on that machine.
The Docker app has a bridge network and no Codex folder, so the routes would refuse the browser.

## What Changes

- Add the file `compose.codex.yaml`. It gives the app container the host network, the port from `GEV_PORT` and a read-only mount of `${HOME}/.codex`.
- Add the Makefile target `up-codex`. It builds and starts the app with both compose files.
- Add the document `docs/fork/codex-voice-docker.md` with the steps to use the feature.
- Add the test file `src/tooling/appContainer.test.mjs`. Add it and the new compose file to `openspec/ownership.json`, and the test file to `scripts/format-scope.json`.

## Capabilities

### New Capabilities

- `app-container`: The requirement "Codex sign-in in the app container" with the scenarios `app-container-001` to `app-container-004`.

### Modified Capabilities

None.

## Impact

Rule 23: the compose file, the document and the test file are files that the fork writes. The compose file and the test file go into `openspec/ownership.json`. The folder `docs/fork/` is already there.
The change edits the Makefile, an owned file, with one new target. It edits no code file, so no gap opens or closes.
The default setup stays as it is: the file `compose.yaml` and the target `up` do not change.

## Known limits and later changes

- Known limit `sign-in`: The container has no Codex program. The sign-in button of the app starts `codex login` and shows an error. The user signs in on the host with `codex login`.
- Known limit `expiry`: The server never refreshes the token. When the token expires, the user runs `codex login` on the host again.
- Known limit `host-network`: The container shares the network of the host. It can reach services on the loopback address of the host, and a port conflict can stop it.
- Known limit `tokens`: Any code in the container can read the file `auth.json`, as on the host. The file holds a refresh token.
- Known limit `linux`: Host networking works on Linux only. The target `up-codex` is optional.
- Known limit `e2e`: The tests read the files. The lead checks the real behavior with two containers and stores the output in `evidence/e2e.txt`.
