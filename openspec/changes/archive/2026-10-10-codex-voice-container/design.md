## Source

Base commit: `3d3c1f5e` (main, after the merge of `traffic-timing-child`).
The Codex OAuth voice feature came with sync 4. The routes `/api/realtime/oauth-status`, `/api/realtime/oauth-login` and `/api/realtime/token?auth=oauth` answer only when the peer address of the connection is `127.0.0.1`, `::1` or `::ffff:127.0.0.1`.
The server reads `auth.json` from `CODEX_AUTH_JSON`, from `CODEX_HOME` or from `.codex` in the home folder of the server process.

## Key decisions

### D1: A second compose file and an optional target

The file `compose.codex.yaml` is an override of `compose.yaml`. The target `up-codex` uses both files. The default setup and the target `up` stay as they are.
An owner who wants the feature always on can use `up-codex` instead of `up`.

### D2: The host network

A connection from the browser to a published port of a bridge network reaches the server from the address of the bridge. The server then refuses the routes.

With `network_mode: host` the container uses the network of the host. A connection from the browser to `localhost` has the address `127.0.0.1`, and the routes answer it. A connection to the LAN address of the host keeps that address, and the routes refuse it.

The override resets the list `ports`, because Docker discards published ports with the host network and prints a warning.
The server gets its port from the setting PORT, so the override sets PORT to `${GEV_PORT:-4173}`.

### D3: No Codex program in the image

The sign-in button starts `codex login` with no terminal, and Codex opens the browser itself. This cannot work in this image, which has no Codex program. So the user signs in on the host, and the image stays as it is.

The container needs only the file `auth.json`. The override mounts the folder `${HOME}/.codex` as `/home/node/.codex` with the flag `ro`, so the container cannot change a Codex file.
The override mounts the folder and not the file, because a mount of one file can keep the old file when a program replaces it. The folder also holds the settings and the history of Codex, which the server does not read.

### D4: The tests read the files

The tests read `compose.yaml`, `compose.codex.yaml` and the Makefile as text and compare lines with literal values. A real container check is part of the evidence and not of the tests.

## Files and measures

The change adds `compose.codex.yaml`, `docs/fork/codex-voice-docker.md` and `src/tooling/appContainer.test.mjs`. It edits the Makefile, `openspec/ownership.json` and `scripts/format-scope.json`.

The trace gate checks that the tests carry the IDs `app-container-001` to `app-container-004`. The format check measures the test file.
The prose lint checks STE. The named faults measure whether a change of a file makes a test fail.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead replaces the Purpose of the new capability app-container at archive time with this text:
"Keep the setup of the app container. The compose override for the Codex sign-in gives the container the host network and a read-only Codex folder."
