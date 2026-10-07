## MODIFIED Requirements

### Requirement: Keep panel scroll position
The recent imagery feature MUST keep panel scroll position.
Origin: spec-first

#### Scenario: Keep panel scroll position `recent-imagery-050`
- **WHEN** the panel refreshes its content
- **THEN** it restores the body scroll position
- **AND** after DETAILS opens, the panel sends the scroll request after it restores the body scroll position

## ADDED Requirements

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

### Requirement: Show the DETAILS card
The panel MUST move the body to show the DETAILS card when DETAILS opens.
Origin: spec-first

#### Scenario: Show the DETAILS card when DETAILS opens `recent-imagery-055`
- **WHEN** DETAILS opens with a body top of 10 pixels, a viewport height of 100 pixels and a border of 2 pixels
- **THEN** the panel changes scrollTop from 0 to 68 for a card top of 120 pixels and a height of 60 pixels
- **AND** the panel changes scrollTop from 68 to 46 for a card top of -10 pixels
- **AND** without a border, the panel changes scrollTop from 40 to 20 for a card top of -10 pixels
- **AND** a viewport height of zero keeps the body scroll position
- **AND** a card without a getBoundingClientRect method keeps the body scroll position
- **AND** a scroller without a viewport height value keeps the body scroll position
- **AND** a card inside the view keeps the body scroll position
- **AND** the panel does not repeat the scroll request after a content update
- **AND** the panel keeps the body scroll position when DETAILS closes

### Requirement: Reject invalid footprint points
The model MUST exclude footprints with coordinates that are not finite numbers.
Origin: spec-first

#### Scenario: Exclude invalid footprints `recent-imagery-056`
- **WHEN** a footprint point contains a latitude or longitude that is not a finite number
- **THEN** the footprint gives no coverage proof
- **AND** the model gives unknown coverage without another valid footprint
- **AND** the model can give full coverage from another valid footprint
- **AND** the model gives unknown coverage for a footprint with an absent point
