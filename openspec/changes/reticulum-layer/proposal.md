## Why

Changes 1 and 2 added the route `/api/reticulum` and the listener container. The route gives the interfaces that Reticulum operators publish on purpose. Nothing shows them on the globe yet.

This is change 3 of 3. It adds the layer "Reticulum Network". A point marks each interface that has a position. The color shows the type, and the size and the alpha show the status. A label shows the name for the 48 most important interfaces.

The names come from anonymous operators. The layer treats each name as untrusted text and cleans it again in the browser.

## What Changes

- Add the folder `src/layers/reticulum/` with the files `records.js`, `source.js`, `model.js` and `index.js`, and add the file `src/app/layers/reticulum.js`.
- Add the capability `reticulum-layer` with twenty scenarios, `reticulum-layer-001` to `reticulum-layer-020`.
- Register the layer in the catalog, the source composition, the reference sources, the share link, the layer panel, the credits and the voice-off list.
- Add the test files `src/layers/reticulum/records.test.mjs`, `source.test.mjs`, `model.test.mjs` and `layer.test.mjs`, and the tests for the registrations.
- Update the tests that count layers or pin the share token, as the upstream pull requests do. Write one entry in `CHANGELOG.md` and one paragraph in `DATA_SOURCES.md`.

## Capabilities

### New Capabilities

- `reticulum-layer`: Six requirements. They cover the layer record, the browser source, the interface records, the display model, the layer display and the registration.

### Modified Capabilities

None.

## Impact

The suite shows which registrations a new layer needs. The layer needs a catalog entry, a source contract, a reference source, a share token and a voice entry (here: voice-off). The tests that count layers also change.

The panel group, the credits and the package files are not tested by the suite. This change adds them for the user.
The share token is "4". The check of `make precheck` needs the next free digit, so there is no choice.
The new files are files that the fork writes, so they go into `openspec/ownership.json` and `scripts/format-scope.json`. The upstream files get as few new lines as possible.

## Known limits and later changes

- Known limit `no-card`: The layer has no detail card. The viewer has no info box, and the earthquake layer has none either. A label shows the name of an interface, and a click does nothing.
- Known limit `names`: The normalizer removes U+200C and U+200D from a name, so a name in a script that uses joiners loses them. Other invisible characters stay, for example U+00AD, U+180E, U+2800, U+3164 and U+E0000 to U+E007F, so a name can look empty.
- Known limit `labels`: The layer shows at most 48 labels. The overlay host decides which of them fit on the screen.
- Known limit `voice`: The layer is in the list `VOICE_OFF_LAYERS`, and it has no analyst entry. The names are untrusted text, and the voice model would read them. A later change can add numeric and type fields only.
- Known limit `token`: The share token "4" is the next free digit in this fork. On the date in `evidence/upstream-token-claims.txt`, at least 3 of the open upstream pull requests claim "4" for other layers. A sync must renumber the token, and then share links with "4" change their meaning.
- Known limit `stale`: The layer keeps the points of a stale list, and the panel shows no sign of it.
- Known limit `position`: The operator sets the position of an interface and nobody checks it. The provider rounds it to three decimals.
- Known limit `refresh`: The layer asks the route every 5 minutes, and the provider caches its answer for 60 seconds. An interface that an operator turns off stays on the globe until it is older than 7 days.
- Known limit `visual`: The author looked at the layer on one machine in one headless Chrome with a software renderer and a stored list. No test draws the points.
