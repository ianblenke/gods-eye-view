## Why

In the CI run after the merge of `osh-camera-video`, two jobs failed: "Spec gates" and "Node 24.14.0". In both jobs the test `[osh-090]` with real HTTP clients failed. The job "Node 26.x" passed. The assertion `closed.includes('steady')` failed. The provider destroyed the response of the client that reads, and not only the response of the client that does not read.

The test gives the upstream socket messages of 2000000 bytes. The provider relays each message to two real HTTP clients. One client does not read. The provider destroys the response of a client that has more than 8388608 unwritten bytes. The test expects that the provider destroys only the response of the client that does not read.

On a slow runner, the client that reads can read more slowly than the test writes. Then its response has more than 8388608 unwritten bytes. The client that does not read can keep some messages in the buffers of the kernel. Then the provider destroys its response later, after more messages. The client that reads has more time to read too slowly.

The failed assertion proves one fact: the response of the client that reads had more than 8388608 unwritten bytes at a check. The reason is not proved. The likely reason is the slow runner that the text above describes. The old test did not fail in the Docker image that `make gates` uses, on Node 26, or on one CPU core. So a local run cannot prove the reason. The fix does not need the reason.

## What Changes

- The test waits after each message until the client that reads receives it. That client never has more than one message of unwritten bytes at a check.
- The server of the test calls `res.cork()` on the response of the client that does not read. The buffer of the socket keeps each write, so `writableLength` grows at once. The response of a real client that does not read grows it only after the buffers of the kernel are full.
- The test stops when the provider destroys the response. It stops after 40 messages when the provider does not destroy it, and then the test fails. The test does not use a raw `net` socket any more.
- The change renames no test and changes no code file. It has no spec delta.

## Impact

- Changed test file: `src/data/oshLive.test.mjs`. It loses the import of `node:net`.
- Gaps that this change opens or closes: none.

## Known limits and later changes

- `osh-buffer-test-cause-unproved`: the reason for the failure is not proved. A green CI run of the fixed test shows that the fix works. It does not prove the reason. The failure did not repeat on the local machine.
- `osh-buffer-test-cork`: a corked response is not a real client that does not read. The provider sees the same `writableLength` and the same `destroy()`, and the test checks that. The kernel is not part of the test.
- `osh-buffer-test-comments`: two comments of the test use the words "reader" and "the result" with no clear meaning. A later change can improve them.
- `osh-buffer-test-exact-limit`: the test finds a destroy within 40 messages, which is about 107 megabytes. A limit between 8.4 and 107 megabytes passes the test. The other `[osh-090]` tests, with a fake response, pin the exact limit of 8388608 bytes.
- `osh-buffer-test-lagging-reads`: the client that does not read has a `data` listener in the test, so only the cork keeps bytes from it. A Node version that sends corked bytes makes the test fail with a time-out. Then the test does not test a client that does not read.
