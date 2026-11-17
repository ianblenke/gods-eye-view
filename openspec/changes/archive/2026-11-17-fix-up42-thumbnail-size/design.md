## Context

The client in auth.js took its limit of 1 MiB from the SkyWatch image helper.
The browser source has its own constant, MAX_THUMBNAIL_BYTES, with the same value.
A vantor thumbnail can have almost 3 MB.
The server then reads too many bytes and gives bad_upstream.

## Goals / Non-Goals

**Goals:**
- Show the thumbnails that UP42 sends.
- Keep SkyWatch unchanged.

**Non-Goals:**
- No new log text.
- No change to the store size or the rate limit.

## Decisions

- The limit is 4 MiB, which is 4194304 bytes. The largest thumbnail in the test had 2.96 MB.
- auth.js gets its own constant for this limit. It no longer imports the limit of SkyWatch.
- The browser constant MAX_THUMBNAIL_BYTES becomes 4 MiB. The browser must read what the server sends.
- The limit for the body of a JSON error stays small in effect, because the error body is small.

## Risks / Trade-offs

- The store can hold 128 MiB in the worst case. The risk is small, because a thumbnail is rarely above 1 MiB and a restart clears the store.
- A later thumbnail above 4 MiB fails as before.

## Gates

- Scenario `up42-thumbnails-010`: the tests use the exact numbers 4194304 and 4194305. The mutation that sets the limit back to 1048576 makes the test of 4194304 bytes fail.
- Scenario `up42-scenes-layer-015`: the source test reads 4194304 bytes and refuses 4194305 bytes. The mutation that sets MAX_THUMBNAIL_BYTES back to 1 MiB makes it fail.
- The files auth.js and source.js stay at 100% line, branch and function coverage. The ratchet command records the changed scenario hashes.
- `make lint` checks the prose. `make gates CHANGE=fix-up42-thumbnail-size` runs all gates.
