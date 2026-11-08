## Why

The UP42 layer shows footprints and one selected card.
A person needs an optional preview of several scenes on the globe.

## What Changes

- Add an image chip when the enabled layer has a thumbnail scene and credentials are not known to be absent.
- Request at most 24 thumbnails with four active requests.
- Draw each image over its footprint with the newest image on top.
- Keep outlines and selection above the images.
- Release each image and abort requests after a new answer or removal.
- Keep the original card path while the option is off.

## Capabilities

### New Capabilities

- `up42-scene-overlay`: Show scene previews on their footprints.

### Modified Capabilities

None. The merged specs and old tests stay unchanged.

## Impact

Base commit: `c0d02493f66de4c0fc435aa70070ec5579d3b50b`.
The change edits the UP42 index module.
It adds an image module and its tests.
It keeps every old test unchanged.
The ownership manifest explicitly lists the new code file within the owned folder.
The format and package manifests include the new module.

A changelog fragment describes the new option.
The change adds no dependency, server route or environment variable.
It opens no intended gap and closes no old ledger gap.

## Known limits

- Known limit `approximate-fit`: A thumbnail is a preview. Its fit to the footprint is approximate and can skew for a rotated scene or an off-nadir scene.
- Known limit `display-terms`: UP42 has not confirmed thumbnail display terms. The option starts off and needs `UP42_THUMBNAILS=true`.
- Known limit `image-cap`: Only the 24 newest scenes with a thumbnail get an image.
- Known limit `rate-limit`: One answer requests at most 24 images, below the server limit of 30 per minute. The layer sends no retry.
- Known limit `ui-texts`: The chip labels are "Show images" and "Hide images". The original card labels keep their original exception.
- Known limit `no-live-check`: No check uses real UP42 images. The lead checks the browser with synthetic images.
- Known limit `memory`: The layer holds up to 24 images in RAM until release.
