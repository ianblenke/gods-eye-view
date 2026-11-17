## Why

Many UP42 thumbnails from the vantor host are larger than 1 MiB.
In a live test in Taichung, four of eight vantor thumbnails were 1.22 MiB to 2.82 MiB in size.
The server refused each of them as bad_upstream, and the page said "UP42 did not give the thumbnail".

## What Changes

- Raise the limit of a UP42 thumbnail on the server from 1 MiB to 4 MiB.
- Raise the limit of a thumbnail in the browser source from 1 MiB to 4 MiB.
- Keep the limit of SkyWatch at 1 MiB.
- Add one test for each of the scenarios 012, 013 and 014 of up42-scenes-layer. The gate needs a changed test for each scenario that the modified requirement carries.
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
No trace gap opens. The lead must run the ratchet command to record the new hashes of scenarios 010 and 015.
The scenario text of 012, 013 and 014 stays the same.
The delta replaces the text of the requirement Image of up42-thumbnails and of the requirement Browser source of up42-scenes-layer.

## Known limits

- Known limit `store-size`: The server keeps each of at most 32 thumbnails for 10 minutes. The worst case is now 128 MiB of RAM, not 32 MiB.
- Known limit `largest-seen`: The largest thumbnail in the test was 2.82 MiB. A thumbnail above 4 MiB still fails.
- Known limit `ledger-noise`: The ratchet lowered the branch counts of geoFileImport.js and i18n/index.js in the history of the ledger. This change touches neither file. It is the known measurement noise of the ratchet on this machine.
- Known limit `no-reason-in-log`: The log does not name the reason of a refused thumbnail. This change does not add it.
