## Why

The owner wants the Codex OAuth voice feature (the ChatGPT sign-in) in the Docker app. The server answers its three OAuth routes only for connections from the same machine, and it reads the Codex file `auth.json` on that machine.
The Docker app has a bridge network and no Codex folder. So the routes refuse the browser, and the server finds no `auth.json`.

## What Changes

- Add the file `compose.codex.yaml`. It gives the app container the host network, the port from `GEV_PORT` and a read-only mount of `${HOME}/.codex`.
- Add the Makefile target `up-codex`. It builds and starts the app with both compose files.
- Add the document `docs/fork/codex-voice-docker.md` with the steps to use the feature.
- Add the test file `src/tooling/appContainer.test.mjs`. Add the test file and the new compose file to `openspec/ownership.json`, and the test file to `scripts/format-scope.json`.

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

- Known limit `sign-in`: The image has no Codex program. The sign-in button of the app starts `codex login` and shows an error. The user signs in on the host with `codex login`.
- Known limit `host-program`: The server also looks for a Codex program in `~/.codex/packages`. When the host has a standalone Codex program there, the mount brings it into the container, and the button can start it.
- Known limit `expiry`: The server never refreshes the token. When the token expires, the user runs `codex login` on the host again.
- Known limit `host-network`: The container shares the network of the host. It can reach services on the loopback address of the host, and a port conflict can stop it.
- Known limit `tokens`: Any code in the container can read the file `auth.json`, as on the host. The file holds a refresh token.
- Known limit `linux`: The lead checked the host network on Linux only. The target `up-codex` is optional.
- Known limit `user`: The container user `node` has the number 1000. It can read `auth.json` when the file belongs to the host user with the number 1000. For another number, the file mode decides, and the lead did not check it. The lead did not check rootless Docker.
- Known limit `folder`: The mount shows the whole folder `~/.codex` to the container, with the settings and the history of Codex. The override mounts the folder because a mount of one file can keep the old file when a program replaces it.
- Known limit `missing-folder`: When `~/.codex` does not exist, Docker creates it as an empty folder that belongs to root. The document tells the user to run `codex login` before the user starts the app for the first time.
- Known limit `all-interfaces`: The setting `HOST` stays "0.0.0.0", so the app listens on all addresses of the host. A browser on another computer can open the app, but the OAuth routes refuse it.
- Known limit `local-programs`: With the host network, any program on the host passes the check for the same machine. A tunnel or a reverse proxy on the host, such as `ssh -L`, also passes it. `SECURITY.md` describes this limit.
- Known limit `provider-settings`: With the host network, the Provider Settings panel can save keys, because its connection looks local. The server writes them to `.env` in the container, and a new container has no such file. The target `make up-codex` creates a new container. The comment in `compose.yaml` about this panel is true for `make up` only.
- Known limit `compose`: The override uses `!reset`, so it needs a new version of Docker Compose. The lead ran `docker compose config` with Compose 5.5.1 and does not know the lowest version that reads `!reset`.
- Known limit `e2e`: The tests read the files. The lead checks the real behavior with test containers and stores the output in `evidence/e2e.txt`. The files `e2e-script.txt`, `e2e-save-script.txt` and `mutations-script.txt` hold scripts as text, and no gate measures them.
- Known limit `not-run`: The lead did not run `make up-codex`, because it replaces the app container of the owner. The checks of tasks 4.1 and 4.5 used `docker run` with the network, the mount and the setting PORT of the override. They used an image built from the same Dockerfile, and the ports 4199 and 4196.
