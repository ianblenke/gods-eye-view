## Context

The layer "SkyWatch Scenes" (`src/layers/skywatchScenes/`) is merged. It has a source for three routes. It has rules for the records, the texts and the display. A layer draws the footprints and a thumbnail card. The routes `/api/planet/*` and `/api/skyfi/*` have the same three calls: the status, the scenes and the thumbnail. So the same layer can serve both providers.

On 2026-10-22 the owner selected one layer for each provider on one shared module. The owner asked to leave the layer "SkyWatch Scenes" and its token as they are.

## Goals / Non-Goals

**Goals:**
- Show the scenes of Planet and of SkyFi on the globe, with the same way of working as the layer "SkyWatch Scenes".
- Keep one copy of the code for the two new layers.

**Non-Goals:**
- A change of the layer "SkyWatch Scenes", of its token or of any server route.
- A request to a provider. The layers call only the routes of this app.

## Decisions

### D1: One module, a provider value for each layer

The module `src/layers/sceneProvider/` has the functions `createSceneSource(provider, options)` and `createSceneLayer(provider, options)`. The value `provider` is "planet" or "skyfi". The file `providers.js` holds the frozen values of each provider. These are the layer id, the names, the icon, the label, the route base and the two variable names. They also include the list label and the names of the satellite providers.

The module copies the code of the layer "SkyWatch Scenes" and replaces the fixed words with these values. It imports `scenesBox` and `searchWindow` from `src/layers/skywatchScenes/box.js`, because they do not depend on the provider.

### D2: Footprints with more than one part

A scene of Planet can be a `MultiPolygon` of up to 16 parts, and a SkySat scene was one in the probe of `planet-source`. So a record has `rings`, a list of 1 to 16 rings. The layer adds one entity for each ring. The first entity has the id `<layer>:<scene id>`, and the entity of the ring n, from 1, has the id `<layer>:<scene id>:<n>`. All entities of a scene have the style of its selection. The card is at the centre of the first ring.

### D3: The names of the satellite providers

SkyFi gives a provider code for each scene, such as `VANTOR`. The layer shows a name. `providers.js` has the names for four codes: Vantor, Sentinel-1, Sentinel-2 and Planet. For another code, the layer shows the code with each underscore changed to a space. Planet gives "PlanetScope" or "SkySat", and the layer shows them as they are.

### D4: Texts

Each text of the layer "SkyWatch Scenes" that names SkyWatch, its key variable or its thumbnail variable takes the value of the provider. The thumbnail routes of Planet and SkyFi are on by default, so the text for "thumbnails_off" says to remove `<thumbs>=false` from `.env`.

### D5: Registration

The tokens "01" and "02" are the next free tokens. The QA script for the two-character token used "01" for its fixture, so it uses "03" now. Both layers go in the group "Cameras" after "skywatch-scenes". They are out of voice.

Their credits follow the terms of each provider. The credit of Planet has the copyright notice. The credit of SkyFi gives the limit of a personal license.

### D6: The tests

Each test runs for both providers, with the expected values of each provider written as literals in the test. The tests use fake sources, a fake viewer and a fake overlay host, as the tests of the layer "SkyWatch Scenes". A fault of each rule must make a named test fail, and `evidence/faults.txt` gives each fault and the test that fails. The lead also checks both layers once in a real Chrome for Testing with its sandbox, with a fake upstream, and records it in `evidence/browser.txt`.

## Files and measures

New owned code files: `src/layers/sceneProvider/{providers,records,messages,model,source,index}.js` and `src/app/layers/sceneProviders.js`. New owned test files: the six files of the proposal.

Each new code file must have 100% line, branch and function coverage. The trace gate checks the 35 scenario IDs and their tests. The prose lint checks STE.
The lead runs the four checks of `make precheck` on the host, and the gates in Docker. The two review agents read the final tree.

## Purpose at archive time

Show the archive scenes of Planet and of SkyFi at the view centre on the globe. Search only when a person presses the chip, and show the thumbnail of the scene that a person selects.
