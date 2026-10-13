## Context

Base commit: `34eeb7e9` (main, after the merge of `reticulum-provider`).

The route `/api/reticulum` reads `/interfaces.json` from the address in `RETICULUM_LISTENER`. The shared rule in `src/data/tapAddress.js` allows an IPv4 loopback or private host, `localhost` or a `.local` name. The provider refuses a response of more than 4 MiB.

The app container runs in one of two modes. In the default mode it is on a bridge network (`make up`). With `compose.codex.yaml` it uses the network of the host (`make up-codex`), and this is the mode that the owner runs.

## Decisions

### D1: One process

The program `listener.py` creates `RNS.Reticulum(configdir=CONFIG_DIR)` and then serves HTTP from the same process. The config sets `discover_interfaces = yes`, so Reticulum stores each discovered interface in a file.

The lock of the discovery code is a class attribute (`discovery_lock` in `RNS/Discovery.py`). A read of the list and a write of an announce in one process cannot run at the same time. A second process, such as `rnstatus`, does not share that lock.

The public function `RNS.Reticulum.discovered_interfaces()` reads the list. It also deletes the files of entries that are older than 7 days, which is what Reticulum does itself.

### D2: Twelve fields

The program sends the twelve fields that the provider reads: `discovery_hash`, `type`, `name`, `last_heard`, `hops`, `latitude`, `longitude`, `height`, `frequency`, `bandwidth`, `sf` and `cr`. It drops every other field of the record.

The route of the listener has no login. The dropped fields hold interface keys, host addresses and contact addresses, so they must not leave the container.

The size is a second reason. A test node held 415 interfaces (see `evidence/size.txt`). The raw JSON had 371,878 bytes (896 bytes for each record), and the twelve fields had 129,990 bytes (313 bytes for each record). The raw list would reach the 4 MiB cap of the provider at about 4,700 records.

The provider stays the tested filter. The list in the program is a second layer, and a text test pins it.

### D3: Two networks

The file `compose.reticulum.yaml` puts the service `reticulum` on two networks. On the default network it has the alias "reticulum.local". The app in the default mode reaches it by that name, and the name passes the shared rule.

On the network `reticulum` it has the fixed address 10.213.77.10 in the subnet 10.213.77.0/24. The app with the host network reaches that address, because the host routes to a bridge network.

The file does not set `networks` or `network_mode` for the app service. Both `docker compose config` commands (base with the listener, and base with the Codex file and the listener) print a valid file.

The subnet is free on this machine. The Docker networks use 172.17.0.0/16, 172.18.0.0/16, 172.19.0.0/16 and 172.22.0.0/16, and the LAN is 192.168.51.0/24. The variables `GEV_RETICULUM_SUBNET` and `GEV_RETICULUM_ADDRESS` change the values.

The service publishes no port. The app value of `RETICULUM_LISTENER` comes from the variable `GEV_RETICULUM_LISTENER`. The target `up-codex-reticulum` sets it to the fixed address. The target `down-reticulum` stops both containers, because `make down` does not know the service `reticulum`.

### D4: Config and volume

The image holds a default config at `/opt/reticulum/config`. On the first start the program copies it to `/data/rns/config` in the volume `gev-reticulum`, and it never overwrites that file. The volume also keeps the node identity and the discovery files, so a restart keeps the list.

The default config makes a node that only listens. It has no transport, no shared instance and no `discoverable` line. It has client interfaces to public nodes that a community directory listed on 2026-10-13. The owner can change them in the volume.

### D5: Tests and evidence

The gates image has no Python. So the tests are text tests in `src/data/reticulumListener.test.mjs`. They read the Dockerfile, the program, the config, the compose file, the Makefile and the document. The test of scenario 012 calls the real function `parseTapAddress`.

The named faults change the text of these files, and the test file must fail for each fault.

The real run is in `evidence/`. It builds the image and starts the listener. It waits, and then it asks the listener for `/interfaces.json` from the host.

It also runs the provider of change 1 against the listener. One run starts on the host and one run starts in a container on the default network.

### D6: Containers

The rule 12 of `AGENTS.md` says: run one container at a time. The listener is a second long-running container next to the app container. The lead starts it only for the real run, never during a gates run, and stops it before the ratchet.

## Files and measures

The change adds the files named in the proposal. It edits `Makefile`, `openspec/ownership.json`, `scripts/format-scope.json`, `.env.example`, `DATA_SOURCES.md` and `CHANGELOG.md`.

The trace gate checks that the tests carry the IDs `reticulum-listener-001` to `reticulum-listener-014`. The test file is not in the coverage inventory, and no code file is new. The prose lint checks STE.

The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Run a Reticulum listener in a separate container. Send only twelve public fields of each discovered interface, and publish no port."
