## Context

The provider destroys the response of a client that has more than 8388608 unwritten bytes (`osh-090`). The route reads `res.writableLength` before each call of `res.write()`. The test `[osh-090]` with real HTTP clients runs this rule on real responses.

## Goals / Non-Goals

**Goals:**
- Make the test give the same result on every machine.
- Keep the name of the test.
- Keep the check that the provider destroys the response of the client that does not read.
- Keep the checks that the response of the client that reads stays open, and that this client keeps its events.
- Keep the check that the upstream socket stays open.

**Non-Goals:**
- Do not change the provider code or the scenario `osh-090`.
- Do not test the buffers of the kernel.

## Decisions

### D1 The client that reads receives each message before the next one

The test waits with `until()` until the client that reads receives the start of each message. So at each check that client has at most one message of unwritten bytes, about 2666700 bytes. The limit is 8388608 bytes.

### D2 The response of the client that does not read is corked

The server of the test calls `res.cork()` on that response. Node keeps each write in the buffer of the socket, and `writableLength` counts it. No byte goes to the kernel. So the number of messages before the limit is the same on every machine.

The provider writes each message as one event `frame` with base64 text, about 2666700 bytes. Before the fifth write the response has 10666800 unwritten bytes, which is more than 8388608. So the provider destroys the response at the fifth message. The test stops when the provider destroys the response. It stops after 40 messages when the provider does not destroy it, and then the test fails.

## How the gates measure this change

Coverage: no code file changes. Trace: no test name changes. The test fails with each of these mutations: remove the check, raise the limit to 1677721600, or keep the check and remove the destroy. The author ran them (task 1.3). The other `[osh-090]` tests, with a fake response, pin the exact limit of 8388608 bytes.

The CI run of the push of this change is the acceptance. All jobs must pass.

## Risks / Trade-offs

- **A corked response is not a real client that does not read.** Accepted, and named as `osh-buffer-test-cork`.
- **The reason for the CI failure is not proved.** Accepted, and named as `osh-buffer-test-cause-unproved`.

## Migration Plan

None. The change is in one test file.
