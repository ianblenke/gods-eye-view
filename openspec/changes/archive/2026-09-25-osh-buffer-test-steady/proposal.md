## Why

In the CI run after the merge of `osh-camera-video`, two jobs failed: "Spec gates" and "Node 24.14.0". In both jobs the test `[osh-090]` with real HTTP clients failed. The job "Node 26.x" passed. The assertion `closed.includes('steady')` failed. The provider destroyed the response of the client that reads, and not only the response of the client that does not read.

The test gives messages of 2000000 bytes to the upstream socket. The provider relays each message to two real HTTP clients. One client does not read. The provider destroys the response of a client that has more than 8388608 unwritten bytes. The test expects that the provider destroys only the response of the client that does not read.

On a slow runner, the client that reads can read more slowly than the provider writes. Then its response has more than 8388608 unwritten bytes. The client that does not read can keep some messages in the buffers of the kernel. Then the provider destroys its response later, after more messages. The client that reads has more time to read too slowly.

The failed assertion proves one fact: the response of the client that reads had more than 8388608 unwritten bytes before a write. The reason is not proved. The likely reason is the slow runner that the text above describes. The old test did not fail in the Docker image that `make gates` uses, on Node 26, or on one CPU core. So a local run cannot prove the reason. The fix does not need the reason.

## What Changes

- The test waits after each message until the client that reads receives the start of that message. So before each write, that client has at most one message of unwritten bytes.
- The server of the test calls `res.cork()` on the response of the client that does not read. The buffer of the socket keeps each write, so `writableLength` grows with each write. With a real client that does not read, `writableLength` grows only after the buffers of the kernel are full.
- The test stops when the provider destroys the response. It stops after 40 messages when the provider does not destroy it, and then the test fails. The test does not use a raw `net` socket any more.
- The change renames no test and changes no code file. It has no spec delta.

## Impact

- Changed test file: `src/data/oshLive.test.mjs`. It loses the import of `node:net`.
- Gaps that this change opens or closes: none.

## Known limits and later changes

- `osh-buffer-test-cause-unproved`: the reason for the failure is not proved. A green CI run of the fixed test is a sign that the fix works, but it does not prove it. It also does not prove the reason. The failure did not repeat on the local machine.
- `osh-buffer-test-cork`: a corked response is not a real client that does not read. The provider runs the same check of `writableLength` and calls the same `destroy()` for both. With a real client, the provider destroys the response after more messages, because the buffers of the kernel keep some bytes. The test checks the provider. The kernel is not part of the test.
- `osh-buffer-test-comments`: two comments of the test are less clear than the documents. They say "reader", "the result" and "backlog", and one does not say that a real client fills the buffers of the kernel first. The assertion text "got message N" says more than the wait checks. A later change can improve them.
- `osh-buffer-test-exact-limit`: the test can see that the provider destroys the response only within 40 messages. At the 40th message the response holds 39 messages, about 104 megabytes. A limit between 8.4 and 104 megabytes passes the test. The other `[osh-090]` tests, with a fake response, pin the exact limit of 8388608 bytes.
- `osh-buffer-test-lagging-reads`: in the test, the client that does not read has a `data` listener, so it reads what the response sends. Only the cork holds the bytes back. A Node version that sends corked bytes makes the test fail with a time-out, because the provider does not destroy the response.
