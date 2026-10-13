# Reticulum listener in Docker

The listener is a separate container. It runs a Reticulum node that only listens. The node hears the announces of the interfaces that operators make discoverable, and it serves the list over HTTP.
The route `/api/reticulum` of the app reads that list and keeps only the public fields. The globe layer comes in a later change.

## Start

1. Start the app and the listener with `make up-reticulum`. When you start the app with `make up-codex`, use `make up-codex-reticulum` instead.
2. The first start builds the image. The build installs the package `rns` 1.5.7 from PyPI.
3. Wait. Operators announce every 6 hours by default, so the list grows for many hours. A test node heard 415 interfaces in 5 hours.
4. Look at the answer with `curl http://localhost:4173/api/reticulum`. Use your port when you set `GEV_PORT`.

## Stop

Stop both containers with `make down-reticulum`. The command keeps the volume `gev-reticulum`, so the next start keeps the list.
The volume has the name of the project as a prefix, for example `gods-eye-view_gev-reticulum`. List it with `docker volume ls`. Delete it with `docker volume rm` when you want to start with an empty list.

## What the listener does

- The node listens and publishes nothing. It does not forward traffic for other nodes, and it has no server interface.
- The node connects out to three public nodes of the community. The operators of the public nodes see your IP address.
- The listener sends only 12 fields of each interface, and it publishes no port. The raw record also holds interface keys, host addresses and contact addresses. Those stay in the container.
- The app reaches the listener by the name `reticulum.local` on the default network. With the host network, the app reaches the fixed address 10.213.77.10.

## Change the public nodes

The listener copies a default config to `/data/rns/config` in the volume `gev-reticulum` on the first start. It never overwrites that file.
Edit the copy to use other nodes, for example with `docker run --rm -it -v gods-eye-view_gev-reticulum:/data alpine vi /data/rns/config`. Then run `docker compose -f compose.yaml -f compose.reticulum.yaml restart reticulum`.

## Variables

- `GEV_RETICULUM_ADDRESS` is the fixed address of the listener. The default is 10.213.77.10.
- `GEV_RETICULUM_SUBNET` is the subnet of the network `reticulum`. The default is 10.213.77.0/24. Choose another subnet when your network uses this one.
- `GEV_RETICULUM_LISTENER` is the value of `RETICULUM_LISTENER` in the app. The default is `reticulum.local:8081`. With `make up-codex-reticulum`, the default is 10.213.77.10:8081. Set it to your address and port 8081 when you change the address.

## Limits

- The list is partial for the first hours. The public nodes can go away, and then the listener hears less.
- No test runs the program of the listener. The tests read its text. The author ran it once on one machine.
- The author checked the files on Linux with Docker Compose 5.5.1. The host network has other rules on Docker Desktop.
- The image is built on your machine from a Python image tag and a fixed version of `rns`. The repository holds no Reticulum code, because the licence of Reticulum limits some uses.
