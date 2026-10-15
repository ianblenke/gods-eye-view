## Context

Base commit: `081de43d` (main, after the merge of `beemaps-source`).
The Reticulum layer (`src/layers/reticulum/`) is the model for the files, the registration and the tests. The route and its rules are in the capability `beemaps-source`.

The layer panel supports controls for a layer through two module methods: `getRowControls()` and `setRowControlsListener(listener)`. A chip of the controls has an `onClick` function or a `params` object. The panel calls `onClick` only after a real click. It calls `setParams` of the module for `params`, and saved state and voice use the same path.

## Goals / Non-goals

**Goals:**
- A request for frames only after a real press of one button.
- At most one request for each press, no retry, and a message for each error.
- A box that the server accepts at any latitude from -80 to 80 degrees.

**Non-goals:**
- Images. See the Known limit `no-images`.
- A card or a label for a point.
- Bursts. A later change adds them.

## Decisions

### D1: One chip with `onClick` is the only trigger

The chip has an `onClick` function and no `params`. The layer has no `setParams`, so saved state and share links can only switch it on, and then it reads only the status. The layer registers no listener on the camera.

### D2: The update reads the status only

The `updateInterval` is 0, so the manager runs no periodic update. `update` calls `getStatus` and nothing else. The status route is free.

### D3: The box is about 4 km² around a snapped centre

The centre is the point under the middle of the screen, rounded to the nearest multiple of 0.005 degrees. A repeated press at the same place then sends the same box, and the memory of the server answers it for free for 10 minutes.

The box is 2000 metres high and 2000 metres wide on a sphere. The half height in degrees is the same at every latitude. The half width is that value divided by the cosine of the latitude, so the area is about 4 km² at each latitude.

Three views get a message and no request. They are a view of the sky, a centre outside -80 to 80 degrees and a box past the 180th meridian. The 5 km² limit of the server is then never near.

### D4: The browser does not import server code

The test of the box imports the server functions `validateRequest` and `boxAreaKm2`. It shows that the server accepts the box at 33 latitudes and 35 longitudes. The browser module imports nothing from `server/`.

### D5: The browser checks the answer again

The server filters the answer, but the layer still keeps only frames with a valid id, position and time, and at most 200 of them. A change of the server cannot then put a bad value on the globe.

### D6: One message for each error

The error name of the answer picks the message. The table is in `messages.js`. The text names the cause that a person can change, such as the key, the daily limit or the network of the app.

### D7: No retry and one request at a time

A request in flight disables the chip. A failure enables it again and starts nothing. The source sets one timer, which stops the call after 30 seconds.

### D8: The style shows the age of a frame

A frame under 7 days old is a bright point. A frame under 30 days old is dimmer, and an older frame is dimmer and smaller. A person sees which frames are fresh.

## Risks / Trade-offs

- [A press costs money] → The server counts it, limits it to the daily limit and answers a repeat from memory. The layer shows the count.
- [The token collides with an upstream layer] → The Known limit `token-collision` names it. The next sync renumbers one of the two.
- [The button fails with `make up`] → The message names `make up-codex`.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show the newest Bee Maps frames at the view centre as points on the globe. Fetch them only when a person presses a button, and name each failure of the route."
