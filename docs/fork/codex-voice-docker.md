# Voice with the ChatGPT sign-in in Docker

The Codex OAuth voice feature lets the voice assistant use your ChatGPT sign-in and not an API key. The server uses the sign-in file of Codex to get a short-lived voice token.

## Start

1. Sign in on the host: run `codex login`. The file `~/.codex/auth.json` must exist.
2. Start the app with `make up-codex` and not with `make up`.
3. Open the app at `http://localhost:4173`, or at your port when you set `GEV_PORT`.
4. Open Provider Settings. Choose USE CHATGPT OAUTH. The choice is per browser.

To go back, stop the app with `make down`. Then start it with `make up`.

## What the override changes

The file `compose.codex.yaml` changes three things for the container.

- The container uses the network of the host. The server answers the OAuth routes only for connections from the same machine, and a bridge network hides that fact.
- The port comes from `GEV_PORT`, with the default 4173.
- The folder `~/.codex` of the host is a read-only folder in the container. The container can read `auth.json` and cannot change a Codex file. The override mounts the folder and not the file, because a mount of one file can keep the old file when a program replaces it.

## Limits

- The image has no Codex program. When the sign-in of the host is missing or has expired, the button of the app starts `codex login` and shows an error. Sign in on the host with `codex login`.
- The server also looks for a Codex program in `~/.codex/packages`. When the host has one there, the mount brings it into the container, and the button can start it. The sign-in then writes to a read-only folder, so it cannot finish. The author did not run this.
- The server never refreshes the token. When the token expires, run `codex login` on the host again.
- The server still listens on all addresses of the host, as in `make up`. Other computers can reach the app on its port.
- The OAuth routes refuse a connection from another computer and a connection to the LAN address of the host. A tunnel or a reverse proxy on the host, such as `ssh -L`, makes a connection look local.
- The container shares the network of the host. It can reach services on the loopback address of the host. When the port is in use, Vite starts on the next free port, and the address in this document is not the address of the app. The author read this in the Vite code and did not run it.
- Any code in the container can read `auth.json`, as on the host. The file holds an access token and a refresh token.
- The mount shows the whole folder `~/.codex` to the container, with the settings, the history and the sessions of Codex. The server reads only `auth.json` from the folder. The server can also start a Codex program from the folder, when one is there.
- The container user `node` has the user number 1000. It can read `auth.json` when the file belongs to the host user with the number 1000. For another number, the file mode decides, and the author did not check it. The author did not check rootless Docker.
- Run `codex login` before you start the app for the first time. When `~/.codex` does not exist, Docker creates it as an empty folder that belongs to root.
- Any program on the host passes the check for the same machine, because the container shares the network of the host. With the host network, the route `/mcp` and the Provider Settings panel also answer any program on the host. `SECURITY.md` describes this limit for the OAuth routes and for the route `/mcp`.
- The override uses `!reset`, so it needs a new version of Docker Compose. The author ran `docker compose config` with Compose 5.5.1 and does not know the lowest version.
- The author did not run `make up-codex`, because it replaces the app container of the owner. The author used `docker run` with the network and the mount of the override, and an image built from the same Dockerfile. The author also did not run `make down` after `make up-codex`, and did not run a voice session.
- The Provider Settings panel can save keys with this override, because its connection looks local. The server writes them to `.env` in the container, and a new container has no such file. The target `make up-codex` creates a new container. Put your keys in `.env` on the host.
- The author checked the host network on Linux only.
- To refuse voice sessions with an API key, set `GEV_PREFER_CODEX_OAUTH=true` in `.env`.
