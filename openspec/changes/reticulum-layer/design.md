## Context

Base commit: `f16890c9` (main, after the merge of `reticulum-listener`).
The route `/api/reticulum` gives a document with the schema version 1: the list `interfaces`, the object `counts` and the fields `unavailable`, `stale`, `reason` and `fetchedAt`. Each interface has the fields `id`, `type`, `name`, `latitude`, `longitude`, `heightM`, `hops`, `lastHeard`, `status` and `radio`.
The earthquake layer is the model: static points, labels through the overlay host, a stats object and no click card. The viewer has the info box turned off.

## Decisions

### D1: Modules without Cesium

The files `records.js`, `source.js` and `model.js` do not import Cesium. They hold the rules for the records, the request, the styles and the choice of the labels. Their tests run on the host and in the fault runner.
Only `index.js` imports Cesium. Its test needs the image, because the folder `node_modules` of the host is empty. The tests run in the image with a short-lived container that mounts the clone.

### D2: Names are untrusted text

The names come from anonymous operators through the provider. The provider removes control characters and the characters `<` and `>`.

The layer cleans the names again in the browser. It removes control characters, characters that change the text direction, zero width characters, line and paragraph separators and the characters `<` and `>`.
The overlay draws a title with `fillText` of a canvas, and the layer panel writes text with `textContent`. So a name cannot inject HTML. A cleaned name has no direction mark and no zero width character.
The layer has no analyst entry and no voice entry, because the voice model would read the names.

### D3: Unavailable and stale documents

A document with `unavailable` true has no points. The layer shows no point. It sets the guidance status `idle` with the reason as `statusMessage`, so the panel shows a prompt and no red fault.
A document with `stale` true keeps its points. A request that fails keeps the last points and sets `error`.

### D4: Registrations from the suite

A skeleton layer in a throwaway copy showed what the suite needs. It needs the catalog entry, the source contract in `sourceComposition.js` and the key in the reference sources. It needs the entry in the share link registry and in the token ledger, and the entry in `VOICE_OFF_LAYERS`. The tests that count layers need new counts.

The tests of the token ledger use the digits 4 and 5 for fixtures, and they move up by one.
The suite does not need the group in the layer panel, the credit, the package exports and the package boundaries. This change adds them. A user needs the group and the credit, and `make precheck` needs the package files.

### D5: Tests and checks

The pure modules have tests on the host. The layer has a test with a fake viewer in the image.

All named faults run in one long-lived container with the clone mounted. The lead stops that container before a ratchet or a gates run (rule 12).
The visual check runs without a container. The lead starts the listener program on the host, with a stored list and no outbound link. The lead starts a Vite server from a copy of the commit and drives a headless Chrome. The app container of the owner is not touched.

## Files and measures

The trace gate checks that the tests carry the IDs `reticulum-layer-001` to `reticulum-layer-020`. The coverage gate needs 100% of lines, branches and functions in each new code file, and in each changed line of an upstream code file.
The named faults measure whether a change of a rule, a limit or a color makes a test fail. The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show, as points on the globe, the interfaces that Reticulum operators publish. Treat every name as untrusted text, and keep the layer out of voice."
