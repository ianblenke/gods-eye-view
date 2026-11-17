## Context

The client in auth.js took its limit of 1 MiB from the SkyWatch image helper.
The browser source has its own constant, MAX_THUMBNAIL_BYTES, with the same value.
A vantor thumbnail can have almost 3 MiB.
The server stops at 1 MiB and gives bad_upstream.

## Goals / Non-Goals

**Goals:**
- Show the thumbnails that UP42 sends.
- Keep SkyWatch unchanged.

**Non-Goals:**
- No new log text.
- No change to the store size or the rate limit.

## Decisions

- The limit is 4 MiB, which is 4194304 bytes. The largest thumbnail in the test had 2.82 MiB.
- auth.js gets its own constant for this limit. It no longer imports the limit of SkyWatch.
- The browser constant MAX_THUMBNAIL_BYTES becomes 4 MiB. The browser must read what the server sends.

## Risks / Trade-offs

- The store can hold 128 MiB in the worst case. The risk is small, because a restart clears the store and the store keeps each thumbnail for only 10 minutes.
- A later thumbnail above 4 MiB fails as before.

## Gates

- Scenario `up42-thumbnails-010`: the tests use the exact numbers 4194304 and 4194305. The mutation that sets the size limit back to 1048576 makes the test of exactly 4194304 bytes for scenario 010 fail.
- Scenario `up42-scenes-layer-015`: the source test reads 4194304 bytes and refuses 4194305 bytes. The mutation that sets MAX_THUMBNAIL_BYTES back to 1 MiB makes the test of 4194304 bytes for scenario 015 fail.
- The files auth.js and source.js stay at 100% line, branch and function coverage. The ratchet command records the changed scenario hashes.
- `make lint` checks the prose. `make gates CHANGE=fix-up42-thumbnail-size` runs all gates.
