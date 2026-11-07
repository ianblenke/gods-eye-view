## Context

Base commit: `f589cc58480d8239302b70c2b5ce32ea1bc8325d`.

The merged UP42 routes accept a box, dates and an id. Credentials stay on the server.

The SkyWatch layer supplies the display pattern. The shared scene module accepts exactly two other services.


## Decisions

### Layer and requests

Use id `up42-scenes`, name "UP42 Scenes", source "UP42", icon "🔭" and update interval 0.

Place the layer after SkyFi in the catalog and the Cameras group.

Import `scenesBox` and `searchWindow` from the SkyWatch box file.

The source maps the helper box to the request key `box` and sends only that key, `start` and `end`.

Read status on each enabled update. Send a search only after a press.

Keep the newest good answer after a failed press. A disable aborts active requests and forgets that answer.


### Records and display

Keep valid Polygon rings, time, id, collection, provider, resolution, cloud percent and the thumbnail flag.

Accept dots in ids, but refuse ids of dots only. Encode thumbnail ids before a request.

Keep at most 50 distinct scenes. Read the route count and budget counts as whole numbers.

Reduce failed hosts to a boolean. Show a partial note without host text or retries.

Show the id and collection in each list item, with date, provider, resolution and cloud percent.

Map route failures to local texts. Never show raw upstream text.

Show both budget counts when the daily limit stops a search.


### Images

Copy the bitmap path of the template. Decode the blob with `createImageBitmap` and give the bitmap to the overlay host.

This path creates no object URL and no image element, so it has no object URL to revoke.

Close each old, invalid or late bitmap. Abort the previous selection request before a new selection.

Keep the 8 MiB search cap, 1 MiB image cap, 60 second search limit and 20 second image limit.

Use one cleanup path after request work. Do not use a finally block around returns.


### Registration and checks

Use token "04". Keep the registry sorted by id. The QA fixture uses the next free token, "05".

Change the five registration test files named in the proposal. Keep all other merged layer scenarios and tests.

Copy the whole current Systems layer requirement for the osh delta. Change only the count to 41.

The new files enter `openspec/ownership.json`, `scripts/format-scope.json` and `scripts/package-boundaries.json`.

Tests use fake sources, clocks, streams, viewer objects and image decoders. Each item has distinct fixture values.

Measure each new or edited code file with host Node coverage. Record each named fault and the test that failed.

Run the layer, source, token, UI, app, voice, translation and share test files on host Node.

The lead ran the stored browser plan. The lead also runs the calibrated gates, the archive and the final review steps.


## Purpose at archive time

Describe how the UP42 layer searches archive scenes after a press and shows the selected preview on the globe.

