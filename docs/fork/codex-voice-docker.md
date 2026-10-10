# Voice with the ChatGPT sign-in in Docker

The Codex OAuth voice feature lets the voice assistant use your ChatGPT sign-in and not an API key. The server uses the sign-in file of Codex to get a short-lived voice token.

## Start

1. Sign in on the host: run `codex login`. The file `~/.codex/auth.json` must exist.
2. Start the app with `make up-codex` and not with `make up`.
3. Open the app and open Provider Settings. Choose USE CHATGPT OAUTH. The choice is per browser.

To go back, stop the app and start it with `make up`.

## What the override changes

The file `compose.codex.yaml` changes three things for the container.

- The container uses the network of the host. The server answers the OAuth routes only for connections from the same machine, and a bridge network hides that fact.
- The port comes from `GEV_PORT`, with the default 4173.
- The folder `~/.codex` of the host is a read-only folder in the container. The container can read `auth.json` and cannot change a Codex file.

## Limits

- The container has no Codex program. The sign-in button of the app shows an error. Sign in on the host with `codex login`.
- The server never refreshes the token. When the token expires, run `codex login` on the host again.
- The OAuth routes refuse every connection from another machine. A browser on another computer cannot use this feature.
- The container shares the network of the host. It can reach services on the loopback address of the host, and a port conflict can stop it.
- Any code in the container can read `auth.json`, as on the host. The file holds a refresh token.
- Host networking works on Linux only.
- To refuse voice sessions with an API key, set `GEV_PREFER_CODEX_OAUTH=true` in `.env`.
