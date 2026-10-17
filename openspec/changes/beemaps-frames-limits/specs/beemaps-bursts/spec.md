## MODIFIED Requirements

### Requirement: Quote
A press of the chip "quote" MUST ask the server for the price of a burst in the box around the centre of the view. The box MUST be the box of 4 km² that the function `viewBox` builds. Each corner of the box MUST stay within the latitudes -80 and 80 degrees. The quote request MUST contain the box and nothing else. A quote MUST cost nothing and MUST NOT start a burst.
Origin: spec-first

#### Scenario: Ask for the quote of the view box `beemaps-bursts-006`
- **WHEN** a test enables the layer and presses "quote" with the view centre at 59.9976 degrees north and 10.0031 degrees east
- **THEN** the source gets one `quote` call with the box [9.987014, 59.991007, 10.022986, 60.008993] and the field `signal`, and no other field
- **AND** until the answer comes, the chip "quote" has the label "Quoting…", is disabled and has `busy` true
- **AND** a second press of the chip in that time sends no call
- **AND** in that time the chip "list" is disabled, and not busy

#### Scenario: Show the quote `beemaps-bursts-007`
- **WHEN** the source answers a quote with the quoteId `a1b2c3d4e5f60718293a4b5c6d7e8f90`, 125 credits, 4 km² and 120 seconds, with 0 credits used of 625
- **THEN** the chips are "confirm:a1b2c3d4e5f60718293a4b5c6d7e8f90" with the label "Confirm: 125 credits, 4 km²", "cancel" with the label "Cancel quote" and "list", in that order
- **AND** the info text is "Quote: 125 credits for 4 km² · credits used today 0 of 625 · valid for 120 seconds"
- **AND** the source gets no `confirm` call
- **AND** the Confirm chip is not busy, and the chip "cancel" is enabled
- **AND** the data source has one entity with the id "beemaps-bursts:quote" and a rectangle of the box in the answer
- **AND** an area of 3.998 km² in the answer gives the label "Confirm: 125 credits, 3.998 km²"
- **AND** the layer asks the random source for one idempotency key when this answer arrives, and not when the person presses "quote"

#### Scenario: Refuse a view that gives no box `beemaps-bursts-008`
- **WHEN** a test presses "quote" with the view at the sky, at the latitude 80.5 and at the longitude 179.999
- **AND** the test presses "quote" with the view at the latitude -79.999 or 79.996, where the box crosses -80 or 80
- **THEN** each press shows a message and sends no `quote` call
- **AND** the sky gives "Point the view at the ground and press again."
- **AND** each latitude gives "Move the view to a latitude from -79.99 to 79.99 degrees and press again."
- **AND** a canvas with no size, and a pick that fails, also give the text for the sky
- **AND** the layer picks the point at the middle of the canvas on the ellipsoid of the globe
- **AND** a viewer with no scene gives the sky text, and a viewer with no globe picks on the default ellipsoid
- **AND** the longitude gives "Move the view away from the 180th meridian and press again."
- **AND** the view at the latitude 79.9 gives a quote request

#### Scenario: Show each error of a quote `beemaps-bursts-009`
- **WHEN** the source answers a quote with an error, or with an answer that the layer cannot read
- **THEN** the message is the text of scenario 027 for the error and the layer keeps no quote
- **AND** the chip "quote" is enabled again and no confirm chip is shown
- **AND** the layer sends no call again by itself
- **AND** a source that throws gives the text for "unreachable"
- **AND** `disable` aborts a quote request that is open, and the late answer of that request changes nothing

#### Scenario: End the quote when its time is over `beemaps-bursts-010`
- **WHEN** a quote with 120 seconds is shown and the clock moves by 120 seconds
- **THEN** the layer keeps no quote, the box entity is gone and the chips are "quote" and "list"
- **AND** the message is "The quote ended. Press Quote burst here again."
- **AND** the layer starts the timer at the time of the answer and clears it when the quote is cancelled, confirmed or cleared by `disable`
- **AND** a press of the Confirm chip at or after the end, before the timer ran, sends no `confirm` call
- **AND** that press gives the same text and the same state

#### Scenario: Cancel the quote `beemaps-bursts-011`
- **WHEN** a quote is shown and a person presses "cancel"
- **THEN** the layer keeps no quote, the box entity is gone, the timer is cleared and the chips are "quote" and "list"
- **AND** a call of the `onClick` function of the old Confirm chip sends no `confirm` call
- **AND** a new quote gets a new quoteId and a new Confirm chip id, so a press on the old chip finds no chip
