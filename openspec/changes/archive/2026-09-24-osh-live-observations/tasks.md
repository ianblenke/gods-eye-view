## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md`: `osh-005` MODIFIED, and `osh-063` to `osh-074` ADDED.
  - The requirement "GET only" carries `osh-004` and `osh-006` byte for byte. Its text stays the same.
  - The base of the requirement is `git show main:openspec/specs/osh/spec.md`.
- [x] 1.2 Write `proposal.md` with the Why, the What Changes, the Impact and the limits.
- [x] 1.3 Write `design.md` with D64 to D71.
- [x] 1.4 Write `tasks.md` from this list, with a mutation ledger under each test task.

## 2. The server

Do not rename a test that exists on `main`. Use only synthetic ids: `ds-fixture-`, `sys-fixture-` and `foi-fixture-`. No test calls a real server.

- [x] 2.1 Change the test `[osh-005]` in `src/data/oshProxy.test.mjs`. Keep its name and its tag.
  - The file list of `server/providers/osh/` becomes five files, with `live.js`.
  - Only `get.js` calls `fetch`, `fetchImpl` or `WebSocket`. No scanned file calls `send`.
  - Every other file that opens an upstream socket imports `oshOpenStream` from `get.js`.
- [x] 2.2 Add a `[osh-006]` test in `src/data/oshProxy.test.mjs`: a wrong method on `/api/osh/live` gives `405` and no socket.
- [x] 2.3 Write the `[osh-064]` tests in `src/data/oshIds.test.mjs` for `liveUrl()` and `assertLiveUrl()`.
  - An `http` root gives `ws`, and an `https` root gives `wss`. The path and the query are fixed.
  - `assertLiveUrl()` throws for another host, path, query, user name, password and fragment. Test each one alone.
- [x] 2.4 Write the tests of `osh-063`, `osh-065` to `osh-070` in the new file `src/data/oshLive.test.mjs`.
  - Use an injected socket constructor and injected timers for the hub tests.
  - Use one end-to-end test with a hand-made WebSocket server on the loopback address. It records the method, the headers and each frame that the client sends.
  - `[osh-063]` no key gives `503`, a bad id gives `400`, and a wrong method gives `405`. Each opens no socket.
  - `[osh-065]` the handshake is a GET. `Authorization: Basic` is present only when both credentials are set. The provider sends zero frames. `binaryType` is `arraybuffer`.
  - `[osh-066]` a binary frame and a text frame give the `observation` event with the shape of `osh-022`. A frame that is not JSON, has no `result`, or is too large gives no event. An oversize frame closes the socket, sends `unsupported`, and refuses the datastream for ten minutes.
  - `[osh-067]` two clients share one socket. The socket closes two seconds after the last client leaves. A client within those two seconds keeps it.
  - `[osh-068]` a ninth datastream and a seventeenth client get `503` with `live_busy`, and open no socket.
  - `[osh-069]` the events `open` and `down`. A client that joins an open socket gets `open` at once. The delays 1, 2, 4, 8, 16 and 30 seconds, and the reset after 30 seconds open. The heartbeat every 20 seconds.
  - `[osh-070]` on a failure, no event, header or log line holds the URL, the user name or the password.
- [x] 2.4b Change the pinned OSH test file count of `[osh-034]` from 14 to 15 in `src/data/oshRepositoryHygiene.test.mjs`. Keep its name.
- [x] 2.5 Add `liveUrl()` and `assertLiveUrl()` to `server/providers/osh/ids.js` until 2.3 passes.
- [x] 2.6 Add `oshOpenStream()` to `server/providers/osh/get.js`. It sets `binaryType`, passes the headers, and never sends a frame.
- [x] 2.7 Write `server/providers/osh/live.js` with `createOshLiveHub()` until 2.4 passes.
- [x] 2.8 Add the route `/api/osh/live` to `server/providers/osh.js` with the checks of `osh-063`, until 2.1 to 2.4 pass.
- [x] 2.9 Run each mutation below on the server. Report one line for each mutation: the id and the test that failed.
  - V1: skip the bad-id check on the live route. `[osh-063]` fails.
  - V2: let the keyless path open a socket. `[osh-063]` fails.
  - V3: accept a POST on the live route. The `[osh-006]` live test fails.
  - V4: build `ws` for an `https` root. `[osh-064]` fails.
  - V5: remove one check of `assertLiveUrl()`, one at a time. `[osh-064]` fails for each.
  - V6: send `Authorization` when only the user name is set. `[osh-065]` fails.
  - V7: call `send` once on the upstream socket. `[osh-065]` and `[osh-005]` fail.
  - V8: leave `binaryType` at its default. `[osh-065]` fails.
  - V9: relay a text frame only. `[osh-066]` fails.
  - V10: relay a frame with no `result`. `[osh-066]` fails.
  - V11: remove the size check. `[osh-066]` fails.
  - V12: do not refuse the datastream after an oversize frame. `[osh-066]` fails.
  - V13: open one socket for each client. `[osh-067]` fails.
  - V14: close the socket at once when the last client leaves. `[osh-067]` fails.
  - V15: never close the socket. `[osh-067]` fails.
  - V16: remove the limit of eight sockets, then the limit of sixteen clients. `[osh-068]` fails for each.
  - V17: never send `open`, then never send `down`. `[osh-069]` fails for each.
  - V18: use a constant delay in place of the growing delay. `[osh-069]` fails.
  - V19: do not reset the delay after 30 seconds open. `[osh-069]` fails.
  - V20: send no heartbeat. `[osh-069]` fails.
  - V21: put the URL in the `down` event. `[osh-070]` fails.
  - V22: put the password in a log line. `[osh-070]` fails.
  - V23: send no `open` to a client that joins an open socket. `[osh-069]` fails.
  - If no test fails for a mutation, that is a finding. Stop. Add a test that fails for it, and then continue.

## 3. The browser

- [x] 3.1 Write the `[osh-071]` tests in `src/layers/osh/source.test.mjs` with a fake `EventSource`.
  - The URL is the same-origin path with the id, and it has no credentials.
  - Each event calls its callback. `close()` closes the `EventSource`.
- [x] 3.2 Add `openLive()` to `src/layers/osh/source.js` until 3.1 passes.
- [x] 3.3 Write the `[osh-072]`, `[osh-073]` and `[osh-074]` tests in `src/data/oshLayer.test.mjs`. Register `t.after(() => layer.destroy(viewer))` in each.
  - `[osh-072]` the layer opens at most eight streams for the selected system. A new selection, empty space and `destroy()` each close them all.
  - `[osh-073]` a live observation changes the detail block and the entity position for a fresh location. An observation that is ahead of the clock moves nothing. The layer reads no observation by poll for a datastream whose stream is open and that has an observation.
  - `[osh-074]` a datastream with no open stream, with no observation yet, or with `down` or `unsupported`, is polled. A stream that is open, for a datastream that has an observation, stops the poll.
  - Keep every test that exists now, with its name.
- [x] 3.4 Change `src/layers/osh/index.js` until 3.3 passes. A source with no `openLive()` keeps the polling of today.
- [x] 3.5 Run each mutation below on the layer. Report one line for each mutation: the id and the test that failed.
  - B1: open a stream for each datastream with no limit of eight. `[osh-072]` fails.
  - B2: leave the streams open after a new selection. `[osh-072]` fails.
  - B3: leave the streams open after empty space. `[osh-072]` fails.
  - B4: leave the streams open after `destroy()`. `[osh-072]` fails.
  - B5: ignore the observation event. `[osh-073]` fails.
  - B6: move the entity for an observation that is not fresh. `[osh-073]` fails.
  - B7: move the entity for an observation that is ahead of the clock. `[osh-073]` fails.
  - B8: read the observation by poll while the stream is open. `[osh-073]` fails.
  - B9: skip the poll for a stream that reports `down`. `[osh-074]` fails.
  - B10: skip the poll for a stream that reports `unsupported`. `[osh-074]` fails.
  - B11: keep polling after the stream opens again. `[osh-074]` fails.
  - B14: skip the poll for a stream that is open, for a datastream with no observation. `[osh-074]` fails.
  - B12: put a user name in the `EventSource` URL. `[osh-071]` fails.
  - B13: never close the `EventSource` in `close()`. `[osh-071]` fails.
  - If no test fails for a mutation, that is a finding. Stop. Add a test that fails for it, and then continue.

## 4. Gates and review

- [ ] 4.1 Run `make lint` until no STE error remains.
- [ ] 4.2 Run `make ratchet CHANGE=osh-live-observations`.
- [ ] 4.3 Run `make gates CHANGE=osh-live-observations`. Confirm that each changed code file has full coverage.
- [ ] 4.4 Run `/opsx:review osh-live-observations`.
- [ ] 4.5 Correct the findings.
- [ ] 4.6 Record the result in `review.md`.
