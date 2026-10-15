## Context

Base commit: `915cc8e8` (main, after the merge of `reticulum-layer`).
The function `isSameOriginCommand` in `server/providers/osh-control.js` checks the content type, the host and the origin of a POST. It does not look at the socket address or at the proxy headers.
The route calls it first, before the flag and the account checks. It writes one audit line for each refusal.

The route for the key panel (`admitKeySetupRequest` in `src/keySetupCore.mjs`) has stricter rules. It needs a loopback socket, a local host name, an exact origin and no proxy header.
`compose.codex.yaml` runs the app on the host network. `compose.yaml` publishes the port through the bridge network of its project. `compose.yaml` sets `HOST` to `0.0.0.0`, and the override keeps it, so the server listens on every interface.

## Goals / Non-Goals

**Goals:**
- A POST to `/api/control/osh/commands` passes only when it comes from the machine that runs the server.
- One shared function that a later route can use. It has the same lists as the key panel: the socket addresses, the host names and the proxy headers.

**Non-Goals:**
- The GET route `/api/control/osh/targets`. It sends no command.
- The routes that spend money for OpenAI or Google. They have their own gate in `src/localRequestGate.mjs`.
- An option that lets a LAN address pass.

## Decisions

### D1: A new shared file

The function lives in `server/providers/common/loopback-command.js`, and `isSameOriginCommand` calls it. The name `isSameOriginCommand` stays, so the tests and the route keep their imports.
Alternative: change the function in place. The Bee Maps route of a later change needs the same rules, and a second copy would drift from the first.

### D2: The rules and their order

The function checks the content type, the proxy headers, the socket address, the host and the origin, in that order. Each check returns false at once.
The socket addresses are `127.0.0.1`, `::1` and `::ffff:127.0.0.1`. The host names are `localhost`, `127.0.0.1` and `[::1]`. These are the lists of the key panel.
The function `hasProxySignals` of `src/localRequestGate.mjs` names the proxy headers, so that list has one owner.

The host is compared as the client sent it, so a Host with a capital letter is refused. A browser sends the host in lower case. The key panel changes the host to lower case before it compares it, and this gate does not.

### D3: The answer does not change

Each refusal gives `403` with `{error:'cross_origin'}`, as before. The browser code and the audit log see no new error name. The audit line names the socket address as the client, or `local` when the socket has none. So a LAN device appears in the log.

### D4: Tests

The tests build a request object with a fake socket. They open no port. The route test already gives the socket address `127.0.0.1`, so it needs only a parameter to change it.

### D5: The bridge mode

With `make up` the server sees the gateway address of the project network for a request to `localhost` from this machine, not the loopback address. `evidence/peer-address.txt` has the measurements. The function refuses that address.
Alternative: accept the gateway address. Docker sets the address, and it changes between hosts. The check cannot find the difference between a program on this machine and another container on the bridge.

## Risks / Trade-offs

- [A user who opens the app by a LAN address loses the commands] → `CHANGELOG.md` says so. The route gives `403` with the same body as for any other refusal.
- [A user of `make up` loses the commands] → The Known limit `bridge` says so. `make up-codex` works.
- [The list of proxy headers misses a proxy] → It is the list of the key panel, which a test pins.
