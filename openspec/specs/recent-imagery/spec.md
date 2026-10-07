# recent-imagery Specification

## Purpose
Let a person select a box on the globe, search recent satellite imagery days for it, compare two days, and export the result.
## Requirements
### Requirement: Read granule facts
The recent imagery feature MUST read granule facts.
Origin: backfill

#### Scenario: Read granule facts `recent-imagery-001`
- **WHEN** CMR returns granule records
- **THEN** the parser returns valid times, cloud values and footprint points
- **AND** the rectangle path rejects a ring with only three valid corners

### Requirement: Build catalog URLs
The recent imagery feature MUST build catalog URLs.
Origin: backfill

#### Scenario: Build catalog URLs `recent-imagery-002`
- **WHEN** the search has a product and box
- **THEN** the URL names the collection, box, time window and page size
- **AND** the page size is 200
- **AND** a Date clock keeps its millisecond value

### Requirement: Combine source results
The recent imagery feature MUST combine source results.
Origin: backfill

#### Scenario: Combine source results `recent-imagery-003`
- **WHEN** one HLS collection fails
- **THEN** the search keeps the other collection and VIIRS days with an error entry

### Requirement: Reject invalid search input
The recent imagery feature MUST reject invalid search input.
Origin: backfill

#### Scenario: Reject invalid search input `recent-imagery-004`
- **WHEN** the box or clock is invalid
- **THEN** the search rejects the input before a request
- **AND** a clock error gives a TypeError with a clock message

### Requirement: Read catalog pages
The recent imagery feature MUST read catalog pages.
Origin: backfill

#### Scenario: Read catalog pages `recent-imagery-005`
- **WHEN** CMR returns full pages with a cursor
- **THEN** the search sends the cursor and stops at the record cap
- **AND** the default record cap is 2000

### Requirement: Validate box bounds
The recent imagery feature MUST validate box bounds.
Origin: backfill

#### Scenario: Validate box bounds `recent-imagery-006`
- **WHEN** the box crosses a limit or has zero area
- **THEN** the model returns the applicable refusal
- **AND** the layer snapshot gives sizes for a valid box and null for an absent box

### Requirement: Measure box and view size
The recent imagery feature MUST measure box and view size.
Origin: backfill

#### Scenario: Measure box and view size `recent-imagery-007`
- **WHEN** the model has a box or camera dimensions
- **THEN** it measures the box span and bounds the fit height from 5000 to 400000 meters
- **AND** the height calculation uses a 400 kilometer target for the view width
- **AND** invalid view data uses a square view with a 60 degree field angle

### Requirement: Make a box from a pin
The recent imagery feature MUST make a box from a pin.
Origin: backfill

#### Scenario: Make a box from a pin `recent-imagery-008`
- **WHEN** the model has a valid map pin
- **THEN** it makes a 10 kilometer square or returns null if the box cannot pass validation

### Requirement: Convert box coordinates
The recent imagery feature MUST convert box coordinates.
Origin: backfill

#### Scenario: Convert box coordinates `recent-imagery-009`
- **WHEN** the model gets radians or share coordinates
- **THEN** it converts radians to degrees and rounds share coordinates at degrees times 100000

### Requirement: Check calendar days
The recent imagery feature MUST check calendar days.
Origin: backfill

#### Scenario: Check calendar days `recent-imagery-010`
- **WHEN** the model gets a day or candidate key
- **THEN** it accepts real UTC days and rejects invalid days or unknown products
- **AND** it rejects invalid dates at both ends of the four digit year range
- **AND** Date timestamps keep their UTC calendar value

### Requirement: Group and order days
The recent imagery feature MUST group and order days.
Origin: backfill

#### Scenario: Group and order days `recent-imagery-011`
- **WHEN** granules or candidate lists share a day
- **THEN** the model groups by product and day and keeps the first duplicate key
- **AND** only finite cloud numbers form the cloud range
- **AND** a start time that the model cannot read gives no time range

### Requirement: List overview days
The recent imagery feature MUST list overview days.
Origin: backfill

#### Scenario: List overview days `recent-imagery-012`
- **WHEN** the model has a valid date
- **THEN** it lists recent VIIRS days with unknown availability and full coverage

### Requirement: Sample footprint coverage
The recent imagery feature MUST sample footprint coverage.
Origin: backfill

#### Scenario: Sample footprint coverage `recent-imagery-013`
- **WHEN** the model has finite footprint polygons and a box
- **THEN** it checks the corners and center of a valid box against the polygon union
- **AND** it reports full coverage if every sample passes a point test, or partial coverage if some samples do not
- **AND** an invalid box or absent valid polygon gives unknown coverage

### Requirement: Select START HERE
The recent imagery feature MUST select START HERE.
Origin: backfill

#### Scenario: Select START HERE `recent-imagery-014`
- **WHEN** the model has cloud-free, cloudy, partial or overview days
- **THEN** it selects whole box HLS coverage before partial coverage and excludes empty days
- **AND** it rejects products with no model entry and HLS days without granules

### Requirement: Format the day readout
The recent imagery feature MUST format the day readout.
Origin: backfill

#### Scenario: Format the day readout `recent-imagery-015`
- **WHEN** the model has a candidate
- **THEN** it reports UTC time, age, sensor, resolution and scene cloud

### Requirement: Build image URLs
The recent imagery feature MUST build image URLs.
Origin: backfill

#### Scenario: Build image URLs `recent-imagery-016`
- **WHEN** the model has a product, day and box
- **THEN** it puts tile y before x and snapshot coordinates in south, west, north, east order

### Requirement: Order thumbnail requests
The recent imagery feature MUST order thumbnail requests.
Origin: backfill

#### Scenario: Order thumbnail requests `recent-imagery-017`
- **WHEN** the strip has a focus and visible range
- **THEN** the model puts focus first, then visible neighbors, then extra cards
- **AND** the layer updates the request range if only its first or last card changes
- **AND** the thumbnail order has each index once even if the visible bounds give different numeric values

### Requirement: Own and restyle image slots
The recent imagery feature MUST own and restyle image slots.
Origin: backfill

#### Scenario: Own and restyle image slots `recent-imagery-018`
- **WHEN** a slot gets a day and then the same day
- **THEN** the renderer owns one bounded provider and changes its alpha and split

### Requirement: Bound image ownership
The recent imagery feature MUST bound image ownership.
Origin: backfill

#### Scenario: Bound image ownership `recent-imagery-019`
- **WHEN** slots get rapid day changes
- **THEN** the renderer owns at most two layers and releases old layers
- **AND** the renderer sends `recent-imagery-destroy` when it stops, if either slot has an image
- **AND** a destroyed renderer rejects an image after a host update

### Requirement: Move images to a new host
The recent imagery feature MUST move images to a new host.
Origin: backfill

#### Scenario: Move images to a new host `recent-imagery-020`
- **WHEN** the image host changes
- **THEN** the renderer rebuilds layers in the new collection and clears the old collection

### Requirement: Limit tile requests
The recent imagery feature MUST limit tile requests.
Origin: backfill

#### Scenario: Limit tile requests `recent-imagery-021`
- **WHEN** tile requests reach the limit
- **THEN** the renderer defers extra work and requests one frame when work settles

### Requirement: Share one tile retry timer
The recent imagery feature MUST share one tile retry timer.
Origin: backfill

#### Scenario: Share one tile retry timer `recent-imagery-022`
- **WHEN** both providers defer tiles
- **THEN** the renderer schedules one delayed frame and cancels it on destroy

### Requirement: Read thumbnail proof
The recent imagery feature MUST read thumbnail proof.
Origin: backfill

#### Scenario: Read thumbnail proof `recent-imagery-023`
- **WHEN** a thumbnail response has Data-Present
- **THEN** the loader reports present or empty and keeps acquisition time

### Requirement: Bound and order thumbnail work
The recent imagery feature MUST bound and order thumbnail work.
Origin: backfill

#### Scenario: Bound and order thumbnail work `recent-imagery-024`
- **WHEN** thumbnail requests exceed the fetch limit
- **THEN** the loader starts queued work by priority and uses the focus order
- **AND** the smallest priority number starts first among queued requests

### Requirement: Keep day proof after image eviction
The recent imagery feature MUST keep day proof after image eviction.
Origin: backfill

#### Scenario: Keep day proof after image eviction `recent-imagery-025`
- **WHEN** decoded images exceed the limit
- **THEN** the loader revokes the least recently used images until the cache meets its limit and keeps the day proof
- **AND** an image eviction does not send a day update for an empty day
- **AND** each subscriber gets the state change

### Requirement: Cancel thumbnail work
The recent imagery feature MUST cancel thumbnail work.
Origin: backfill

#### Scenario: Cancel thumbnail work `recent-imagery-026`
- **WHEN** the loader cancels an active request
- **THEN** it discards late results and starts queued work after the request settles
- **AND** a URL callback while the loader clears images does not start a queued day that the call removed

### Requirement: Release thumbnail images
The recent imagery feature MUST release thumbnail images.
Origin: backfill

#### Scenario: Release thumbnail images `recent-imagery-027`
- **WHEN** the loader clears or ends
- **THEN** it revokes all loaded images

### Requirement: Select or reject a box
The recent imagery feature MUST select or reject a box.
Origin: backfill

#### Scenario: Select or reject a box `recent-imagery-028`
- **WHEN** the person selects a box or uses the view
- **THEN** the layer searches a valid box and keeps a refusal with a fit action for an oversized box
- **AND** a tool handler that is not a function does not cause a callback
- **AND** ZOOM IN returns null if the flight method or coordinate placement method is absent

### Requirement: Search and preview a day
The recent imagery feature MUST search and preview a day.
Origin: backfill

#### Scenario: Search and preview a day `recent-imagery-029`
- **WHEN** the catalog returns days or an error
- **THEN** the layer gives the catalog result and previews START HERE for valid days
- **AND** its overview note appears only for an unknown day from an active source
- **AND** a repeated box starts another search after an empty catalog result
- **AND** the snapshot has the UTC readout of its focus
- **AND** an empty HLS snapshot does not read the clock for its readout
- **AND** the same box does not start another search while an HLS request is active
- **AND** ENABLE does not repeat a search when the catalog has days
- **AND** a preview with a null key does not remove the current image
- **AND** a search result that disables the layer does not show an image or request thumbnails

### Requirement: Pin days in image slots
The recent imagery feature MUST pin days in image slots.
Origin: backfill

#### Scenario: Pin days in image slots `recent-imagery-030`
- **WHEN** the person assigns a day or selects a mode
- **THEN** the day occupies at most one slot and replaces the previous pin
- **AND** an invalid mode does not change the current mode
- **AND** IMAGE can preview a day from the B pin
- **AND** a mode value that reads as an integer and then as a fraction does not change the mode
- **AND** a disabled layer rejects a preview even if its search result still has that day

### Requirement: Start and swap a comparison
The recent imagery feature MUST start and swap a comparison.
Origin: backfill

#### Scenario: Start and swap a comparison `recent-imagery-031`
- **WHEN** the person starts or swaps a live comparison
- **THEN** the layer splits the images and resets a new comparison to the center
- **AND** a single B image cannot form an A and B comparison
- **AND** BASEMAP without an A image has no swipe
- **AND** two pins do not allow another preview
- **AND** a tileset host does not allow a live swipe
- **AND** the change from IMAGE to AB does not show the B preview in slot A
- **AND** the change from IMAGE to AB keeps a single B image without a swipe
- **AND** a thumbnail callback that changes the mode to IMAGE does not leave an AB swipe
- **AND** DESTROY does not allow SWAP even if a renderer callback calls ENABLE
- **AND** the layer rejects SWAP after a lease callback and a renderer callback destroy it
- **AND** a preview timer does not add a null slot after a thumbnail callback fills both pins

### Requirement: Hold and release the Esri lease
The recent imagery feature MUST hold and release the Esri lease.
Origin: backfill

#### Scenario: Hold and release the Esri lease `recent-imagery-032`
- **WHEN** the layer shows an image or clears the last image
- **THEN** it holds the lease for the image and releases it when the last image leaves
- **AND** the layer hides both image slots when it stops
- **AND** its borrowed Esri flag needs a Google 3D origin and the same active map as the ready lease
- **AND** a ready lease without a map ID does not mark Esri as borrowed
- **AND** a new image gets a lease after a controller joins an empty scene
- **AND** a controller that joins after an image appears does not get a comparison lease on the next mode change
- **AND** a lease that completes after its controller destroys the layer does not activate a comparison
- **AND** a new lease without a result does not mark Esri as borrowed after an old map result
- **AND** a ready result without a lease does not mark Esri as borrowed
- **AND** a map callback does not end a lease while an earlier lease waits to end

### Requirement: Report comparison refusal
The recent imagery feature MUST report comparison refusal.
Origin: backfill

#### Scenario: Report comparison refusal `recent-imagery-033`
- **WHEN** the lease cannot serve a comparison
- **THEN** the layer reports the refusal and keeps images without a swipe
- **AND** the tileset host note waits for a successful lease
- **AND** its suspended flag is true only after the lease is ready and a swipe exists
- **AND** a ready result that causes a rejected lease does not activate a swipe

### Requirement: Handle a change to Google 3D
The recent imagery feature MUST handle a change to Google 3D.
Origin: backfill

#### Scenario: Handle a change to Google 3D `recent-imagery-034`
- **WHEN** the controller switches to Google 3D with imagery active
- **THEN** the layer takes Esri for a manual switch and removes the swipe for an automatic switch
- **AND** another controller update for the same automatic switch does not send a new state update
- **AND** DESTROY does not allow another Esri lease on a map change, even if a renderer callback calls ENABLE
- **AND** a controller callback that removes both images does not read the switch generation

### Requirement: Follow the image host
The recent imagery feature MUST follow the image host.
Origin: backfill

#### Scenario: Follow the image host `recent-imagery-035`
- **WHEN** the image host changes
- **THEN** the layer moves drapes through the controller callback or stats poll
- **AND** a change to the host collection or kind sends a state update
- **AND** the map callback does not move a host while the layer is off
- **AND** its host error has a value only while the layer is on
- **AND** an absent host gives "Hidden by this map source · choose a globe map" while the layer is on
- **AND** an attached tileset does not move the host while the layer is off
- **AND** an unchanged tileset host does not send another state update
- **AND** stats check the host if a subscription returns a result that is not a function
- **AND** a map callback after the layer calls DESTROY does not change the host, even if a renderer callback calls ENABLE

### Requirement: Restore share state
The recent imagery feature MUST restore share state.
Origin: backfill

#### Scenario: Restore share state `recent-imagery-036`
- **WHEN** the layer gets share parameters or a new catalog
- **THEN** it restores the box, pins, mode and split, does not send them back, and removes absent catalog pins
- **AND** a direct control callback during this action does not publish user state
- **AND** a null or nonfinite split parameter keeps the current divider value
- **AND** a nonfinite split parameter does not change the divider source flag
- **AND** a mode parameter with the current value does not send renderer work
- **AND** a B parameter alone keeps the A pin
- **AND** an incorrect share pin key becomes null
- **AND** an absent catalog pin alone does not change the current focus
- **AND** a new catalog can remove either absent pin while it keeps the other pin
- **AND** a parameter change does not send renderer work while the layer is off
- **AND** a new search keeps focus on the B pin when slot A is empty
- **AND** a share mode that reads as AB and then as null does not change the current mode

### Requirement: Control imagery sources
The recent imagery feature MUST control imagery sources.
Origin: backfill

#### Scenario: Control imagery sources `recent-imagery-037`
- **WHEN** the person switches a source off
- **THEN** the layer hides its days and drapes and keeps the source state on its pins
- **AND** a source change keeps the preview timer for a day from the other source
- **AND** a source change calls a valid row listener and ignores a listener that is not a function
- **AND** a source that becomes active keeps the preview that waits after a catalog product change

### Requirement: Publish local image controls
The recent imagery feature MUST publish local image controls.
Origin: backfill

#### Scenario: Publish local image controls `recent-imagery-038`
- **WHEN** the person changes opacity or the divider
- **THEN** the layer changes image controls without a row update
- **AND** its snapshot keeps the new opacity and divider value
- **AND** each subscriber gets the current snapshot
- **AND** a destroyed layer does not publish local changes
- **AND** the layer does not call an absent state manager
- **AND** a layer without subscribers does not read the clock for a state update
- **AND** one clock step can complete a divider update and a focus preview

### Requirement: Use thumbnail proof for drapes
The recent imagery feature MUST use thumbnail proof for drapes.
Origin: backfill

#### Scenario: Use thumbnail proof for drapes `recent-imagery-039`
- **WHEN** pins change or a probe changes a day or confirms its state
- **THEN** the layer drapes present days and removes empty days from pins or automatic preview
- **AND** a new pin drape sends a thumbnail update and a full state update
- **AND** an unchanged probe does not repeat drape work on a globe when pins and previews stay the same
- **AND** without a host, a probe for a new preview does not repeat renderer work
- **AND** a followed day with new pixels sends a thumbnail update and a full state update
- **AND** each pin outside the visible strip gets a direct thumbnail request
- **AND** an empty automatic preview does not choose a day that a pin holds

### Requirement: Preview the focused day
The recent imagery feature MUST preview the focused day.
Origin: backfill

#### Scenario: Preview the focused day `recent-imagery-040`
- **WHEN** focus changes or the person clicks a day
- **THEN** the layer debounces arrow focus and follows an unknown day until its probe proves present
- **AND** arrow focus uses a 250 millisecond quiet period
- **AND** focus on a pin clears the preview in the other slot
- **AND** a probe does not start a followed preview after focus leaves that day
- **AND** an unknown followed day keeps its probe wait state
- **AND** a focus timer after the layer calls DESTROY does not change the preview, even if a renderer callback calls ENABLE
- **AND** a disabled layer does not set a preview timer even if its search result still has the focused day

### Requirement: Clear previews and box state
The recent imagery feature MUST clear previews and box state.
Origin: backfill

#### Scenario: Clear previews and box state `recent-imagery-041`
- **WHEN** the person presses Escape or CLEAR
- **THEN** Escape clears the preview first and CLEAR clears box state while mode and sources stay
- **AND** `clearPreview` returns true for a followed day
- **AND** a search result that clears the box does not show an image or request thumbnails

### Requirement: Keep focus across strip changes
The recent imagery feature MUST keep focus across strip changes.
Origin: backfill

#### Scenario: Keep focus across strip changes `recent-imagery-042`
- **WHEN** a day leaves the strip or a new box starts
- **THEN** the layer keeps a valid focus or moves to the nearest card, with ties toward the older day
- **AND** a new box removes old drapes at once
- **AND** focus on a null candidate key moves to the first card with a key
- **AND** a null candidate key does not cause an error or add a preview timer
- **AND** an equal distance with an index before the old focus does not replace the first nearest card
- **AND** the hidden count is zero when the panel shows empty days

### Requirement: Own the fixed panel
The recent imagery feature MUST own the fixed panel.
Origin: backfill

#### Scenario: Own the fixed panel `recent-imagery-043`
- **WHEN** the layer starts or ends
- **THEN** the panel uses fixed blocks and returns listeners and panel state on destroy
- **AND** an absent document factory or layer returns no panel
- **AND** panel cleanup clears each thumbnail URL
- **AND** a snapshot callback that destroys the panel does not change its mode field

### Requirement: Show day cards and slots
The recent imagery feature MUST show day cards and slots.
Origin: backfill

#### Scenario: Show day cards and slots `recent-imagery-044`
- **WHEN** the layer has candidate and pin state
- **THEN** the panel shows day facts, pin chips and mode slot labels
- **AND** it gives screen reader labels for card state, mode controls and export actions
- **AND** IMAGE keeps the B pin controls inactive
- **AND** a stable thumbnail keeps one image element
- **AND** an empty strip names its box, search, day and source state
- **AND** an empty day outside the map leaves the strip after its probe
- **AND** a preview slot without a key has the empty state

### Requirement: Use panel keys and clicks
The recent imagery feature MUST use panel keys and clicks.
Origin: backfill

#### Scenario: Use panel keys and clicks `recent-imagery-045`
- **WHEN** the person uses the strip keys or controls
- **THEN** the panel asks the layer to preview, pin or clear and applies Escape in order
- **AND** key repeat does not send another Enter preview request
- **AND** a pin action without a card key does not call the layer
- **AND** a state change during an arrow action can clear the strip without a scroll error
- **AND** an absent viewport width does not allow a strip scroll action
- **AND** Enter and pin keys on an empty strip do not start a preview or pin
- **AND** an arrow key on an empty strip keeps its default action
- **AND** S does not pin a day in A and B mode
- **AND** a key outside the strip clears the preview only for Escape
- **AND** Escape outside the strip cancels an active tool or clears a future preview
- **AND** an inactive B unpin control keeps the stored B pin
- **AND** a click outside ZOOM IN does not ask for a flight
- **AND** an empty day does not accept a key to pin it or remove the export error
- **AND** a disabled SWAP control does not call the layer
- **AND** a chip without a card does not call the layer or cause an error

### Requirement: Show guidance and the fit action
The recent imagery feature MUST show guidance and the fit action.
Origin: backfill

#### Scenario: Show guidance and the fit action `recent-imagery-046`
- **WHEN** the panel has state for the layer
- **THEN** the panel shows the notice and offers ZOOM IN for an oversized box
- **AND** it uses the warning style for an error and the information style for a notice
- **AND** its hint tells the person to zoom in or draw a smaller box for an oversized selection
- **AND** a disabled ZOOM IN control does not call the layer

### Requirement: Own the swipe divider
The recent imagery feature MUST own the swipe divider.
Origin: backfill

#### Scenario: Own the swipe divider `recent-imagery-047`
- **WHEN** a comparison becomes live
- **THEN** the panel creates the divider with mode labels and trades labels on SWAP
- **AND** a refresh with the same divider does not create another divider
- **AND** an inactive comparison removes the divider even if the shown image keys stay the same
- **AND** a snapshot value that destroys the panel while it refreshes does not create another divider

### Requirement: Export the slot image
The recent imagery feature MUST export the slot image.
Origin: backfill

#### Scenario: Export the slot image `recent-imagery-048`
- **WHEN** the panel has images or an export request
- **THEN** either shown image enables the opacity control
- **AND** an export request for a valid pin or preview downloads a PNG and revokes its object URL
- **AND** a duplicate export request returns false while the first export is active
- **AND** an active export request disables its button
- **AND** IMAGE does not export a stored B pin
- **AND** A and B mode exports a valid B pin
- **AND** an export without a box does not call fetch

### Requirement: Show image details
The recent imagery feature MUST show image details.
Origin: backfill

#### Scenario: Show image details `recent-imagery-049`
- **WHEN** the person opens DETAILS
- **THEN** the panel shows each note and the empty day control
- **AND** an offscreen DETAILS card causes a scroll request
- **AND** a refresh does not repeat the scroll request
- **AND** absent viewport or card dimensions do not allow the request
- **AND** the overview scale note needs a box and a positive box size

### Requirement: Keep panel scroll position
The recent imagery feature MUST keep panel scroll position.
Origin: spec-first

#### Scenario: Keep panel scroll position `recent-imagery-050`
- **WHEN** the panel refreshes its content
- **THEN** it restores the body scroll position unless DETAILS opens
- **AND** after DETAILS opens, it keeps the position from the card reveal

### Requirement: Report visible cards
The panel MUST report the visible range of day cards to the layer.
Origin: backfill

#### Scenario: Report visible cards `recent-imagery-051`
- **WHEN** the strip scrolls across day cards
- **THEN** the panel reports the first and last visible card
- **AND** it treats absent card dimensions as zero
- **AND** it does not report a range if every card lies outside the view
- **AND** a candidate without a card does not enter the visible range
- **AND** a zero length candidate list does not enter the visible range even if its forEach method supplies cards

### Requirement: Supply test values
The recent imagery test helper MUST supply response and day values.
Origin: backfill

#### Scenario: Supply test values `recent-imagery-052`
- **WHEN** a test requests helper values
- **THEN** successful and failed responses have default status codes 200 and 500
- **AND** a granule day has a cloud range, but an overview day has no cloud range
- **AND** the box tool doubles give input results, globe values and the live canvas event handler
- **AND** the renderer double moves both image slots to the next host
- **AND** the thumbnail double sends both subscribers the probe key

### Requirement: Start thumbnails after an external AbortError
The thumbnail loader MUST start a later request after an external AbortError.
Origin: spec-first

#### Scenario: Start the thumbnail again `recent-imagery-053`
- **WHEN** a thumbnail fetch throws AbortError without a loader cancellation
- **THEN** the loader removes the stale entry
- **AND** a later request starts another fetch
- **AND** a late old fetch does not remove a new entry
- **AND** a day with present proof keeps that proof after a fetch cancellation

### Requirement: Reject parent product keys
The model MUST accept only keys on the product table itself.
Origin: spec-first

#### Scenario: Reject parent product keys `recent-imagery-054`
- **WHEN** the product key comes from a parent object, such as `__proto__`, `constructor`, or `toString`
- **THEN** the model rejects the key as an unknown product
- **AND** granule groups stay empty, `START HERE` gives no candidate, and the readout stays empty
- **AND** both image URL builders throw TypeError
- **AND** the model does not read a parent product getter

### Requirement: Keep the DETAILS card position
The panel MUST keep the body position after DETAILS tries to show its card.
Origin: spec-first

#### Scenario: Keep the DETAILS card position `recent-imagery-055`
- **WHEN** DETAILS opens with a body top of 10, height of 100, and border of 2
- **THEN** a card top of 120 and height of 60 changes scrollTop from 0 to 68
- **AND** a card top of -10 changes scrollTop from 68 to 46
- **AND** without a border, a card top of -10 changes scrollTop from 40 to 20
- **AND** absent dimensions keep the position after the content update
- **AND** a content update does not repeat the card reveal
- **AND** DETAILS does not move the body when it closes

### Requirement: Reject invalid footprint points
The model MUST exclude footprints with coordinates that are not finite numbers.
Origin: spec-first

#### Scenario: Exclude invalid footprints `recent-imagery-056`
- **WHEN** a footprint point contains a latitude or longitude that is not a finite number
- **THEN** the footprint gives no coverage proof
- **AND** coverage is unknown without another valid footprint
- **AND** another valid footprint can give full coverage

