## Context

Base commit: `c0d02493f66de4c0fc435aa70070ec5579d3b50b`.
The package requests Cesium ^1.124.0.
The CCTV image material supplies the pattern for transparency and color.
The wind module uses a different surface path and needs no change.

## Decisions

Add `images.js` to own the queue, object URLs and image entities.
Use the scene time in milliseconds from the source.
Sort time values from greatest to least and ids from least to greatest.

Select the first 24 scenes with thumbnails and start four workers.
Each worker starts the next scene when its current request ends.
A shared abort signal belongs to each answer.
Release aborts that signal, removes each image entity and revokes each object URL.

Late answers cannot change a new answer or a disabled layer.
Each error increases the failed count without a retry.
The fixed readout gives the shown count and the failed count.

Pass the layer decoder to the image queue.
Decode each blob before image creation and close the bitmap at once.
Reject a null decode result and count each decode failure.
Check the abort signal after decode; a late bitmap closes and creates no image.

Use an object URL from each blob in an ImageMaterialProperty.
Set transparent true and white with alpha 0.85.
Use each footprint ring in a ground polygon with no fixed height.
Set zIndex from the scene rank: oldest 1 and newest at most 24.
Set the footprint outline and selected fill zIndex to 25 while images show.

Selection changes only footprint entities; image entities keep their materials.
The image fit can differ from the scene footprint.

The index adds the image chip only when the enabled layer has a thumbnail scene and the credential status is configured or unknown.
Before a search or without thumbnail scenes, the row has only the search chip.
The image chip has a usable handler whenever it appears.

A new answer releases old images and starts the queue when the option stays on.
An answer with no thumbnail scene switches the option off and removes the image chip.
Disable, destroy and reset release images and return the option to off.
Selection skips the card path while images show.
The card path keeps its current decoder and bitmap cleanup.

The old layer tests and the merged layer spec stay unchanged.

## Files and checks

Edit `index.js` for the chip and lifecycle hooks.
Add `images.js` for image ownership and the queue.
Add `images.test.mjs` for literal scene orders, geometry, material, counts and cleanup.
Add the new code path to `openspec/ownership.json`.

Update the format and package path lists for the new files.
Add `changelog.d/1434-up42-scene-overlay.md`.
The first chip has no separate voice or label registration.
The layer remains in the voice exclusion list.

Tests use fake sources, a fake viewer and a fake overlay host.
Every new test starts with a scenario tag and uses assert methods.
Host coverage must reach 100 percent for each new or edited code file.
Fault checks change sort, cap, concurrency, ranks, cleanup, card selection, retry and outlines.

The evidence names each fault and the test that failed.
The host runs the requested registration tests and the STE lint.
The lead checks synthetic images in the browser and runs calibrated gates before merge.

## Purpose at archive time

Describe how the UP42 layer places optional scene images on their footprints and releases each image after use.
