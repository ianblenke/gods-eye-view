## Why

Change 3 added the routes that quote, confirm and list Bee Maps bursts. Nothing in the app uses them yet. The owner wants to ask for a fresh map of an area and to see the bursts that Bee Maps made.

This is change 4 of 4. It adds the layer "Bee Maps Bursts". A burst takes credits from the Bee Maps account and nobody can cancel it. The layer therefore sends a confirm request only after two real presses of a person, with a wait of one second between them.

## What Changes

- Add the folder `src/layers/beemapsBursts/` with the files `box.js`, `records.js`, `messages.js`, `source.js`, `model.js` and `index.js`. Add the wrapper `src/app/layers/beemapsBursts.js`.
- Add four chips to the row of the layer: "Quote burst here", "Confirm: N credits, A km²", "Cancel quote" and "Check my bursts".
- A press of "Quote burst here" asks the server for the price of a burst. The box is about 4 km² at the view centre.
- A quote costs nothing. The layer draws the box of the quote on the globe.
- The Confirm chip stays disabled for 1000 milliseconds after the quote shows, so a double press of "Quote burst here" cannot press it.
- A press of the Confirm chip sends one confirm request with the quoteId and an idempotency key. The layer then shows the result.
- After an answer that is not clear, the layer says that a burst is possible and offers no chip that sends that confirm request again.
- A press of "Check my bursts" asks for the list of bursts and draws the box of each one.
- Send no quote, confirm or list request when the layer is enabled, and from any other path. These paths are a saved state, a share link, a move of the camera, voice and a timer.
- Register the layer with the share token "6", in the group Cameras, out of voice, with a data credit. Change the count in the scenario `osh-033` from 32 to 33.
- Add the capability `beemaps-bursts` with 29 scenarios. Add one entry to `CHANGELOG.md` and one paragraph to `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `beemaps-bursts`: The layer record, the rule that only a press sends a request, and the quote, the confirm and the list. Also the browser source, the texts and the registration.

### Modified Capabilities

- `osh`: The scenario `osh-033` says that the registry has 33 entries now. The delta carries the whole requirement "Systems layer", and the other eight scenarios stay as they are.
- `beemaps-frames`: The scenario `beemaps-frames-025` says that the group Cameras ends with the frames layer. It now ends with the frames layer and the bursts layer. The delta carries the whole requirement "Registration", and the other three scenarios stay as they are.

## Impact

No server code changes. The browser code uses the four routes of change 3. The new files go into `openspec/ownership.json`, `scripts/format-scope.json` and `scripts/package-boundaries.json`.

The tests use fake sources and fake viewers. No test and no run sends a request to Bee Maps. A run in a real browser has a fake upstream behind the real routes. It shows that the fake upstream gets no create request when the layer is enabled, for a quote alone and for a cancel. It shows one create request for each two-press confirm.

## Known limits and later changes

- Known limit `view-box-only`: The box is fixed at about 4 km² around the view centre. The person cannot draw an area or choose another size.
- Known limit `frames-not-linked`: The layer does not fetch frames. After a burst has a hit, the person moves the view to it and presses "Fetch frames here" in the layer "Bee Maps Frames". A link between the two layers is a later change.
- Known limit `credits-fixed`: The quote request has no `credits` field, so each burst gets the minimum of 125 credits. A person cannot ask for more.
- Known limit `no-cancel`: Bee Maps has no call that cancels a burst. The layer has no chip for it.
- Known limit `no-refund`: Nobody has checked when Bee Maps returns credits. The status "refunded" exists, and the layer draws such a burst grey.
- Known limit `list-first-100`: The list asks for the first 100 bursts. The text shows how many exist in all.
- Known limit `list-price-unknown`: Nobody has checked the price of a list request. The title of the chip says that it can cost money.
- Known limit `hit-meaning-unverified`: The text counts a burst with `isHit` true as a hit. Nobody has checked the rule that Bee Maps uses for it.
- Known limit `token-collision`: The token "6" is the next free token of this fork. The open upstream pull request 1069 claims "6" for another layer. The next sync must then renumber one of the two layers.
- Known limit `osh-count`: The scenario `osh-033` names the count of the registry, so each new layer needs a new delta of the capability `osh`.
- Known limit `status-once`: The layer reads the status when it is enabled or updated. Someone who changes `.env` must restart the app.
- Known limit `local-only`: The routes answer only the machine that runs the server. The chips work with `make up-codex` and fail with `make up`. The layer names this in its message.
- Known limit `quote-in-memory`: The quote lives in memory only. A reload drops it, and a new quote costs nothing.
- Known limit `warning-in-memory`: The warning after an unclear answer lives in memory only. A reload drops it. The server keeps its own refusal of new confirm requests after an unclear answer, for 600 seconds.
- Known limit `two-tabs`: A second browser tab can press Confirm for its own quote. The server allows one confirm at a time and counts the credits in a file, so the limits of change 3 still hold.
- Known limit `terrain-fill`: The box is a filled rectangle on the ground with no outline. The globe can hide it on steep terrain.
- Known limit `list-memory`: The list route answers from memory for 60 seconds, and no confirm request clears that memory. A press just after a confirm request can miss the new burst. The text then says "stored answer". The layer keeps the burst that the confirm request created.
- Known limit `new-quote-after-unclear`: After an unclear answer, a new quote offers a Confirm chip again. The server then refuses the confirm request for the time of its hold, and the layer shows that answer as unclear.
- Known limit `chip-lock-only`: The wait of 1000 milliseconds guards against a double press only. The layer cannot know if the person read the price.
- Known limit `null-fields`: The list route can set the status, the credits or the box of a burst to null. The layer counts such a burst and draws it grey, or draws no box when the box is null.
- Known limit `real-service`: No run used the real service. The shapes come from the tests of change 3.
