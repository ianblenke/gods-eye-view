## Context

The provider destroys the response of a client that has more than 8388608 unwritten bytes (`osh-090`). The route reads `res.writableLength` at each write. The test `[osh-090]` with real HTTP clients checks that check on real responses.

## Goals / Non-Goals

**Goals:**
- Make the test give the same result on every machine.
- Keep the name of the test.
- Keep its three checks: the destroyed response, the events of the client that reads, and the open socket.

**Non-Goals:**
- Change the provider code or the scenario `osh-090`.
- Test the buffers of the kernel.

## Decisions

### D1 The client that reads gets each message before the next one

The test waits with `until()` after each message. The client that reads then holds at most one message of unwritten bytes, which is far below the limit, on any machine.

### D2 The client that does not read is a corked response

The server callback calls `res.cork()` for that client. Node keeps each write in the buffer of the socket, and `writableLength` counts it. No byte goes to the kernel. So the number of messages before the limit is the same on every machine. The provider destroys the response at the fifth message. The test stops after 40 messages, so a provider with no check fails the test.

## How the gates measure this change

Coverage: no code file changes. Trace: no test name changes. The mutations that remove the check, double the limit or skip the destroy fail the test, and the lead ran them.

The CI run after the push is the acceptance test. All jobs must pass.

## Risks / Trade-offs

- **A corked response is not a real client that does not read.** Accepted, and named as `osh-buffer-test-cork`.
- **The cause of the CI failure is not proved.** Accepted, and named as `osh-buffer-test-cause-unproved`.

## Migration Plan

None. The change is in one test file.
