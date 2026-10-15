## Why

Change 1 added a read-only route that returns the newest Bee Maps frames of a small area. Nothing in the app shows them yet. The owner wants fresh frames on the globe and, later, a way to ask Bee Maps to map an area again.

This is change 2 of 4. It adds the layer "Bee Maps Frames". The layer fetches frames only when a person presses a button, because each request can cost money.

## What Changes

- Add the folder `src/layers/beemaps/` with the files `box.js`, `records.js`, `messages.js`, `source.js`, `model.js` and `index.js`. Add the wrapper `src/app/layers/beemaps.js`.
- Add a button "Fetch frames here" to the row of the layer. A press builds a box of about 4 km² at the view centre, posts it to `/api/beemaps/frames` and shows the frames as points.
- Send no request for frames from any other path. These paths are the enabling of the layer, a saved state, a share link, a move of the camera, voice and a timer. The layer reads only the free status route.
- Show one message for each error answer of the route. Never send a request again after an error.
- Register the layer with the share token "5", in the group Cameras, out of voice, with a data credit. Change the count in the scenario `osh-033` from 31 to 32.
- Add the capability `beemaps-frames` with 27 scenarios. Add one entry to `CHANGELOG.md` and one paragraph to `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `beemaps-frames`: The layer record, the rule of one request for each press, the status of the key and the view box. Also the browser source, the answer records, the messages, the display and the registration.

### Modified Capabilities

- `osh`: The scenario `osh-033` says that the registry has 32 entries now. The delta carries the whole requirement "Systems layer", and the other eight scenarios stay as they are.

## Impact

No server code changes. The browser code uses the two routes of change 1. The new files go into `openspec/ownership.json`, `scripts/format-scope.json` and `scripts/package-boundaries.json`.

The tests use fake sources and fake viewers. No test and no run sends a request to Bee Maps. A run in a real browser has a fake upstream behind the real route. It shows that the browser sends nothing on enable and one request for each press.

## Known limits and later changes

- Known limit `no-images`: The layer shows points and no image. The API description gives only the placeholder `www.cdn.com` as the address of a signed image URL. Nobody can name the real host without a real call. An image route is an optional later change, after the owner has a key and runs one call.
- Known limit `token-collision`: The token "5" is the next free token of this fork. Two open upstream pull requests, 1002 and 1069, claim "5" for other layers. The next sync must then renumber one of the two layers.
- Known limit `osh-count`: The scenario `osh-033` names the count of the registry, so each new layer needs a new delta of the capability `osh`.
- Known limit `box-size`: The box is fixed at about 4 km², snapped to a grid of 0.005 degrees. The person cannot choose another size or pick another place than the view centre.
- Known limit `no-date-filter`: The request has no date. The frames can be old, and the point style shows their age.
- Known limit `points-in-memory`: The points live in memory only. They are gone after a disable and after a reload, and a new press can cost money. The server memory of change 1 answers an identical box for free for 10 minutes.
- Known limit `status-once`: The layer reads the status when it is enabled. A key that someone adds later needs a disable and an enable.
- Known limit `no-card`: A point has no card and no label. A person cannot read the time of one frame yet.
- Known limit `local-only`: The route answers only the machine that runs the server, so the button works with `make up-codex` and fails with `make up`. The layer names this in its message.
- Known limit `real-service`: No run used the real service. The shapes come from the public API description, as in change 1.
