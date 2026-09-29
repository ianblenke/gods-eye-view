## MODIFIED Requirements

### Requirement: Camera panel
The layer MUST show the detail and the video of the selected system in a panel, and MUST hide the panel when the selection ends.
Origin: spec-first

#### Scenario: Show and hide the panel with the selection `osh-086`
- **WHEN** the user selects a system or a feature, and later selects nothing
- **THEN** the layer shows the panel host while it has a detail for the selection, and the detail host has that detail
- **AND** the layer hides the panel host and empties the detail host when the selection ends

#### Scenario: Play the video of the selected system `osh-087`
- **WHEN** the datastreams of the selected system have a datastream with `video: true`
- **THEN** the layer starts one video stream for the first such datastream, and it creates one video view and one player
- **AND** the layer passes each message of the stream to the player
- **AND** the view shows the name of the datastream, or its id when it has no name, and the status of the player
- **AND** the view shows the title `Video` when the name that the layer gives it is empty
- **AND** a new selection, a click on empty space and `destroy()` each close the video stream and the player, and remove the view
- **AND** the event `down` shows the status `reconnecting`, and the event `unsupported` shows the status `unavailable` and closes the stream
- **AND** the event `open` shows the last status of the player again
- **AND** the layer starts no video stream when the player reports the status `unsupported`
- **AND** the layer starts no video stream when the source has no `openVideo()`, or when the page has no video host

#### Scenario: Show a video datastream in the detail `osh-088`
- **WHEN** the detail has a datastream with `video: true`
- **THEN** its block shows the name, or the id when it has no name, and the word `Video`
- **AND** the block shows no row `No data`, no time and no age

#### Scenario: Find the hosts of the panel `osh-089`
- **WHEN** the default layer looks for its hosts in a page
- **THEN** it uses the elements with the ids `osh-panel`, `osh-panel-detail` and `osh-panel-video`
- **AND** it uses no host when there is no document, or when the page has no element for an id

#### Scenario: Treat the panel as an occluder of the world overlay `osh-093`
- **WHEN** the world overlay reads its list of occluder selectors
- **THEN** the list has `#osh-panel`, the selector of the panel host
- **AND** the world overlay places a label or a card clear of an element of the list when it can

#### Scenario: Keep the panel in the page and hidden at the start `osh-094`
- **WHEN** a test expands `index.html` with its component templates, as the build does, and reads `style.css` with the files that it imports
- **THEN** the page has one `aside` element with the id `osh-panel` and the attribute `hidden`
- **AND** that element has the class `osh-panel`
- **AND** the elements with the ids `osh-panel-video` and `osh-panel-detail` are inside that element
- **AND** each of the three ids is on one element only
- **AND** the style sheets give the display `none` to an element that has the class `osh-panel` and the attribute `hidden`

#### Scenario: Play the matched camera's video when the selected system has none `osh-097`
- **WHEN** the datastreams of the selected system have no datastream with `video: true`
- **THEN** the layer finds a system record with the same number token as the selected system's own name
- **AND** a number token is the first run of digits in a name
- **AND** the matched system's own name also has the word "camera"
- **AND** when more than one system matches, the layer keeps the first one in the order it read the system records
- **AND** when a system matches, the layer reads its datastreams
- **AND** the layer starts the video of the matched system's first datastream with `video: true`, the same way `osh-087` starts one
- **AND** the view shows the matched system's own name, not the selected system's name
- **AND** when the selected system's own name has no number, or no system matches, the layer starts no video
- **AND** the layer starts no video when the matched system's own datastreams have no datastream with `video: true`
- **AND** the layer starts no video when the matched system's own datastreams answer needs a key
