## Context

Base commit: `cc576adb` (main, after the merge of `beemaps-burst-control`).
The layer "Bee Maps Frames" (`src/layers/beemaps/`) is the model for the files, the registration and the tests. The four routes and their rules are in the capability `beemaps-burst-control`.

The layer panel supports controls for a layer through two module methods: `getRowControls()` and `setRowControlsListener(listener)`. A chip of the controls has an `onClick` function or a `params` object. The panel calls `onClick` only after a real press. At the press, the panel reads the chip again from the live controls by its `id`. A chip with an old id finds no chip, so its press does nothing.

## Goals / Non-goals

**Goals:**
- A confirm request only after two real presses: one for the quote and one for the Confirm chip of that quote.
- The person sees the box and the price before the second press.
- After an answer that is not clear, the layer says that a burst can exist, and offers no way to send the confirm request again.

**Non-goals:**
- A way to draw an area. See the Known limit `view-box-only`.
- A link to the frames layer. See the Known limit `frames-not-linked`.
- A chip to cancel a burst, because Bee Maps has no such call.

## Decisions

### D1: A new layer, not new chips on the frames layer

The frames layer has 27 scenarios that pin its one chip and its one request. New chips there would change those scenarios and their tests. A new layer `beemaps-bursts` leaves them as they are. It needs the next free token "6" and a new delta of `osh-033`.

### D2: The Confirm chip has the quoteId in its id

The chip id is `confirm:<quoteId>`. The panel reads the live chip by id at each press, so a press on a chip of an old quote finds no chip. The `onClick` function also checks that its own quote is still the current quote. A quote that ends, is cancelled or is confirmed removes the chip.

### D3: The layer disables the chip before the first await

The `onClick` function sets the state "confirming" and calls the listener before it calls `source.confirm`. The panel then reads a disabled chip. A second call of the same function sees the state and does nothing.

### D4: One idempotency key for each quote

The layer asks a random source for the key when the quote answer arrives, and keeps it with the quote. The default source uses `crypto.getRandomValues` and gives 32 hexadecimal characters, which the server accepts. A test gives the layer its own random source. The layer never shows the key.

### D5: The source decides what a confirm answer means

The source classifies the answer into `created`, `refused` or `unknown`. The layer shows `refused` only for a list of error codes that the server states for a request that took no credits at Bee Maps. Every other answer is `unknown`, also an answer with a status of 200 that the source cannot read. The layer never reads a status code.

The codes bad_request, key_rejected, no_credit and upstream_rate_limit follow a request to Bee Maps. They are refusals because the capability `beemaps-burst-control` maps the statuses 400, 401, 402, 403 and 429 of Bee Maps to them. Nobody checked this mapping against the real service.

### D6: The confirm request has no signal

The layer gives `source.confirm` only the quoteId and the key. Nothing in the layer can abort the request. The source aborts it after 60 seconds on its own timer, and then the result is `unknown`. The server stops its own request after 30 seconds, so 60 seconds is a safe bound.

### D7: The text of a confirm survives `disable`

A person who disables the layer after a confirm request must not lose a warning that a burst is possible. The text of the last confirm is the first part of the info text. It stays until the layer shows a new quote. `disable` clears the quote, the list and the other messages, and it does not clear this text.
A message of a later press or of the status comes after this text and does not replace it.

### D8: The box is the box of the frames layer, within 80 degrees

`burstBox` calls `viewBox` of the frames layer, and then refuses a box that crosses the latitude 80 or -80. `viewBox` checks the snapped centre only. The burst route checks the four corners.
A sweep checked every snapped centre from -80.05 to 80.05 degrees. Four centres gave a box that the route refuses as `bad_area`: -80, -79.995, 79.995 and 80. The layer therefore adds the check of the corners.

### D9: The quote request has no credits field

The server uses the minimum of 125 credits when the quote request has no `credits`. The layer never sends a larger number, so the limit per burst in `.env` has no effect on the panel.

### D10: The quote ends on a timer and at the press

The layer starts a timer for the seconds of the quote, with an injected timer and clock. The timer can run late in a hidden browser tab. The press therefore also compares the clock with the end time, and sends nothing when the quote has ended.

### D11: Draw rectangles with no outline

The layer draws a filled rectangle for the quote and for each burst. A filled rectangle with no height follows the terrain. An outline would need a fixed height. The Known limit `terrain-fill` records this.

### D12: Fixed texts in two files

All texts are fixed strings in `messages.js` and `model.js`. A test can then check each text with a literal string.

### D13: The Confirm chip waits 1000 milliseconds

A fast double press of "Quote burst here" gives the quote answer in a few milliseconds. The Confirm chip then takes the place of the quote chip, and the second press of the double press lands on it. The panel checks only that the chip is not disabled.
The layer therefore disables the Confirm chip for 1000 milliseconds after it shows the quote. A timer tells the panel when the wait ends, and `onClick` also compares the clock. The wait guards against a double press and nothing else.

### D14: Bursts that a confirm created stay in the list

The list route keeps an answer for 60 seconds and no confirm request clears it. A press of "Check my bursts" just after a confirm request can then miss the new burst. The layer keeps the bursts that confirm requests created in a list of its own. It draws them with the bursts of the last list answer. The list answer takes its place when it lists the burst. The text adds "stored answer" when the route says that the answer came from memory.

### D15: Null fields of the list route

The list route sets the status, the credits or the box of a burst to null when Bee Maps gives no valid value. The same holds for the burst of a created answer. The source keeps such a burst. A burst with no box counts in the text and gets no entity. A created burst with no credits shows the credits of the quote.

### D16: The layer asks for a frame after each change of the boxes

The application renders on demand: the render governor sets `requestRenderMode` when nothing animates. A change of entities from a button press does not draw a frame by itself. A real browser run showed a quote box that stayed invisible until something else drew a frame.
The layer therefore calls `requestRender` after each change of the boxes. The wrapper `src/app/layers/beemapsBursts.js` gives it `governorRequestRender`.

## Risks / Trade-offs

- [A hidden tab runs the timer late] → The press compares the clock with the end time.
- [A reload drops the warning after an unclear answer] → The server keeps its refusal of new confirm requests. See the Known limit `warning-in-memory`.
- [A quote can be pressed twice in a row] → The wait of 1000 milliseconds of D13 guards against it.
- [The list route answers from memory] → The text says "stored answer", and D14 keeps the new burst.
- [The token "6" collides with the pull request 1069 of the upstream project] → The Known limit `token-collision` says that a sync renumbers one layer.
- [The shapes come from the tests of change 3] → No run used the real service. The classification treats every other shape as unknown.
- [The routes need `make up-codex`] → The routes answer only this machine, and the layer says so.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show the Bee Maps bursts of the account. Let a person quote and confirm a new burst for the view centre. A confirm needs two presses and shows what it took."
