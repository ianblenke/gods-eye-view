Base commit: `c0d02493f66de4c0fc435aa70070ec5579d3b50b`, with uncommitted changes.

## C1

The image chip exists only when the enabled layer has a thumbnail scene and credentials are not known to be absent.
The chip labels are "Show images" and "Hide images".
An answer with no thumbnail scene switches the option off, aborts requests and releases every image.

The old layer test and records module equal main.
The diff for both files is empty.
There is no edit of an old test or merged scenario.

## C2

The image queue uses scene time in milliseconds, from greatest to least.
Equal times use ids from least to greatest.
The records module needs no private metadata.
The three manifest diffs add only the image module and its test path.

## Files

| File | Purpose |
| --- | --- |
| `src/layers/up42Scenes/index.js` | Add the chip rule, session state and release hooks. |
| `src/layers/up42Scenes/images.js` | Own the queue, time order, polygons and object URLs. |
| `src/layers/up42Scenes/images.test.mjs` | Test literal orders, chip absence, geometry and release. |
| `openspec/ownership.json` | List the new code file. |
| `scripts/format-scope.json` | List the new code and test paths. |
| `scripts/package-boundaries.json` | List the image module in both package lists. |
| `changelog.d/1434-up42-scene-overlay.md` | Describe the image option. |

The change documents define 20 scenarios and include a test task for each id.
The first chip has no separate voice registration.
The layer stays in the voice exclusion list.

## Host checks

The broad run passes all 172 selected files: 3174 tests, 0 failures.
The final layer run passes 161 tests, including one more test for unknown status.
The latest file results total 3175 passed tests and 0 failures.

| File | Lines | Branches | Functions |
| --- | --- | --- | --- |
| images.js | 100% | 100% | 100% |
| index.js | 100% | 100% | 100% |

## Fault checks

All 33 commands end with exit 1 and named failed tests.
Each file equals its original text after restoration.

| Id | Change | Test that failed |
| --- | --- | --- |
| UPO-M032 | Always supply the image chip. | [up42-scene-overlay-003] omits the image chip without an answer or available thumbnails |
| UPO-M033 | Supply the chip without a thumbnail scene. | [up42-scene-overlay-003] omits the image chip without an answer or available thumbnails |
| UPO-M034 | Sort times from least to greatest. | [up42-scene-overlay-004] requests only the 24 newest thumbnails in literal order |
| UPO-M035 | Reverse the order of equal-time ids. | [up42-scene-overlay-005] orders equal times by id and puts greater time values first |
| UPO-M036 | Allow 25 scenes. | [up42-scene-overlay-004] requests only the 24 newest thumbnails in literal order |
| UPO-M037 | Allow five active requests. | [up42-scene-overlay-006] runs at most four requests and starts the next after an end |
| UPO-M038 | Reverse the polygon ranks. | [up42-scene-overlay-010] gives ground polygons literal ranks with the newest highest |
| UPO-M039 | Keep old images after a new answer. | [up42-scene-overlay-013] switches the option off after an answer with no thumbnails |
| UPO-M040 | Open the card while images show. | [up42-scene-overlay-007] keeps two images after one failure and sends no retry |
| UPO-M041 | Retry a failed thumbnail. | [up42-scene-overlay-007] keeps two images after one failure and sends no retry |
| UPO-M042 | Remove outlines while images show. | [up42-scene-overlay-011] keeps each outline above images and keeps the selected style |
| UPO-M043 | Do not abort image requests. | [up42-scene-overlay-013] aborts and releases images after a new answer |
| UPO-M044 | Do not revoke kept image URLs. | [up42-scene-overlay-008] counts an image error and releases its URL |
| UPO-M045 | Use full image alpha. | [up42-scene-overlay-009] draws every footprint vertex with the specified image material |
| UPO-M046 | Displace every image vertex. | [up42-scene-overlay-009] draws every footprint vertex with the specified image material |
| UPO-M047 | Keep the card when images start. | [up42-scene-overlay-018] closes the old card before the image queue starts |
| UPO-M048 | Keep the off label while images show. | [up42-scene-overlay-002] gives the image chip its labels and handler |
| UPO-M049 | Start the option on. | [up42-scene-overlay-001] starts with no image and keeps the card path |
| UPO-M050 | Ignore the old image handler guards. | [up42-scene-overlay-003] omits the image chip without an answer or available thumbnails |
| UPO-M051 | Do not count image failures. | [up42-scene-overlay-007] keeps two images after one failure and sends no retry |
| UPO-M052 | Remove images after a search failure. | [up42-scene-overlay-019] keeps images and selection after a failed search |
| UPO-M053 | Keep image entities after release. | [up42-scene-overlay-013] aborts and releases images after a new answer |
| UPO-M054 | Skip the card while the option is off. | [up42-scene-overlay-001] starts with no image and keeps the card path |
| UPO-M055 | Keep an image URL after entity creation fails. | [up42-scene-overlay-008] counts an image error and releases its URL |
| UPO-M056 | Remove image transparency. | [up42-scene-overlay-009] draws every footprint vertex with the specified image material |
| UPO-M057 | Remove the ground clamp. | [up42-scene-overlay-010] gives ground polygons literal ranks with the newest highest |
| UPO-M058 | Request scenes with no thumbnail. | [up42-scene-overlay-004] requests only the 24 newest thumbnails in literal order |
| UPO-M059 | Remove images on selection. | [up42-scene-overlay-007] keeps two images after one failure and sends no retry |
| UPO-M060 | Keep the option on after reset. | [up42-scene-overlay-015] aborts and releases images after disable |
| UPO-M061 | Accept answers after abort. | [up42-scene-overlay-013] aborts and releases images after a new answer |
| UPO-M062 | Keep the option on for an answer with no thumbnails. | [up42-scene-overlay-013] switches the option off after an answer with no thumbnails |
| UPO-M063 | Add a public field during image creation. | [up42-scene-overlay-020] keeps the original public scene fields |
| UPO-M064 | Omit the image chip until a successful status answer. | [up42-scene-overlay-003] supplies the image chip when the status is unknown |

## Pending lead work

The browser check uses synthetic images and stays pending.
No live image check, ratchet, archive, calibrated gates or review runs here.
The proposal lists the known limits of preview fit, terms, image count, rate, UI text, live checks and memory.

The host STE lint completes with exit 0: STE: 0 errors, 1333 warnings.
The six-file format check and git diff --check pass.
The final status contains only the change files in evidence/files.txt.
