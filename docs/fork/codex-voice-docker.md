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
- The server still listens on all addresses of the host, as in `make up`. Other computers can reach the app on its port.
- The port comes from `GEV_PORT`, with the default 4173.
- The folder `~/.codex` of the host is a read-only folder in the container. The container can read `auth.json` and cannot change a Codex file.
- The override mounts the folder and not the file. A mount of one file can keep the old file when a program replaces it.

## Limits

- The image has no Codex program. The sign-in button of the app shows an error. Sign in on the host with `codex login`.
- The server also looks for a Codex program in `~/.codex/packages`. When the host has one there, the mount brings it into the container, and the button can start it.
- The server never refreshes the token. When the token expires, run `codex login` on the host again.
- The OAuth routes refuse a connection from another computer. A tunnel or a reverse proxy on the host, such as `ssh -L`, makes a connection look local.
- The container shares the network of the host. It can reach services on the loopback address of the host, and a port conflict can stop it.
- Any code in the container can read `auth.json`, as on the host. The file holds a refresh token.
- The mount shows the whole folder `~/.codex` to the container, with the config and the history of Codex. The server reads only `auth.json`.
- The container user `node` has the number 1000. It reads `auth.json` only when the file belongs to the host user with the number 1000. Rootless Docker is not checked.
- Create `~/.codex` with `codex login` before the first start. When the folder does not exist, Docker creates it as an empty folder that belongs to root.
- Any program on the host passes the check for the same machine, because the container shares the network of the host. `SECURITY.md` describes this limit.
- The override uses `!reset`, so it needs a recent Docker Compose. The check ran with Compose 5.5.1. The lowest version is not known.
- The Provider Settings panel can save keys with this override, because its connection looks local. The server writes them to `.env` in the container, and `make up-codex` removes them. Put your keys in `.env` on the host.
- The author checked the host network on Linux only.
- To refuse voice sessions with an API key, set `GEV_PREFER_CODEX_OAUTH=true` in `.env`.
