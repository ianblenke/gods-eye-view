## Why

Many UP42 thumbnails from the vantor host are larger than 1 MiB.
In a live test in Taichung, four of eight vantor thumbnails had 1.28 MB to 2.96 MB.
The server refused each of them as bad_upstream, and the page said "UP42 did not give the thumbnail".

## What Changes

- Raise the limit of a UP42 thumbnail on the server from 1 MiB to 4 MiB.
- Raise the limit of a thumbnail in the browser source from 1 MiB to 4 MiB.
- Keep the limit of SkyWatch at 1 MiB.
- Keep all other checks: the media type, the first bytes and the 502 answer for an excess size.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `up42-thumbnails`: Change the limit of the image requirement.
- `up42-scenes-layer`: Change the limit of the thumbnail read in the browser source requirement.

## Impact

The change edits auth.js under server/providers/up42 and source.js under src/layers/up42Scenes.
It edits up42Thumbnails.test.mjs under src/data and source.test.mjs under src/layers/up42Scenes.
It adds changelog.d/1437-up42-thumbnail-size.md.

It adds no code file and changes no ownership path.
No trace gap must open. The lead must run the ratchet command to record the new hashes of scenarios 010 and 015.
The delta replaces the text of the requirement Image of up42-thumbnails and of the requirement Browser source of up42-scenes-layer.

## Known limits

- Known limit `store-size`: The server keeps at most 32 thumbnails for 10 minutes. The worst case is now 128 MiB of RAM, not 32 MiB.
- Known limit `largest-seen`: The largest thumbnail in the test was 2.96 MB. A thumbnail above 4 MiB still fails.
- Known limit `no-reason-in-log`: The log does not name the reason of a refused thumbnail. This change does not add it.
