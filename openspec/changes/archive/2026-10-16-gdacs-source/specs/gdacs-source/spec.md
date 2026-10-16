## ADDED Requirements

### Requirement: Event fields
The GDACS provider MUST keep only the allowed fields of an event and MUST drop every other field of the record. It MUST build the report link itself from the type and the ids.

A page is one numbered part of the GDACS event list. A page request asks GDACS for one page, and the answer holds that page. A record is an entry of the `features` list of a page. An event is an entry of the `events` list of the document. The document is the JSON body that the route sends.

A browser request comes to the route, and a page request goes to GDACS. A refresh is the work that the provider does to get all pages and to build the document.
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
- **AND** the three links of the field `url` differ from the report link that the provider builds
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
- **AND** it normalizes records with the types "FLOOD", "FL " and " FL"
- **AND** it normalizes records with the alert levels " green", "green ", "greenish" and "Redd", and an alert level that is an object with a field `toLowerCase`
- **AND** each of these records is valid in all other fields
- **THEN** the result lists none of these records
- **AND** `counts.dropped` counts each of them
- **AND** each of the types FL, DR, VO and TC is valid, and so are the alert levels "Green", "Orange" and "RED"
- **AND** the event ids 1 and 9007199254740992 and the episode id 9007199254740992 are valid
- **AND** a record with the episode id 0, the alert level "Orange" and the type "DR" is valid, and its `alert` is "orange"

### Requirement: Position rules
The provider MUST drop a record unless its geometry is a point. The point MUST have a finite longitude from -180 to 180 and a finite latitude from -90 to 90. The provider MUST test the position on the numbers of the feed, before it rounds. It MUST drop a record whose position is (0, 0). It MUST round the position to three decimals.
Origin: spec-first

#### Scenario: List only records with a valid position `gdacs-source-006`
- **WHEN** the provider normalizes records with no geometry, a geometry of type "Polygon", a geometry of type "MultiPoint", and a point with one number
- **AND** it normalizes a point whose coordinates are not a list
- **AND** it normalizes records with the geometry types "Polygon", "MultiPoint" and "LineString", or with no type, whose coordinates are two numbers
- **AND** it normalizes records whose coordinates are not numbers, and records whose latitude is 91 or -91 or whose longitude is 181 or -181
- **AND** it normalizes records whose longitude is 180.0004 or -180.0004 or whose latitude is 90.0004 or -90.0004
- **AND** it normalizes a record with a null geometry, and records whose latitude is null, a text or not a number
- **AND** it normalizes a record whose position is -0 and -0
- **AND** it normalizes a record whose position is 0 and 0
- **AND** each of these records is valid in all other fields
- **THEN** the result lists none of these records, and `counts.dropped` counts each of them
- **AND** the latitudes -90 and 90 and the longitudes -180 and 180 are valid
- **AND** the positions (0, 5) and (5, 0) are valid
- **AND** the position (0.0004, 0.0004) is valid, and the event has the latitude 0 and the longitude 0
- **AND** the latitude 5.5555 becomes 5.556, the latitude 0.0045 becomes 0.005 and the latitude -0.0004 becomes 0
- **AND** the longitude -0.0004 becomes 0
- **AND** the coordinates `[28.9986, 41.1157]` give the longitude 28.999 and the latitude 41.116

### Requirement: Time rules
The provider MUST take a valid time as UTC, also when the process has another time zone. It MUST set a time that is not valid to null. It MUST drop a record whose `fromdate` is not a valid time. It MUST keep a record whose `todate` or `datemodified` is not a valid time.

A valid time is a text of the form YYYY-MM-DDTHH:MM:SS. The date is real, with a year from 0100 to 9999, and the clock time is real. The form can end with a fraction of one to three digits and with the letter Z.
Origin: spec-first

#### Scenario: Read the valid times as UTC `gdacs-source-007`
- **WHEN** the test sets the time zone of the process to "Pacific/Kiritimati" and restores it after the test
- **AND** the provider normalizes records whose `todate` has the values "2026-10-12T01:00:00", "2026-10-12T01:00:00Z", "2026-10-12T01:00:00.5", "2026-10-12T01:00:00.123Z" and "2026-10-12T23:59:59"
- **AND** it normalizes a record whose `fromdate` is "2026-10-12T01:00:00"
- **THEN** `to` is "2026-10-12T01:00:00.000Z" for the first two values, "2026-10-12T01:00:00.500Z" for the third and "2026-10-12T01:00:00.123Z" for the fourth
- **AND** `to` is "2026-10-12T23:59:59.000Z" for the fifth value
- **AND** the values "0100-01-01T00:00:00", "1970-01-01T00:00:00", "2026-12-31T23:59:59" and "9999-12-31T23:59:59" are valid, and they give the same texts with ".000Z"
- **AND** `from` is "2026-10-12T01:00:00.000Z"
- **AND** `modified` follows the same rules as `to`

#### Scenario: Set the times that are not valid to null `gdacs-source-008`
- **WHEN** the test sets the time zone of the process to "Pacific/Kiritimati" and restores it after the test
- **AND** the provider normalizes records whose `todate` has the values "2026-10-12T01:00:00+02:00", "2026-02-30T00:00:00", "2026-13-40T00:00:00" and "2026-10-12"
- **AND** it normalizes records whose `todate` has the values "2026-10-12T01:00", "2026-10-12T25:00:00", "2026-10-12T01:60:00" and "2026-10-12T01:00:61"
- **AND** it normalizes records whose `todate` has the values "2026-10-12T01:00:00.1234", "2026-10-12T01:00:00." and "2026-10-12T01:00:60"
- **AND** it normalizes records whose `todate` has the value "2026-13-12T01:00:00"
- **AND** it normalizes a record whose `todate` has the value "0099-10-12T01:00:00", which has a year below 0100
- **AND** it normalizes texts with a part of the wrong number of digits, such as "26-10-12T01:00:00" and "2026-10-12T1:00:00"
- **AND** the part can be the year, the month, the day, the hour, the minute or the second
- **AND** it normalizes the texts "x2026-10-12T01:00:00" and "2026-10-12T01:00:00x", a list that holds a valid text, an empty text and a value that is not text
- **AND** it normalizes texts with a wrong separator, such as "2026/10-12T01:00:00" and "2026-10-12 01:00:00", and a comma in place of the dot
- **AND** it normalizes texts with a sign or a space in a part, two final Z letters, or a lower case t or z
- **AND** it normalizes a text with a final line feed, a year of three digits, the month 00 and the minute 61
- **THEN** `to` is null for each of these values, and the provider lists these events
- **AND** `modified` follows the same rules as `to`
- **AND** the provider drops a record whose `fromdate` is one of these values, and `counts.dropped` counts it

### Requirement: Alert and current rules
The provider MUST write the alert level in lower case. It MUST set `current` to true only when the feed field `iscurrent` is the text "true" or the value true. It MUST set `alertScore` to the feed value when that value is a finite number, and to null in all other cases.
Origin: spec-first

#### Scenario: Set the alert level, the score and the current flag `gdacs-source-009`
- **WHEN** the provider normalizes records with `iscurrent` "true", "false", "True", true, false, 1 and no value
- **THEN** `current` is true for the text "true" and for the value true, and false for the others
- **AND** `counts.current` counts the events with `current` true
- **AND** the alert levels "Green", "ORANGE" and "red" give "green", "orange" and "red"
- **AND** the `alertScore` 2 stays 2, and the scores 0, -1 and 1.5 stay as they are
- **AND** the alert scores "2", null and 1e999 give null, where the answer body holds 1e999 as raw JSON text

### Requirement: Severity rules
The provider MUST round the severity value to a whole number. It MUST set `severity` to an object with `value`, `unit` and `text` only in one case. The unit is not empty, the value is a finite number, and the rounded value is above 0. In all other cases it MUST set `severity` to null.

The unit and the text follow the text rules. A unit that is empty after the clean-up gives `severity` null. A text that is empty after the clean-up, or not text, gives `text` null.
Origin: spec-first

#### Scenario: Keep a severity with a unit `gdacs-source-010`
- **WHEN** the provider normalizes the storm "Tropical Cyclone SIMON-26" with the severity 249.9984 and the unit "km/h"
- **AND** the severity text of the storm is "Tropical Storm (maximum wind speed of 250 km/h)"
- **THEN** `severity` has `value` 250 and `unit` "km/h"
- **AND** the `text` of `severity` is "Tropical Storm (maximum wind speed of 250 km/h)"
- **AND** the storm "Tropical Cyclone ONE-26" with the severity 120.3696 and the unit "km/h" gives `value` 120
- **AND** the drought "Drought in Southern India" with the severity 537380 and the unit "km2" gives `value` 537380
- **AND** the severity 3000000000 with the unit "MW" gives `value` 3000000000 and `unit` "MW"
- **AND** a storm with the severity 100, the unit "km/h" and an empty severity text gives `severity` with `value` 100 and `text` null
- **AND** a storm with the same values and a severity text that is not text gives `text` null

#### Scenario: Set the severity to null `gdacs-source-011`
- **WHEN** the provider normalizes a flood with the severity 0, the unit empty and the severity text "Magnitude 0 "
- **AND** it normalizes a volcano with the severity 0 and the unit and the severity text empty
- **AND** it normalizes storms with the unit "km/h" and the `severity` values 0, 0.4, -5, "fast", "250" and 1e999
- **AND** it normalizes a storm with the severity 100 and an empty unit, and a storm with the severity 100 and the unit "<>"
- **AND** it normalizes a storm with no `severitydata`, and a storm whose `severitydata` is a list
- **THEN** `severity` is null for each of these events
- **AND** the provider lists each of these events

### Requirement: Text rules
The provider MUST clean the fields `name`, `country`, `origin`, the severity `unit` and the severity `text` in this order. It MUST remove the control characters and the characters "<" and ">". Then it MUST replace each group of two or more spaces with one space. Then it MUST cut the text to its limit. Then it MUST remove the spaces at the start and at the end.

A control character is a character from U+0000 to U+001F or from U+007F to U+009F. The limits are 120 characters for the name and 80 for the country. They are 40 for the origin, 12 for the severity unit and 160 for the severity text.

A name that is empty after the clean-up, or not text, becomes the type label. A country or an origin that is empty after the clean-up, or not text, becomes null. The provider does not clean the `iso3`, and the `iso3` MUST be three capital letters or null.
Origin: spec-first

#### Scenario: Clean the names and the texts `gdacs-source-012`
- **WHEN** the provider normalizes the names "Eruption  Kanlaon" with two spaces, "Flood<b> in\u0007 X" and "A <> B"
- **AND** it normalizes a name of three spaces, an empty name and a name that is not text
- **AND** it normalizes a name with the characters U+007F and U+009F between letters
- **AND** it normalizes a name of 130 letters, a name of 120 letters, and a name of 119 letters, a space and 10 letters
- **AND** it normalizes a name of 118 letters, two spaces and 10 letters, and a name of 118 letters, 3 control characters and 10 letters
- **THEN** the cleaned names are "Eruption Kanlaon", "Floodb in X" and "A B"
- **AND** the name of three spaces, the empty name and the name that is not text give the type label
- **AND** the type label is "Flood", "Drought", "Volcano" or "Tropical cyclone" for the type FL, DR, VO or TC
- **AND** the name with U+007F and U+009F keeps its letters and loses those two characters
- **AND** the name of 130 letters gives exactly 120 letters, and the name of 120 letters stays whole
- **AND** the name of 119 letters, a space and 10 letters gives 119 letters
- **AND** the name of 118 letters, two spaces and 10 letters gives 118 letters, one space and 1 letter
- **AND** the name of 118 letters, 3 control characters and 10 letters gives 120 letters

#### Scenario: Clean the country, the origin and the severity texts `gdacs-source-013`
- **WHEN** the provider normalizes a country of 200 letters, an empty country and a country that is not text
- **AND** it normalizes an origin of 50 letters and an empty origin
- **AND** it normalizes a severity unit of 20 letters and a severity text of 200 letters
- **AND** it normalizes the `iso3` values "TUR", "tur", "TURK", "TU" and "T1R", and an `iso3` that is not text
- **THEN** the country of 200 letters gives 80 letters, and the empty country and the country that is not text give null
- **AND** the origin of 50 letters gives 40 letters, and the empty origin gives null
- **AND** the severity unit gives 12 letters and the severity text gives 160 letters
- **AND** the `iso3` "TUR" stays "TUR", and each other value gives null
- **AND** each capital letter from A to Z, written three times, stays as it is

### Requirement: One event for each type and event id
The provider MUST check the rules of each record before it joins records. It MUST list one event for each pair of the type and the event id. It MUST keep the record with the highest episode id.

For equal episode ids, the provider MUST keep the record with the latest `datemodified`, and a `datemodified` that is null is older than any time. For equal episode ids and equal `datemodified`, it MUST keep the record that comes first in the input. `counts.dropped` MUST count the records that the rules drop, and MUST NOT count a duplicate.
Origin: spec-first

#### Scenario: Join duplicates `gdacs-source-014`
- **WHEN** page 1 holds 100 records
- **AND** these include the flood 1104230 with the episode 2, then with the episode 1, and then with the episode 2 again
- **THEN** the result holds one event of this flood, with the episode 2
- **AND** the episode 2 with the `datemodified` "2026-10-16T07:00:00" and the episode 1 with the `datemodified` "2026-10-16T08:00:00" give the episode 2, in both input orders
- **AND** two records of the same episode with the `datemodified` times "2026-10-16T08:00:00" and "2026-10-16T07:00:00" give the record of 08:00, in both input orders
- **AND** two records of the same episode give the record with the valid `datemodified`, when the other has `datemodified` null
- **AND** this holds in both input orders
- **AND** two records of the same episode with the same `datemodified` and different names give the first record of the input
- **AND** the episode 3 of the flood has the alert level "Purple", and the episodes 1 and 2 are valid
- **AND** the result then holds the episode 2
- **AND** the episode 2 on page 1 and the episode 1 on page 2 give the episode 2
- **AND** a drought and a flood with the same event id 7 are two events
- **AND** `counts.total` counts the listed events, and `counts.dropped` is 1 for the record with the alert level "Purple"

### Requirement: Order and size of the list
The provider MUST list the events with the latest `modified` first. An event with `modified` null MUST come last. Events with equal `modified` MUST come in ascending order of their `id`, compared as text. The provider MUST list at most 500 events.
Origin: spec-first

#### Scenario: Order the events and bound the list `gdacs-source-015`
- **WHEN** a fake page 1 holds 520 valid records, all current, with different `modified` times, in ascending order
- **AND** the answer to page 2 is 204
- **THEN** the result lists 500 events, and the first has the latest `modified`
- **AND** the last listed event has the 500th latest `modified`
- **AND** `counts.total` is 500, `counts.current` is 500 and `counts.dropped` is 0, and `counts.byType` counts only the listed events
- **AND** an event with `modified` null comes after an event with `modified` "1969-12-31T23:59:59" and after an event with `modified` "1970-01-01T00:00:00"
- **AND** three events with the same `modified` and the ids FL-1, FL-2 and FL-3 come in this order, whatever the input order
- **AND** a page holds 3 records, and the first of the three has `modified` null
- **AND** that event is the last of the three in the result
- **AND** two events have the same `modified` time and the ids FL-9 and FL-10, and the input lists FL-9 first
- **AND** the result lists FL-10 first, because the provider compares the ids as text

### Requirement: Route document
The route `/api/gdacs` MUST answer a GET request with one JSON document. It MUST refuse a method other than GET, a query and a sub-path. The document MUST have the fields `schemaVersion`, `source`, `attribution`, `license`, `disclaimer`, `coverage`, `fetchedAt`, `stale`, `unavailable`, `reason`, `counts` and `events`.
Origin: spec-first

#### Scenario: Answer with the document `gdacs-source-016`
- **WHEN** the clock is 2026-03-05T10:00:00Z and a GET request with no query comes to the route
- **AND** GDACS answers with one current flood
- **THEN** the status is 200, the header `Cache-Control` is "no-store" and the header `Content-Type` is "application/json"
- **AND** the body has `schemaVersion` 1, `stale` false, `unavailable` false and `reason` null
- **AND** the `source` is "GDACS (Global Disaster Alert and Coordination System)"
- **AND** the `attribution` is "GDACS, a cooperation framework of the United Nations and the European Commission"
- **AND** the `license` is "The legal notice of the European Commission licenses content that the Union owns on the Commission website under CC BY 4.0. GDACS gives no separate license for the feed. Data of NOAA, JTWC, GloFAS, GDO and other sources keep their own terms. The provider shortens the data and rounds the positions."
- **AND** the `disclaimer` is "The estimates of GDACS come from a machine, and an estimate can be wrong. Check each estimate before you use it to make a decision."
- **AND** the `coverage` is "Flood, drought, volcano and tropical cyclone events active on any day from the UTC date 14 days before fetchedAt. The provider does not list earthquakes and wildfires."
- **AND** `fetchedAt` is "2026-03-05T10:00:00.000Z"
- **AND** `counts` has `total` 1, `current` 1, `dropped` 0, and `byType` with FL 1, DR 0, VO 0 and TC 0
- **AND** `events` holds the flood
- **AND** a provider that gets no options uses the global fetch function and sets `fetchedAt` from the real clock

#### Scenario: Refuse other methods `gdacs-source-017`
- **WHEN** a browser request uses the method POST, PUT, DELETE or HEAD
- **THEN** the status is 405 with the error `method_not_allowed`
- **AND** the provider sends no page request
- **AND** a POST request with a query gets the status 405, and not 400

#### Scenario: Refuse a query or a sub-path `gdacs-source-018`
- **WHEN** a GET request has a query, or has a path that is neither `/` nor the empty path, such as `/other`
- **THEN** the status is 400 with the error `invalid_gdacs_query`
- **AND** the provider sends no page request
- **AND** a GET request with the empty path gets the document

### Requirement: Page request
The provider MUST send each page request to the fixed address of the GDACS event list. It MUST build the dates and the page number in code, with UTC dates. It MUST use the same dates for all page requests of one refresh. It MUST NOT follow a redirect. A page request MUST have exactly the options `method`, `redirect`, `signal` and `headers`.
Origin: spec-first

#### Scenario: Send the page request `gdacs-source-019`
- **WHEN** the test sets the time zone of the process to "Pacific/Kiritimati" and restores it after the test
- **AND** the clock is 2026-03-05T10:00:00Z and a browser request comes to the route
- **THEN** the first page request goes to "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=FL;DR;VO;TC&fromdate=2026-02-19&todate=2026-03-05&alertlevel=green;orange;red&pagenumber=1"
- **AND** the page request uses the method GET and the option `redirect` with the value "error"
- **AND** the options of the page request are exactly `method`, `redirect`, `signal` and `headers`
- **AND** the page request has the headers `Accept` "application/json" and `User-Agent` "gods-eye-view-gdacs-proxy/1.0"
- **AND** the page request has a signal
- **AND** the provider sends no other request than the page requests
- **AND** a clock of 2026-01-10T23:59:59Z gives `fromdate` 2025-12-27 and `todate` 2026-01-10
- **AND** each later page request has the same address form, options and headers, with its own `pagenumber`
- **AND** a refresh that starts on a later UTC day sends the dates of that day
- **AND** the clocks 2026-03-05T00:00:00.000Z and 2026-03-05T23:59:59.999Z give `fromdate` 2026-02-19 and `todate` 2026-03-05

### Requirement: Read the pages
The provider MUST fetch the pages in order from page 1. It MUST stop when the answer to a page request is 204. It MUST stop at a page whose `features` list holds fewer than 100 records, also when it drops some of them. It MUST stop after page 5.
Origin: spec-first

#### Scenario: Stop at the last page `gdacs-source-020`
- **WHEN** page 1 has 100 valid records and page 2 has 99 valid records
- **THEN** the provider sends two page requests and the result holds the 199 events
- **AND** the second page request has `pagenumber=2`
- **AND** the second page request has the same `fromdate` and `todate` as the first
- **AND** this holds also when the clock passes midnight UTC between the two page requests
- **AND** `fetchedAt` is the time at which the refresh starts, also when the clock moves 7 seconds between the two page requests
- **AND** when the answer to page 2 is 204 with no body, the provider sends two page requests. The result then holds the 100 events of page 1
- **AND** when the answer to page 1 is 204, the result holds no event, and `unavailable` and `stale` are false
- **AND** in that case `fetchedAt` is the time at which the refresh starts
- **AND** in that case `counts` has `total` 0, `current` 0 and `dropped` 0
- **AND** its `byType` has FL 0, DR 0, VO 0 and TC 0
- **AND** when page 1 has 101 records, the provider asks for page 2
- **AND** when page 1 has 100 records and 2 of them are not valid, the provider asks for page 2
- **AND** each of five pages has 100 records, and 2 records on each page are not valid
- **AND** the provider then sends five page requests and no sixth request
- **AND** these five requests have the `pagenumber` values 1 to 5

### Requirement: Source failure
The provider MUST treat a refresh as failed in each case that this requirement names. A page request fails when it cannot connect, or when its status is not 200 or 204. It also fails when the body of a 200 answer is not valid JSON, or is not a feature collection. It fails when the body of an answer has more than 2 MiB. The refresh fails when GDACS does not send all pages in 30 seconds.

A feature collection is an object with `type` "FeatureCollection" and a `features` value that is a list. An empty body of a 200 answer is not valid JSON. A 204 answer has no body, and it is not a failure. A redirect is a failure.
Origin: spec-first

#### Scenario: Fail on each kind of bad answer `gdacs-source-021`
- **WHEN** the test makes the fetch throw, as a real fetch does for a redirect with the option `redirect` "error", in turn
- **AND** the test makes the status 301, 404, 500 and 206 with a valid body, in turn
- **AND** the test makes a status 200 with an empty body and with the text "not json", in turn
- **AND** the test makes a status 200 with the bodies `{}`, `[]` and `null`, in turn
- **AND** the test makes a status 200 with the bodies `{"type":"FeatureCollection"}`, `{"type":"FeatureCollection","features":null}`, `{"type":"FeatureCollection","features":{}}` and `{"type":"Feature","features":[]}`, in turn
- **AND** the test makes a status 200 with the body `{"type":"FeatureCollection","features":"abc"}`
- **AND** the test makes the status 301, 404 and 500 with the body `{"type":"FeatureCollection","features":[]}`, in turn
- **THEN** each of these cases is a failure, and the document says `unavailable` true when no good document exists
- **AND** page request 2 fails after a good page 1, with the status 500 or the body `{}`, and no good document exists
- **AND** the document then says `unavailable` true with the reason "GDACS unavailable"
- **AND** the document holds no event, and none of the events of page 1

#### Scenario: Accept an answer of exactly 2 MiB `gdacs-source-022`
- **WHEN** a new provider gets an answer whose body is a feature collection of exactly 2 MiB
- **AND** a second new provider gets an answer whose body has one byte more
- **THEN** the first provider gives a document with `unavailable` false and `stale` false
- **AND** the second provider fails, and its document says `unavailable` true and the reason "GDACS unavailable"

#### Scenario: Stop a refresh after 30 seconds `gdacs-source-023`
- **WHEN** a test gives the provider a fake timer, page 1 holds 100 records and the request for page 2 gets no answer
- **THEN** `setTimer` runs once with 30000 milliseconds
- **AND** the two page requests have the same `signal`
- **AND** when the timer callback runs, that signal aborts and the document says `unavailable` true
- **AND** `clearTimer` runs once with the timer of a refresh after that refresh succeeds, and once after that refresh fails
- **AND** an answer body that stops after some bytes, and the timer callback, give a document with `unavailable` true
- **AND** the provider sets the timer before page 1, so a request for page 1 that gets no answer also ends with `unavailable` true
- **AND** a provider that gets no timer options uses the global `setTimeout` with 30000 and the global `clearTimeout`

### Requirement: Stale document
When a refresh fails, the provider MUST serve the last good document with `stale` true. It MUST do this only while that document is younger than 1 hour at the start of the failed refresh. In all other cases of a failure it MUST serve a document with `unavailable` true. It MUST NOT cache the stale document or the `unavailable` document.
Origin: spec-first

#### Scenario: Serve the last good document when a refresh fails `gdacs-source-024`
- **WHEN** a refresh fails after a good refresh
- **THEN** the provider serves the last good document with `stale` true when that document is 1 millisecond younger than 1 hour
- **AND** the age of a document is its age at the start of the failed refresh
- **AND** the stale document is the last good document with only `stale` changed
- **AND** the provider serves a document with `unavailable` true when that document is exactly 1 hour old
- **AND** an `unavailable` document has the status 200, `stale` false, `fetchedAt` null and the reason "GDACS unavailable"
- **AND** an `unavailable` document has the same `schemaVersion`, `source`, `attribution`, `license`, `disclaimer` and `coverage` as a good document
- **AND** its `counts` has `total` 0, `current` 0 and `dropped` 0
- **AND** its `byType` has FL 0, DR 0, VO 0 and TC 0, and it holds no event
- **AND** the stale document and the `unavailable` document have the status 200
- **AND** the provider serves the stale document also when the clock moves 30 seconds during the failed page request. The document is 1 millisecond younger than 1 hour at the start of that refresh
- **AND** the next browser request after a failure tries GDACS again, also after a stale document

### Requirement: Cache and shared refresh
The provider MUST cache the document for 10 minutes. Browser requests that come while a refresh waits for GDACS MUST share that refresh.
Origin: spec-first

#### Scenario: Cache the document and share one refresh `gdacs-source-025`
- **WHEN** a second browser request comes while the first waits for GDACS, and a third comes 1 millisecond before the end of the 10 minutes
- **THEN** the provider asks GDACS once for all three
- **AND** a fourth browser request that comes 10 minutes after the first gets a new refresh
- **AND** a fifth browser request that comes 5 minutes after the fourth uses the new document and sends no page request
- **AND** the provider caches a document with no event in the same way
- **AND** a browser request that comes later, while the refresh waits, shares that refresh

### Requirement: Registration
The provider MUST be one of the local provider plugins, and it MUST mount the route in the development server and in the preview server.
Origin: spec-first

#### Scenario: Register the provider `gdacs-source-026`
- **WHEN** a test builds the list of local provider plugins
- **THEN** the list holds one plugin with the name "gdacs"
- **AND** the plugin mounts the handler at "/api/gdacs" in `configureServer` and in `configurePreviewServer`

### Requirement: No personal data
The provider MUST send no cookie, no authorization header, no referrer and no personal data to GDACS. It MUST NOT copy a header of the browser request to GDACS.
Origin: spec-first

#### Scenario: Send only the fixed headers `gdacs-source-027`
- **WHEN** a browser request with the headers `Cookie`, `Authorization`, `Referer` and `User-Agent` comes to the route
- **THEN** the page request has exactly the headers `Accept` and `User-Agent`
- **AND** the `User-Agent` of the page request is "gods-eye-view-gdacs-proxy/1.0" and has no "@"
- **AND** the page request has no body
- **AND** the same holds when the browser sends the header names in lower case
- **AND** the JSON text of the document holds none of the header values of the browser request
