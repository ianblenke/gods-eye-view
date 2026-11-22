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
The thumbnail loader MUST start a new fetch when the caller requests the day again after an external AbortError.
Origin: spec-first

#### Scenario: Start the thumbnail again `recent-imagery-053`
- **WHEN** a thumbnail fetch throws an external AbortError
- **THEN** the loader removes the stale entry
- **AND** the loader starts a new fetch when the caller requests the day again
- **AND** the loader does not remove a new entry when a late old fetch ends
- **AND** the loader keeps the proof of a present day after a loader cancellation

### Requirement: Reject parent product keys
The model MUST accept only keys on the product table itself.
Origin: spec-first

#### Scenario: Reject parent product keys `recent-imagery-054`
- **WHEN** the product key comes from a parent object, such as `__proto__`, `constructor`, or `toString`
- **THEN** the model rejects the key as an unknown product
- **AND** the model gives empty granule groups, no `START HERE` candidate, and an empty readout
- **AND** the model throws TypeError from both image URL builders
- **AND** the model does not read a parent product getter

### Requirement: Reject invalid footprint points
The model MUST exclude footprints with coordinates that are not finite numbers.
Origin: spec-first

#### Scenario: Exclude invalid footprints `recent-imagery-056`
- **WHEN** a footprint point contains a latitude or longitude that is not a finite number
- **THEN** the footprint gives no coverage proof
- **AND** the model gives unknown coverage without another valid footprint
- **AND** the model can give full coverage from another valid footprint
- **AND** the model gives unknown coverage for a footprint with an absent point

