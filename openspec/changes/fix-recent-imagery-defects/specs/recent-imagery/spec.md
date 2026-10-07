## MODIFIED Requirements

### Requirement: Keep panel scroll position
The recent imagery feature MUST keep panel scroll position.
Origin: spec-first

#### Scenario: Keep panel scroll position `recent-imagery-050`
- **WHEN** the panel refreshes its content
- **THEN** it restores the body scroll position unless DETAILS opens
- **AND** after DETAILS opens, it keeps the position from the card reveal

## ADDED Requirements

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
