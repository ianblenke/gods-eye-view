## ADDED Requirements

### Requirement: Event fields
The GDACS provider MUST keep only the allowed fields of an event and MUST drop every other field. It MUST build the report link itself from the type and the ids.
Origin: spec-first

#### Scenario: Keep the allowed fields of a flood `gdacs-source-001`
- **WHEN** the provider normalizes the feed record of the flood "Flood in Türkiye" with the event id 1104230 and the episode id 2
- **THEN** the event has exactly 18 fields
- **AND** these are `id`, `type`, `eventId`, `episodeId`, `name`, `alert`, `alertScore`, `current`, `country`, `iso3`, `from`, `to`, `modified`, `latitude`, `longitude`, `severity`, `origin` and `reportUrl`
- **AND** the `id` is "FL-1104230", the `type` is "FL", the `eventId` is 1104230 and the `episodeId` is 2
- **AND** the `name` is "Flood in Türkiye", the `alert` is "green", the `alertScore` is 1 and `current` is true
- **AND** the `country` is "Türkiye", the `iso3` is "TUR" and the `origin` is "GLOFAS"
- **AND** `from` is "2026-10-12T01:00:00.000Z", `to` is "2026-10-16T01:00:00.000Z" and `modified` is "2026-10-16T07:45:43.000Z"
- **AND** the latitude 41.1157 gives 41.116, the longitude 28.9986 gives 28.999, and `severity` is null

#### Scenario: Drop the fields that are not on the list `gdacs-source-002`
- **WHEN** the provider normalizes a record that holds a value in each field of the next two lines
- **AND** the first group is `icon`, `iconoverall`, `htmldescription`, `description`, `glide`, `sourceid`, `polygonlabel` and `Class`
- **AND** the second group is `episodealertlevel`, `episodealertscore`, `istemporary`, `affectedcountries`, `countryonland`, `eventname` and `bbox`
- **THEN** the JSON text of the event holds none of these values
- **AND** the JSON text of the event holds none of the three links of the field `url`

#### Scenario: Build the report link from the ids `gdacs-source-003`
- **WHEN** the provider normalizes a flood with the event id 1104230 and the episode id 2 whose feed link `url.report` points to "https://example.invalid/phish"
- **THEN** `reportUrl` is "https://www.gdacs.org/report.aspx?eventid=1104230&episodeid=2&eventtype=FL"
- **AND** the JSON text of the event does not hold "example.invalid"

### Requirement: Record rules
The provider MUST drop a record that is not an object. It MUST drop a record whose type is not FL, DR, VO or TC. It MUST drop a record whose event id is not a positive integer or whose episode id is not a non-negative integer. It MUST drop a record whose alert level is not green, orange or red. It MUST drop a record with no valid start time, and a record whose geometry is not a point with a valid position.
Origin: spec-first

#### Scenario: Drop invalid records `gdacs-source-004`
- **WHEN** the provider normalizes a list that holds one record of each kind that these rules name, and one valid record
- **THEN** the result lists only the valid record
- **AND** `counts.dropped` counts the dropped records and `counts.total` is 1
- **AND** a record of the type "EQ" and a record of the type "WF" are among the dropped records
- **AND** the alert level "Orange" with a capital letter is valid, and the alert level "Purple" is not

### Requirement: Position rules
The provider MUST list only events with a valid position, and MUST round the position to three decimals.
Origin: spec-first

#### Scenario: List only events with a valid position `gdacs-source-005`
- **WHEN** the provider normalizes records whose coordinates are absent, have one number, are not numbers, lie outside the valid range, or are 0 and 0
- **THEN** the result lists none of these records
- **AND** the latitudes -90 and 90 and the longitudes -180 and 180 are valid
- **AND** the latitude 5.5555 becomes 5.556 and the latitude -0.0004 becomes 0
- **AND** the coordinates `[28.9986, 41.1157]` give the longitude 28.999 and the latitude 41.116

### Requirement: Time rules
The provider MUST take a time that has no time zone as UTC. It MUST set a time that is not valid to null. It MUST keep an event whose `to` or `modified` is null.
Origin: spec-first

#### Scenario: Read the times as UTC `gdacs-source-006`
- **WHEN** the provider normalizes records with the times "2026-10-12T01:00:00", "2026-13-40T00:00:00", "2026-10-12", an empty text and a value that is not text
- **THEN** the first time gives "2026-10-12T01:00:00.000Z"
- **AND** each of the other four times gives null
- **AND** the provider drops a record whose `from` is null, and `counts.dropped` counts it
- **AND** the provider lists a record whose `to` or `modified` is null, with that field null

### Requirement: Alert and current rules
The provider MUST write the alert level in lower case. It MUST set `current` to true only when the feed field `iscurrent` is the text "true" or the value true.
Origin: spec-first

#### Scenario: Set the alert level and the current flag `gdacs-source-007`
- **WHEN** the provider normalizes records with `iscurrent` "true", "false", "True", true, false, 1 and no value
- **THEN** `current` is true for the text "true" and for the value true, and false for the others
- **AND** `counts.current` counts the events with `current` true
- **AND** the alert levels "Green", "ORANGE" and "red" give "green", "orange" and "red"
- **AND** the `alertScore` 2 stays 2, and a score that is not a finite number gives null

### Requirement: Severity rules
The provider MUST set `severity` to an object with `value`, `unit` and `text` in one case only. The case is a unit that is not empty and a value that is a finite number above 0. Otherwise it MUST set `severity` to null.
Origin: spec-first

#### Scenario: Keep a severity with a unit `gdacs-source-008`
- **WHEN** the provider normalizes the storm "Tropical Cyclone SIMON-26" with the severity 249.9984 and the unit "km/h"
- **AND** the severity text of the storm is "Tropical Storm (maximum wind speed of 250 km/h)"
- **THEN** `severity` has `value` 250 and `unit` "km/h"
- **AND** the `text` of `severity` is "Tropical Storm (maximum wind speed of 250 km/h)"
- **AND** the drought "Drought in Southern India" with the severity 537380 and the unit "km2" keeps `value` 537380
- **AND** a flood with the severity 0, the unit empty and the text "Magnitude 0 " gives `severity` null
- **AND** a volcano with the severity 0 and the unit and the text empty gives `severity` null
- **AND** a severity below 0, a severity that is not a number, and a severity with an empty unit give null

### Requirement: Text rules
The provider MUST clean each text field. A control character is a character from U+0000 to U+001F or from U+007F to U+009F. The provider MUST remove control characters and the characters "<" and ">", and MUST replace each run of spaces with one space. It MUST keep at most 120 characters of the name.
Origin: spec-first

#### Scenario: Clean the names and the texts `gdacs-source-009`
- **WHEN** a name holds control characters, angle brackets or a double space, or has more than 120 characters
- **AND** another name is empty after the clean-up, and another is not text
- **THEN** the cleaned name has no control character, no angle bracket, no double space and at most 120 characters
- **AND** the name "Eruption  Kanlaon" with two spaces gives "Eruption Kanlaon"
- **AND** an empty name or a name that is not text gives the word of the type, which is "Flood", "Drought", "Volcano" or "Tropical cyclone"
- **AND** the country has at most 80 characters, and an empty country or a country that is not text gives null
- **AND** the `iso3` is null unless it is three capital letters
- **AND** the `origin` has at most 40 characters and is null when it is empty
- **AND** the severity `unit` has at most 12 characters and the severity `text` has at most 160 characters

### Requirement: One record for each event
The provider MUST list one record for each pair of the type and the event id. It MUST keep the record with the highest episode id, and for equal episode ids the record with the latest `modified`.
Origin: spec-first

#### Scenario: Join duplicates `gdacs-source-010`
- **WHEN** the pages hold the flood 1104230 with the episode 1, then with the episode 2, and the episode 2 again
- **THEN** the result holds one record of this flood, with the episode 2
- **AND** two records of the same episode with the `modified` times "2026-10-16T07:00:00" and "2026-10-16T08:00:00" give the record of 08:00
- **AND** a drought and a flood with the same event id 7 are two events, because the types differ
- **AND** `counts.total` counts the listed events and does not count the duplicates

### Requirement: Order and size of the list
The provider MUST list the events with the latest `modified` first. An event with `modified` null MUST come last. Events with equal `modified` MUST follow the order of their `id`. The provider MUST list at most 500 events.
Origin: spec-first

#### Scenario: Order the events and bound the list `gdacs-source-011`
- **WHEN** one page holds 520 valid events with different `modified` times
- **THEN** the result lists 500 events, and the first has the latest `modified`
- **AND** the last listed event has the 500th latest `modified`
- **AND** `counts.total` is 500, and `counts.byType` counts only the listed events
- **AND** when a page holds 3 events and one of them has `modified` null, that event is the last of the three
- **AND** two events with the same `modified` time are in the order of their `id`, as text, from low to high

### Requirement: Route document
The route `/api/gdacs` MUST answer a GET request with one JSON document. It MUST refuse a method other than GET, a query and a sub-path.
Origin: spec-first

#### Scenario: Answer with the document `gdacs-source-012`
- **WHEN** a GET request with no query comes to the route and GDACS answers with one flood
- **THEN** the status is 200, the header `Cache-Control` is "no-store" and the header `Content-Type` is "application/json"
- **AND** the body has `schemaVersion` 1, `stale` false, `unavailable` false and `reason` null
- **AND** the `source` is "GDACS (Global Disaster Alert and Coordination System)"
- **AND** the `attribution` is "GDACS, a cooperation framework of the United Nations and the European Commission"
- **AND** the `license` is "The European Commission legal notice licenses its content under CC BY 4.0. GDACS gives no separate license for the feed. Data of NOAA, JTWC, GloFAS, GDO and other centers keep their own terms."
- **AND** the `disclaimer` is "GDACS estimates are automatic and can need validation. Do not use them for decisions without a check."
- **AND** the `coverage` is "Flood, drought, volcano and tropical cyclone events that ran in the last 14 days. Earthquakes and wildfires are left out."
- **AND** `fetchedAt` is the time of the refresh
- **AND** `counts` has `total` 1, `current` 1, `dropped` 0, and `byType` with FL 1, DR 0, VO 0 and TC 0
- **AND** `events` holds the flood

#### Scenario: Refuse other methods `gdacs-source-013`
- **WHEN** a request uses a method other than GET
- **THEN** the status is 405 with the error `method_not_allowed`
- **AND** the provider sends no request to GDACS

#### Scenario: Refuse a query or a sub-path `gdacs-source-014`
- **WHEN** a GET request has a query, or has a path that is neither `/` nor the empty path, such as `/other`
- **THEN** the status is 400 with the error `invalid_gdacs_query`
- **AND** the provider sends no request to GDACS

### Requirement: Request to GDACS
The provider MUST send each request to the fixed address of the GDACS event list. It MUST build the dates and the page number in code. It MUST refuse a redirect.
Origin: spec-first

#### Scenario: Send the page request `gdacs-source-015`
- **WHEN** the clock is 2026-03-05T10:00:00Z and a request comes to the route
- **THEN** the first request goes to "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;DR;VO;TC&fromdate=2026-02-19&todate=2026-03-05&alertlevel=green;orange;red&pagenumber=1"
- **AND** the request uses the method GET and the option `redirect` with the value "error"
- **AND** the request has the headers `Accept` "application/json" and `User-Agent` "gods-eye-view-gdacs-proxy/1.0"
- **AND** the request has a signal, and the provider sends no other request than the page requests
- **AND** a clock of 2026-01-10T23:59:59Z gives `fromdate` 2025-12-27 and `todate` 2026-01-10

### Requirement: Read the pages
The provider MUST fetch the pages in order from page 1. It MUST stop at a page that answers 204, at a page with fewer than 100 events, and after page 5.
Origin: spec-first

#### Scenario: Stop at the last page `gdacs-source-016`
- **WHEN** page 1 has 100 events and page 2 has 40 events
- **THEN** the provider sends two page requests and the result holds the 140 events
- **AND** when page 2 answers 204 with no body, the provider sends two page requests and the result holds the 100 events of page 1
- **AND** when page 1 answers 204, the result holds no event, `unavailable` is false and `stale` is false
- **AND** when each of five pages has 100 events, the provider sends five page requests and no sixth request

### Requirement: Source failure
The provider MUST serve the last good document for 1 hour when GDACS fails. GDACS fails when a page request cannot connect or answers with an error status. It also fails when a body is not valid JSON or is not a feature collection. It fails when a page has more than 2 MiB. It fails when the pages need more than 30 seconds.
Origin: spec-first

#### Scenario: Serve the last good document when GDACS fails `gdacs-source-017`
- **WHEN** GDACS fails, and each kind of failure that the requirement names happens in turn
- **THEN** the provider answers with the last good document and `stale` true when that document is younger than 1 hour
- **AND** otherwise the provider answers with the status 200, `unavailable` true, the reason "GDACS unavailable", `counts` of zero and no event
- **AND** the provider does not cache a failed refresh, so the next request tries GDACS again
- **AND** a failure of page 2 after a good page 1 gives no document of page 1 alone

#### Scenario: Accept a page of exactly 2 MiB `gdacs-source-018`
- **WHEN** a page is a feature collection of exactly 2 MiB, and another page has one byte more
- **THEN** the document of the first page says `unavailable` false and `stale` false
- **AND** the page with one byte more counts as a failure

#### Scenario: Stop a refresh after 30 seconds `gdacs-source-019`
- **WHEN** a test gives the provider a fake timer and the page request does not answer
- **THEN** the provider sets one timer of 30000 milliseconds for all pages of a refresh
- **AND** when the timer runs, the signal of the page request aborts and the refresh fails
- **AND** after a good refresh, the provider clears the timer

### Requirement: Cache and shared request
The provider MUST cache the document for 10 minutes. Requests that come while a refresh waits for GDACS MUST share that refresh.
Origin: spec-first

#### Scenario: Cache the document and share one refresh `gdacs-source-020`
- **WHEN** a second request comes while the first waits for GDACS, and a third comes less than 10 minutes after the first
- **THEN** the provider asks GDACS once for all three
- **AND** a fourth request that comes 10 minutes after the first gets a new refresh
- **AND** a fifth request that comes 5 minutes after the fourth uses the new document and sends no request

### Requirement: Registration
The provider MUST be one of the local provider plugins, and it MUST mount the route in the development server and in the preview server.
Origin: spec-first

#### Scenario: Register the provider `gdacs-source-021`
- **WHEN** a test builds the list of local provider plugins
- **THEN** the list holds one plugin with the name "gdacs"
- **AND** the plugin mounts the handler at "/api/gdacs" in `configureServer` and in `configurePreviewServer`

### Requirement: No personal data
The provider MUST send no cookie, no authorization header, no referrer and no personal data to GDACS. It MUST NOT copy a header of the browser request to GDACS.
Origin: spec-first

#### Scenario: Send only the fixed headers `gdacs-source-022`
- **WHEN** a browser request with the headers `Cookie`, `Authorization`, `Referer` and `User-Agent` comes to the route
- **THEN** the page request to GDACS has exactly the headers `Accept` and `User-Agent`
- **AND** the `User-Agent` of the page request is "gods-eye-view-gdacs-proxy/1.0" and has no "@"
- **AND** the page request has no body
- **AND** the JSON text of the document holds none of the header values of the browser request
