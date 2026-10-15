## Why

The route `/api/control/osh` sends commands to drones through the server. Its origin check accepts a request when the host is `localhost`, any IP address or a `.local` name, and the origin equals the host.

The server listens on all interfaces. A device on the same network that opens the app by its LAN address passes the check. That device can then send a command when `OSH_CONTROL_ENABLED` is on and a control account is set. The route for the key panel already refuses such a request, because it needs a loopback socket and a local host name.

## What Changes

- Add the file `server/providers/common/loopback-command.js` with the function `isLoopbackCommand`. It accepts a POST only when five conditions hold. The socket address is loopback, and the request has no proxy header. The host is `localhost`, `127.0.0.1` or `[::1]`. The origin equals the host, and the content type is `application/json`.
- Make `isSameOriginCommand` in `server/providers/osh-control.js` call that function. Each refusal still gives `403` with `{error:'cross_origin'}` and one audit line.
- Change the scenario `osh-control-028`. Add the requirement "Local connection only" with the scenarios `osh-control-039` and `osh-control-040`.
- Add the new file and `src/localRequestGate.mjs` to the package `osh-control-provider` in `scripts/package-boundaries.json`.
- Update the tests in `src/control/route.test.mjs`. Add one entry to `CHANGELOG.md`, one note to `.env.example` and one line to `docs/roadmap/mcp-agent-backends.md`.
- **BREAKING**: a browser that opens the app by a LAN address or by a `.local` name can no longer send a control command.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh-control`: the scenario `osh-control-028` accepts only the loopback hosts. The new requirement "Local connection only" refuses a POST from another machine or through a proxy.

## Impact

The new file is shared code. The Bee Maps submission route of a later change reuses `isLoopbackCommand`, so the OSH control route and the Bee Maps route share one function.
With `make up-codex` a browser on the machine that runs the server can still send commands. The plain `make up` publishes the port through a bridge network. The server then sees the gateway address of that network and refuses every command.

The new file is a file that the fork writes, so it goes into `openspec/ownership.json` and `scripts/format-scope.json`. The check of the package boundaries needs the new file and the file `src/localRequestGate.mjs` in the package `osh-control-provider`.

## Known limits and later changes

- Known limit `reads`: The route `/api/control/osh/targets` (GET) has no origin check. It reads the command names of one system and sends no command. This change does not touch it.
- Known limit `bridge`: With `make up` a request to `localhost` from this machine reaches the server with the gateway address of the project network. The route refuses it. Use `make up-codex`, or run the server on the host. `evidence/peer-address.txt` has the measurement.
- Known limit `local-programs`: Any program on the machine that runs the server passes the check, because the check cannot tell programs apart.
- Known limit `proxy`: A proxy that removes its own headers and connects from the loopback address passes the check.
- Known limit `scripts-as-text`: The files in `evidence/` that hold scripts hold them as text. No gate measures them.
