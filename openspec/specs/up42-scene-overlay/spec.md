# up42-scene-overlay Specification

## Purpose
Describe how the UP42 layer places optional scene images on their footprints and releases each image after use.
## Requirements
### Requirement: Session image option
The layer MUST supply a session image option that starts off and adds ground images without a change to the default card path.
Origin: spec-first

#### Scenario: Keep images off at the start `up42-scene-overlay-001`
- **WHEN** the layer gets its first answer
- **THEN** the image option is off and sends no image request
- **AND** selection keeps the thumbnail card path

#### Scenario: Control the image option `up42-scene-overlay-002`
- **WHEN** the enabled layer has a thumbnail scene and the credential status is configured or unknown
- **THEN** the second chip has id "images" and label "Show images"
- **AND** a press changes its label to "Hide images"; a second press restores "Show images"

#### Scenario: Omit an unavailable option `up42-scene-overlay-003`
- **WHEN** no answer exists, the server reports no credentials, or no scene has a true thumbnail flag
- **THEN** the enabled layer supplies only the search chip
- **AND** the image chip appears only with a thumbnail scene when the credential status is configured or unknown
- **AND** an old image handler does nothing when the option is unavailable or the layer is off

#### Scenario: Request the newest images first `up42-scene-overlay-004`
- **WHEN** the option starts with 30 thumbnail scenes with distinct dates
- **THEN** requests name scene-01 through scene-24 in that order, from newest to oldest
- **AND** scene-25 through scene-30 send no request

#### Scenario: Order equal dates by id `up42-scene-overlay-005`
- **WHEN** scenes have equal time values in milliseconds
- **THEN** the image queue orders their ids as "a", "b", "c"
- **AND** the queue puts greater time values first, then the id

#### Scenario: Limit active requests `up42-scene-overlay-006`
- **WHEN** 24 image requests wait for their answers
- **THEN** at most 4 requests run at one time
- **AND** each end starts the next request until the queue is empty

#### Scenario: Count image failures `up42-scene-overlay-007`
- **WHEN** one of three thumbnail requests fails
- **THEN** two images stay and the readout ends with "Images shown: 2; failed: 1."
- **AND** the layer sends no retry after an update or a selection

#### Scenario: Count each error `up42-scene-overlay-008`
- **WHEN** a thumbnail request rejects or image creation fails
- **THEN** the scene has no image and the failed count increases by 1
- **AND** the readout contains no source error text

#### Scenario: Draw the footprint image `up42-scene-overlay-009`
- **WHEN** a thumbnail request succeeds
- **THEN** one polygon uses all vertices of that scene ring in their original order
- **AND** its image material uses an object URL, transparent true and white with alpha 0.85

#### Scenario: Keep the newest image on top `up42-scene-overlay-010`
- **WHEN** three images have ranks from newest to oldest
- **THEN** their polygon zIndex values are 3, 2 and 1
- **AND** each polygon clamps to the ground without a fixed height

#### Scenario: Keep the footprint outlines `up42-scene-overlay-011`
- **WHEN** the option shows images and a person selects a scene
- **THEN** all footprint outlines stay above the images with zIndex 25
- **AND** the selected outline keeps width 3 and yellow; other outlines keep width 2 and blue

#### Scenario: Select without a card `up42-scene-overlay-012`
- **WHEN** a person selects scenes while the option is on
- **THEN** selection updates the outline and the list but creates no card entry
- **AND** the image and its material stay unchanged, also for a scene with no thumbnail
- **AND** each selected outline uses width 3 and yellow; each previous selection returns to width 2 and blue
- **AND** a null selection returns all outlines to width 2 and blue

#### Scenario: Release images after a new answer `up42-scene-overlay-013`
- **WHEN** a new search answer arrives while the option is on
- **THEN** all old image signals abort, all old object URLs revoke, and all old image entities disappear
- **AND** the option stays on and requests the thumbnails when the new answer has thumbnail scenes
- **AND** an answer with no thumbnail scene switches the option off and removes the image chip

#### Scenario: Release images after a second press `up42-scene-overlay-014`
- **WHEN** a person switches the image option off
- **THEN** all image signals abort, all object URLs revoke, and all image entities disappear
- **AND** footprints stay; a later selection uses the card path

#### Scenario: Release images on disable `up42-scene-overlay-015`
- **WHEN** a person disables the layer with images and requests
- **THEN** all image signals abort, all object URLs revoke, and all image entities disappear
- **AND** enable starts with the option off and no answer

#### Scenario: Release images on destroy `up42-scene-overlay-016`
- **WHEN** a person destroys the layer with images and requests
- **THEN** all image signals abort, all object URLs revoke, and all image entities disappear
- **AND** a second destroy does nothing

#### Scenario: Ignore late image answers `up42-scene-overlay-017`
- **WHEN** an image answer arrives after release
- **THEN** no object URL, image entity or card comes from that answer
- **AND** a late rejection also changes nothing

#### Scenario: Remove a card before images `up42-scene-overlay-018`
- **WHEN** a card shows or its request runs when the option starts
- **THEN** the card clears and its bitmap closes, or its request aborts
- **AND** a late bitmap closes and creates no card

#### Scenario: Keep images after a search failure `up42-scene-overlay-019`
- **WHEN** a search fails while the option is on
- **THEN** the current images and selected outline stay
- **AND** the readout keeps the image counts after the fixed search message

#### Scenario: Keep the scene record shape `up42-scene-overlay-020`
- **WHEN** the source normalizes scenes for the image queue
- **THEN** the public scene record keeps its current fields
- **AND** the image queue uses the time value from the source

#### Scenario: Reject a blob that cannot decode `up42-scene-overlay-021`
- **WHEN** a thumbnail body passes the server checks but its decode rejects or returns null
- **THEN** the readout ends with "Images shown: 0; failed: 1."
- **AND** the scene has no image entity or object URL
- **AND** each successful decode closes its bitmap before the layer creates the object URL
- **AND** each decode result after release adds no image entity or object URL
- **AND** each bitmap from a late decode closes
