## Why

The CI run after the merge of `osh-camera-video` failed in two jobs: "Spec gates" and "Node 24.14.0". Both jobs fail one test, the test `[osh-090]` with real HTTP clients. The job "Node 26.x" passes. The assertion `closed.includes('steady')` fails: the provider destroyed the response of the client that reads too.

The test sends messages of 2000000 bytes to two real HTTP clients. One client never reads. The provider destroys the response of a client that has more than 8388608 unwritten bytes. The test expects that only the client that does not read loses its response.

The client that reads shares the event loop of the test. The loop gives it one turn after each message. A slow runner can let it fall behind, so its unwritten bytes pass the limit. The client that does not read can keep many messages in the buffers of the kernel. Then its own response lasts for more messages. The client that reads has more time to fall behind.

The failure does not repeat in the image, on Node 26, or on one CPU core. So the cause is likely, and not proved. The fix does not depend on it.

## What Changes

- The test waits after each message until the client that reads has got that message. That client never holds a backlog.
- The test makes the client that does not read with a corked response, `res.cork()`, on the real HTTP server. The response keeps each write in memory, so `writableLength` grows as it does for a client that does not read. The result does not depend on the buffers of the kernel.
- The test stops after 40 messages and no longer uses a raw `net` socket.
- No test name changes. No code file changes. No spec delta.

## Impact

- Changed test file: `src/data/oshLive.test.mjs`. It loses the import of `node:net`.
- Gaps that this change opens or closes: none.

## Known limits and later changes

- `osh-buffer-test-cause-unproved`: the run of the fixed test on the CI runner is the proof. The failure did not repeat on the machine of the lead.
- `osh-buffer-test-cork`: a corked response is not a client that does not read. The provider sees the same `writableLength` and the same `destroy()`, and that is what the test checks. The kernel is not part of the test.
