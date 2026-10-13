## Why

Change 1 added the route `/api/reticulum`. It reads a listener that you run, and without a listener it says `unavailable`. This change adds that listener as a separate container.

The owner chose to run our own listener. The listener runs the Reticulum software, hears the announces of the interfaces that operators make discoverable, and serves the list over HTTP. A test node on this machine heard 415 interfaces in about 5 hours. It heard 420 after 30 more minutes (see `evidence/size.txt`).

The Reticulum licence forbids use in a system that can purposefully harm people. It also forbids use of the software in the creation of a training dataset for AI. So this repository does not hold Reticulum code. The Dockerfile installs the packages `rns` and `lxmf` with pip. Interface discovery needs the module `lxmf`.

This is change 2 of 3. Change 3 adds the globe layer.

## What Changes

- Add the folder `docker/reticulum/` with a Dockerfile, the program `listener.py` and a default config.
- Add the compose file `compose.reticulum.yaml` and the Makefile targets `up-reticulum`, `up-codex-reticulum` and `down-reticulum`.
- Add the capability `reticulum-listener` with fourteen scenarios, `reticulum-listener-001` to `reticulum-listener-014`.
- Add the test file `src/data/reticulumListener.test.mjs` and the document `docs/fork/reticulum-docker.md`.
- Add the new files to `openspec/ownership.json` and `scripts/format-scope.json`. Write one entry in `CHANGELOG.md`, and change the note in `.env.example` and the section in `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `reticulum-listener`: Seven requirements. They cover the image, the program, the config, the service, the networks, the Makefile targets and the document.

### Modified Capabilities

None.

## Impact

The files `compose.yaml` and `compose.codex.yaml` do not change. The test of `app-container` pins them.

The Makefile gets three new targets, and the targets `up` and `up-codex` stay as they are. The new files are files that the fork writes, so they go into `openspec/ownership.json`.

The gates image has no Python. So the program `listener.py` has text tests and one real run, and no unit test. The extension `.py` is not in the coverage inventory.

## Known limits and later changes

- Known limit `egress`: The node connects out to public volunteer Reticulum nodes. Their operators can see your IP address.
- Known limit `hosts`: The default config names bootstrap hosts from a public community directory of 2026-10-13. A host can go away, and you can change the list in the volume.
- Known limit `convergence`: A new listener has a partial list for its first hours. Operators announce every 6 hours by default.
- Known limit `python`: No test runs the program `listener.py`. The text tests pin its structure, and the real run in `evidence/` shows that it works on one machine.
- Known limit `image`: The base image has a tag and no digest. The Dockerfile names exact versions of `rns` and `lxmf`. See the limit `dependencies`.
- Known limit `platform`: The author checked the compose files on Linux with Docker Compose 5.5.1. The host network mode has other rules on Docker Desktop.
- Known limit `second-container`: The listener is a second long-running container next to the app container. The rule 12 of `AGENTS.md` says: run one container at a time.
- Known limit `dependencies`: The Dockerfile names exact versions of `rns` and `lxmf`. Their own dependencies, such as `cryptography`, can change.
- Known limit `no-login`: The route of the listener has no login. A program on the host can reach it at the fixed address, and a container on the default network can reach it by the alias. It serves only the 12 public fields.
- Known limit `scripts-as-text`: The files in `evidence/` that hold scripts hold them as text. No gate measures them.
- Known limit `app-container-pin`: The requirement says that the targets `up` and `up-codex` stay as they are. No scenario of this capability checks it. The tests `app-container-003` and `app-container-004` pin them.
- Known limit `unpinned-details`: Test 009 pins the line `os.makedirs(CONFIG_DIR, exist_ok=True)`, and scenario 009 does not name it. No scenario and no test names the header `Content-Type` or the status 200 of the answer of the listener.
- Known limit `health`: The health check of the Dockerfile shows only that the HTTP server answers. It does not show that the node hears announces, for example when all the public nodes are gone.
- Known limit `clients`: The server `ThreadingHTTPServer` has no limit for clients. Only `pids_limit` 256 in the compose file bounds the threads, and a client on the default network can use them all.
