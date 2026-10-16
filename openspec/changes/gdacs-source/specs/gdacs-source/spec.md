## ADDED Requirements

### Requirement: Event fields
The GDACS provider MUST keep only the allowed fields of an event and MUST drop every other field of the record. It MUST build the report link itself from the type and the ids.

A record is an entry of the `features` list in a page of GDACS. An event is an entry of the `events` list in the document. A page request goes from the provider to GDACS. A browser request comes to the route. A refresh is the work of the provider that gets all pages and builds the document.
Origin: spec-first

#### Scenario: Keep the allowed fields of a flood `gdacs-source-001`
- **WHEN** the provider normalizes the record of the flood "Flood in Türkiye" with the event id 1104230 and the episode id 2
- **THEN** the event has exactly 18 fields
- **AND** these are `id`, `type`, `eventId`, `episodeId`, `name`, `alert`, `alertScore`, `current`, `country`, `iso3`, `from`, `to`, `modified`, `latitude`, `longitude`, `severity`, `origin` and `reportUrl`
- **AND** the `id` is "FL-1104230", the `type` is "FL", the `eventId` is 1104230 and the `episodeId` is 2
- **AND** the `name` is "Flood in Türkiye", the `alert` is "green", the `alertScore` is 1 and `current` is true
- **AND** the `country` is "Türkiye", the `iso3` is "TUR" and the `origin` is "GLOFAS"
- **AND** `from` is "2026-10-12T01:00:00.000Z", `to` is "2026-10-16T01:00:00.000Z" and `modified` is "2026-10-16T07:45:43.000Z"
- **AND** the latitude 41.1157 gives 41.116 and the longitude 28.9986 gives 28.999
- **AND** `severity` is null

#### Scenario: Drop the fields that are not on the list `gdacs-source-002`
- **WHEN** the provider normalizes a record that holds a value in each field of the next two lines
- **AND** the first group is `icon`, `iconoverall`, `htmldescription`, `description`, `glide`, `sourceid`, `polygonlabel` and `Class`
- **AND** the second group is `episodealertlevel`, `episodealertscore`, `istemporary`, `affectedcountries`, `countryonland`, `eventname` and `bbox`
- **AND** each of these values is a text that appears nowhere else in the record
- **THEN** the JSON text of the event holds none of these values
- **AND** the JSON text of the event holds none of the three links of the field `url`
- **AND** the provider lists the event with the `name` of the record

#### Scenario: Build the report link from the ids `gdacs-source-003`
- **WHEN** the provider normalizes a flood with the event id 1104230 and the episode id 2 whose feed link `url.report` points to "https://example.invalid/phish"
- **THEN** `reportUrl` is "https://www.gdacs.org/report.aspx?eventid=1104230&episodeid=2&eventtype=FL"
- **AND** the JSON text of the event does not hold "example.invalid"

### Requirement: Record rules
The provider MUST drop a record that is not an object, and a record whose `properties` value is not an object. It MUST drop a record whose type is not FL, DR, VO or TC. It MUST drop a record whose event id is not a JSON number that is a positive integer. It MUST drop a record whose episode id is not a JSON number that is a non-negative integer. It MUST drop a record whose alert level is not green, orange or red in any letter case.
Origin: spec-first

#### Scenario: Drop a record that has no properties object `gdacs-source-004`
- **WHEN** the provider normalizes a list that holds a number, a text, null and a list
- **AND** the list also holds a record with no `properties`, a record with `properties` null, a record with `properties` a list, and one valid record
- **THEN** the result lists only the valid record
- **AND** `counts.dropped` is 7 and `counts.total` is 1

#### Scenario: Drop a record with a wrong type, id or alert level `gdacs-source-005`
- **WHEN** the provider normalizes records with the types "EQ", "WF", "fl" and no type
- **AND** it normalizes records with the event ids 0, -1, 1.5, "7", null and no event id
- **AND** it normalizes records with the episode ids -1, 1.5, "2" and no episode id
- **AND** it normalizes records with the alert levels "Purple", 2, null and no alert level
- **THEN** the result lists none of these records
- **AND** `counts.dropped` counts each of them
- **AND** a record with the episode id 0, the alert level "Orange" and the type "DR" is valid, and its `alert` is "orange"

### Requirement: Position rules
The provider MUST list only events whose geometry is a point with two finite numbers, and MUST round the position to three decimals.
Origin: spec-first

#### Scenario: List only events with a valid position `gdacs-source-006`
- **WHEN** the provider normalizes records with no geometry, a geometry of type "Polygon", a geometry of type "MultiPoint", and a point with one number
- **AND** it normalizes records whose coordinates are not numbers, lie outside the valid range, or are 0 and 0
- **THEN** the result lists none of these records
- **AND** the latitudes -90 and 90 and the longitudes -180 and 180 are valid
- **AND** the positions (0, 5) and (5, 0) are valid
- **AND** the latitude 5.5555 becomes 5.556 and the latitude -0.0004 becomes 0
- **AND** the coordinates `[28.9986, 41.1157]` give the longitude 28.999 and the latitude 41.116

### Requirement: Time rules
The provider MUST take a valid time as UTC, also when the process has another time zone. It MUST set a time that is not valid to null. It MUST drop a record whose `fromdate` is not a valid time. It MUST keep an event whose `todate` or `datemodified` is not a valid time.

A valid time is a text of the form YYYY-MM-DDTHH:MM:SS with a real date and a real clock time. The form can end with a fraction of one to three digits and with the letter Z.
Origin: spec-first

#### Scenario: Read the times as UTC `gdacs-source-007`
- **WHEN** the test sets the time zone of the process to "Pacific/Kiritimati" and restores it after the test
- **AND** the provider normalizes records whose `todate` has the values "2026-10-12T01:00:00", "2026-10-12T01:00:00Z" and "2026-10-12T01:00:00.5"
- **AND** it normalizes records whose `todate` has the values "2026-10-12T01:00:00+02:00", "2026-02-30T00:00:00", "2026-13-40T00:00:00", "2026-10-12", an empty text and a value that is not text
- **THEN** `to` is "2026-10-12T01:00:00.000Z" for the first two, and "2026-10-12T01:00:00.500Z" for the third
- **AND** `to` is null for each of the other values, and the provider lists these events
- **AND** `modified` follows the same rules as `to`
- **AND** the provider drops a record whose `fromdate` is one of the values that give null, and `counts.dropped` counts it

### Requirement: Alert and current rules
The provider MUST write the alert level in lower case. It MUST set `current` to true only when the feed field `iscurrent` is the text "true" or the value true.
Origin: spec-first

#### Scenario: Set the alert level and the current flag `gdacs-source-008`
- **WHEN** the provider normalizes records with `iscurrent` "true", "false", "True", true, false, 1 and no value
- **THEN** `current` is true for the text "true" and for the value true, and false for the others
- **AND** `counts.current` counts the events with `current` true
- **AND** the alert levels "Green", "ORANGE" and "red" give "green", "orange" and "red"
- **AND** the `alertScore` 2 stays 2, and a score that is not a finite number gives null

### Requirement: Severity rules
The provider MUST round the severity value to a whole number. It MUST set `severity` to an object with `value`, `unit` and `text` in one case. The case is a unit that is not empty, a finite value, and a rounded value above 0. Otherwise it MUST set `severity` to null.
Origin: spec-first

#### Scenario: Keep a severity with a unit `gdacs-source-009`
- **WHEN** the provider normalizes the storm "Tropical Cyclone SIMON-26" with the severity 249.9984 and the unit "km/h"
- **AND** the severity text of the storm is "Tropical Storm (maximum wind speed of 250 km/h)"
- **THEN** `severity` has `value` 250 and `unit` "km/h"
- **AND** the `text` of `severity` is "Tropical Storm (maximum wind speed of 250 km/h)"
- **AND** the storm "Tropical Cyclone ONE-26" with the severity 120.3696 and the unit "km/h" gives `value` 120
- **AND** the drought "Drought in Southern India" with the severity 537380 and the unit "km2" gives `value` 537380

#### Scenario: Set the severity to null `gdacs-source-010`
- **WHEN** the provider normalizes a flood with the severity 0, the unit empty and the text "Magnitude 0 "
- **AND** it normalizes a volcano with the severity 0 and the unit and the text empty
- **AND** it normalizes storms with the unit "km/h" and the severity 0, 0.4, -5, the text "fast", and the value 1e999
- **AND** it normalizes a storm with the severity 100 and an empty unit
- **AND** it normalizes a storm with no `severitydata` and a storm whose `severitydata` is a list
- **THEN** `severity` is null for each of these events
- **AND** the provider lists each of these events

### Requirement: Text rules
The provider MUST clean each text field in this order. It MUST remove the control characters and the characters "<" and ">". Then it MUST replace each group of two or more spaces with one space. Then it MUST cut the text to its limit. Then it MUST remove the spaces at the start and at the end.

A control character is a character from U+0000 to U+001F or from U+007F to U+009F. The limits are 120 characters for the name and 80 for the country. They are 40 for the origin, 12 for the severity unit and 160 for the severity text.
Origin: spec-first

#### Scenario: Clean the names and the texts `gdacs-source-011`
- **WHEN** the provider normalizes the names "Eruption  Kanlaon" with two spaces and "Flood<b> in\u0007 X"
- **AND** it normalizes a name of three spaces, an empty name and a name that is not text
- **AND** it normalizes a name of 130 letters, a name of 120 letters, and a name of 119 letters, a space and 10 letters
- **THEN** the cleaned names are "Eruption Kanlaon" and "Floodb in X"
- **AND** the name of three spaces, the empty name and the name that is not text give the type label
- **AND** the type label is "Flood", "Drought", "Volcano" or "Tropical cyclone" for the type FL, DR, VO or TC
- **AND** the name of 130 letters gives exactly 120 letters, the name of 120 letters stays whole, and the last name gives 119 letters
- **AND** a country of 200 letters gives 80 letters, and an empty country or a country that is not text gives null
- **AND** an origin of 50 letters gives 40 letters, and an empty origin gives null
- **AND** a severity unit of 20 letters gives 12 letters, and a severity text of 200 letters gives 160 letters
- **AND** the `iso3` is null unless it is three capital letters

### Requirement: One event for each type and event id
The provider MUST check the rules of each record before it joins records. It MUST list one event for each pair of the type and the event id. It MUST keep the record with the highest episode id, and for equal episode ids the record with the latest `datemodified`. `counts.dropped` MUST count the records that the rules drop, and MUST NOT count a duplicate.
Origin: spec-first

#### Scenario: Join duplicates `gdacs-source-012`
- **WHEN** the pages hold the flood 1104230 with the episode 2, then with the episode 1, and then with the episode 2 again
- **THEN** the result holds one event of this flood, with the episode 2
- **AND** two records of the same episode with the `datemodified` times "2026-10-16T08:00:00" and "2026-10-16T07:00:00", in this order, give the record of 08:00
- **AND** the same two records in the other order give the record of 08:00
- **AND** the episode 3 of the flood has the alert level "Purple", and the episodes 1 and 2 are valid
- **AND** the result then holds the episode 2
- **AND** a drought and a flood with the same event id 7 are two events
- **AND** `counts.total` counts the listed events, and `counts.dropped` is 1 for the record with the alert level "Purple"

### Requirement: Order and size of the list
The provider MUST list the events with the latest `modified` first. An event with `modified` null MUST come last. Events with equal `modified` MUST follow the order of their `id`. The provider MUST list at most 500 events.
Origin: spec-first

#### Scenario: Order the events and bound the list `gdacs-source-013`
- **WHEN** page 1 holds 520 valid events with different `modified` times, listed with the oldest `modified` first, and the pages 2 to 5 answer 204
- **THEN** the result lists 500 events, and the first has the latest `modified`
- **AND** the last listed event has the 500th latest `modified`
- **AND** `counts.total` is 500 and `counts.dropped` is 0, and `counts.byType` and `counts.current` count only the listed events
- **AND** a page holds 3 events, and the first of the three has `modified` null
- **AND** that event is the last of the three in the result
- **AND** two events have the same `modified` time, and the input lists the event with the higher `id` first
- **AND** the result lists the event with the lower `id` first, with the ids compared as text

### Requirement: Route document
The route `/api/gdacs` MUST answer a GET request with one JSON document. It MUST refuse a method other than GET, a query and a sub-path.
Origin: spec-first

#### Scenario: Answer with the document `gdacs-source-014`
- **WHEN** a GET request with no query comes to the route and GDACS answers with one current flood
- **THEN** the status is 200, the header `Cache-Control` is "no-store" and the header `Content-Type` is "application/json"
- **AND** the body has `schemaVersion` 1, `stale` false, `unavailable` false and `reason` null
- **AND** the `source` is "GDACS (Global Disaster Alert and Coordination System)"
- **AND** the `attribution` is "GDACS, a cooperation framework of the United Nations and the European Commission"
- **AND** the `license` is "The European Commission legal notice licenses its content under CC BY 4.0. GDACS gives no separate license for the feed. Data of NOAA, JTWC, GloFAS, GDO and other centers keep their own terms. The provider shortens the data and rounds the positions."
- **AND** the `disclaimer` is "GDACS makes these estimates by machine, and an estimate can be wrong. Check each estimate before you act on it."
- **AND** the `coverage` is "Flood, drought, volcano and tropical cyclone events that were active from the date 14 days before the request. The provider does not list earthquakes and wildfires."
- **AND** `fetchedAt` is the time at which the refresh starts, also when the clock moves between two page requests
- **AND** `counts` has `total` 1, `current` 1, `dropped` 0, and `byType` with FL 1, DR 0, VO 0 and TC 0
- **AND** `events` holds the flood

#### Scenario: Refuse other methods `gdacs-source-015`
- **WHEN** a request uses a method other than GET
- **THEN** the status is 405 with the error `method_not_allowed`
- **AND** the provider sends no page request
- **AND** a POST request with a query gets the status 405, and not 400

#### Scenario: Refuse a query or a sub-path `gdacs-source-016`
- **WHEN** a GET request has a query, or has a path that is neither `/` nor the empty path, such as `/other`
- **THEN** the status is 400 with the error `invalid_gdacs_query`
- **AND** the provider sends no page request

### Requirement: Page request
The provider MUST send each page request to the fixed address of the GDACS event list. It MUST build the dates and the page number in code, with UTC dates. It MUST NOT follow a redirect. A page request MUST have exactly the options `method`, `redirect`, `signal` and `headers`.
Origin: spec-first

#### Scenario: Send the page request `gdacs-source-017`
- **WHEN** the test sets the time zone of the process to "Pacific/Kiritimati" and restores it after the test
- **AND** the clock is 2026-03-05T10:00:00Z and a browser request comes to the route
- **THEN** the first page request goes to "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;DR;VO;TC&fromdate=2026-02-19&todate=2026-03-05&alertlevel=green;orange;red&pagenumber=1"
- **AND** the page request uses the method GET and the option `redirect` with the value "error"
- **AND** the options of the page request are exactly `method`, `redirect`, `signal` and `headers`
- **AND** the page request has the headers `Accept` "application/json" and `User-Agent` "gods-eye-view-gdacs-proxy/1.0"
- **AND** the page request has a signal
- **AND** the provider sends no other request than the page requests
- **AND** a clock of 2026-01-10T23:59:59Z gives `fromdate` 2025-12-27 and `todate` 2026-01-10

### Requirement: Read the pages
The provider MUST fetch the pages in order from page 1. It MUST stop at a page that answers 204. It MUST stop at a page whose `features` list holds fewer than 100 entries, also when it drops some of them. It MUST stop after page 5.
Origin: spec-first

#### Scenario: Stop at the last page `gdacs-source-018`
- **WHEN** page 1 has 100 events and page 2 has 40 events
- **THEN** the provider sends two page requests and the result holds the 140 events
- **AND** the second page request has `pagenumber=2`
- **AND** when page 2 answers 204 with no body, the provider sends two page requests and the result holds the 100 events of page 1
- **AND** when page 1 answers 204, the result holds no event, `unavailable` is false, `stale` is false and `fetchedAt` is the time of the refresh
- **AND** in that case `counts` has `total` 0, `current` 0, `dropped` 0, and `byType` with FL 0, DR 0, VO 0 and TC 0
- **AND** when each of five pages has 100 events, the provider sends five page requests and no sixth request
- **AND** these five requests have the `pagenumber` values 1 to 5
- **AND** when page 1 has 100 entries and 2 of them are not valid, the provider asks for page 2

### Requirement: Source failure
The provider MUST treat a refresh as failed in each case that this requirement names. A page request fails when it cannot connect, when its status is not 200 or 204, or when its body is not valid JSON. It also fails when the body is not a feature collection, or when a page has more than 2 MiB. The refresh fails when GDACS does not send all pages in 30 seconds.

A feature collection is an object with `type` "FeatureCollection" and a `features` value that is a list. An empty body is not valid JSON. A redirect is a failure.
Origin: spec-first

#### Scenario: Fail on each kind of bad answer `gdacs-source-019`
- **WHEN** the test makes the fetch throw, or makes the response a redirect that throws, in turn
- **AND** the test makes the status 301, 404, 500 and 206 with a valid body, in turn
- **AND** the test makes a status 200 with an empty body and with the text "not json", in turn
- **AND** the test makes a status 200 with the bodies `{}`, `[]` and `null`, in turn
- **AND** the test makes a status 200 with the bodies `{"type":"FeatureCollection"}`, `{"type":"FeatureCollection","features":null}`, `{"type":"FeatureCollection","features":{}}` and `{"type":"Feature","features":[]}`, in turn
- **THEN** each of these cases is a failure, and the document says `unavailable` true when no good document exists
- **AND** a failure of page 2 after a good page 1 gives no document that holds only the events of page 1

### Requirement: Stale document
The provider MUST serve the last good document with `stale` true while that document is younger than 1 hour, when GDACS fails. Otherwise it MUST answer with `unavailable` true. It MUST NOT keep a failed refresh as a document.
Origin: spec-first

#### Scenario: Serve the last good document when GDACS fails `gdacs-source-020`
- **WHEN** GDACS fails after a good refresh
- **THEN** the provider answers with the last good document and `stale` true when that document is 59 minutes and 59 seconds old
- **AND** the provider answers with `unavailable` true when that document is 1 hour old
- **AND** an `unavailable` document has the status 200, `stale` false, `fetchedAt` null and the reason "GDACS unavailable"
- **AND** its `counts` has `total` 0, `current` 0 and `dropped` 0
- **AND** its `byType` has FL 0, DR 0, VO 0 and TC 0, and it holds no event
- **AND** the next request after a failure tries GDACS again

#### Scenario: Accept a page of exactly 2 MiB `gdacs-source-021`
- **WHEN** one refresh gets a page that is a feature collection of exactly 2 MiB
- **AND** another refresh gets a page with one byte more
- **THEN** the first refresh gives a document with `unavailable` false and `stale` false
- **AND** the second refresh fails, and its document says `unavailable` true and the reason "GDACS unavailable"

#### Scenario: Stop a refresh after 30 seconds `gdacs-source-022`
- **WHEN** a test gives the provider a fake timer, page 1 holds 100 events and page 2 does not answer
- **THEN** `setTimer` runs once with 30000 milliseconds
- **AND** the two page requests have the same `signal`
- **AND** when the timer callback runs, that signal aborts and the document says `unavailable` true
- **AND** `clearTimer` runs once with that timer after a good refresh, and once after a failed refresh

### Requirement: Cache and shared refresh
The provider MUST cache the document for 10 minutes. Requests that come while a refresh waits for GDACS MUST share that refresh.
Origin: spec-first

#### Scenario: Cache the document and share one refresh `gdacs-source-023`
- **WHEN** a second request comes while the first waits for GDACS, and a third comes 9 minutes and 59 seconds after the first
- **THEN** the provider asks GDACS once for all three
- **AND** a fourth request that comes 10 minutes after the first gets a new refresh
- **AND** a fifth request that comes 5 minutes after the fourth uses the new document and sends no page request

### Requirement: Registration
The provider MUST be one of the local provider plugins, and it MUST mount the route in the development server and in the preview server.
Origin: spec-first

#### Scenario: Register the provider `gdacs-source-024`
- **WHEN** a test builds the list of local provider plugins
- **THEN** the list holds one plugin with the name "gdacs"
- **AND** the plugin mounts the handler at "/api/gdacs" in `configureServer` and in `configurePreviewServer`

### Requirement: No personal data
The provider MUST send no cookie, no authorization header, no referrer and no personal data to GDACS. It MUST NOT copy a header of the browser request to GDACS.
Origin: spec-first

#### Scenario: Send only the fixed headers `gdacs-source-025`
- **WHEN** a browser request with the headers `Cookie`, `Authorization`, `Referer` and `User-Agent` comes to the route
- **THEN** the page request has exactly the headers `Accept` and `User-Agent`
- **AND** the `User-Agent` of the page request is "gods-eye-view-gdacs-proxy/1.0" and has no "@"
- **AND** the page request has no body
- **AND** the JSON text of the document holds none of the header values of the browser request
