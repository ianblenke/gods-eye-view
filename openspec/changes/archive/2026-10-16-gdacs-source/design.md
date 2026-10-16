## Context

Base commit: `f512a398` (main, after the merge of `beemaps-burst-panel`).
A provider in this project is a Vite plugin that mounts one handler under `/api/<name>`. The file `server/providers/reticulum.js` is the pattern for the document, the cache, the stale document and how the route refuses other methods. The file `server/providers/cyclones.js` is the pattern for a public weather feed.

GDACS is a cooperation framework of the United Nations and the European Commission. Its event list is a REST call that answers a GeoJSON feature collection. A scout read the feed on 2026-10-16. The call needs no key. A request with an `Origin` header got `Access-Control-Allow-Origin: *`.

A page holds at most 100 records. A page that has no record answers 204 with no body. A request for 14 days returned 65 records on one page.

This design uses these terms.
- A page is the answer of GDACS to one page request.
- A record is an entry of the `features` list of a page.
- An event is an entry of the `events` list of the document.
- The document is the JSON body that the route sends.
- A page request goes to GDACS. A browser request comes to the route.
- A refresh is the work that the provider does to get all pages and to build the document.
- A current event is an event that GDACS marks as still active.

## Goals / Non-goals

**Goals:**
- A route that gives the recent flood, drought, volcano and storm events of the whole world as one small document.
- One refresh for all browsers, so many tabs do not load GDACS.
- Tests that need no network and a code file with full coverage.

**Non-goals:**
- A screen. Change 2 adds the layer.
- The affected areas as polygons. See decision D8.
- Earthquakes and wildfires. See the Known limit `eq-wf-left-out`.

## Decisions

### D1: A server provider, and not a call from the browser

The scout found that GDACS allows calls from a browser. The earthquake layer uses that way. This change still uses a provider, for four reasons.
- One cache serves all tabs and all viewers on the network. While GDACS works, it gets one refresh for each 10 minutes.
- The provider adds the pages together, keeps one record of each duplicate and drops the fields that the layer does not use. The raw page of 65 records had 93 KB. The live run of task 3.5 measures the size of the document.
- The provider checks every record. A bad record cannot reach the layer.
- The provider builds the link to the report from the ids. The layer never opens a link that GDACS gives.

### D2: The route and the document follow `/api/reticulum`

The route answers GET with `Cache-Control: no-store` and the type `application/json`. It refuses another method with 405 and a query or a sub-path with 400. A failure of GDACS gives the status 200 and `unavailable` true, as the Reticulum route does. A layer then needs one rule for both routes.

The document has `schemaVersion`, `source`, `attribution`, `license`, `disclaimer`, `coverage`, `fetchedAt`, `stale`, `unavailable`, `reason`, `counts` and `events`. The field `fetchedAt` is the time at which the refresh starts, as in the Reticulum provider. The object `counts` always has the same four fields, and `byType` always has the four keys FL, DR, VO and TC.

### D3: The question to GDACS

The provider calls `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH` with these parameters: `eventlist=FL;DR;VO;TC`, `fromdate`, `todate`, `alertlevel=green;orange;red` and `pagenumber`.
- The default of `alertlevel` is orange and red only. The scout ran a 30-day sweep of the six event types, with one query for each type. It got 15 events with the default and 1631 rows with all three levels. So the call names all three.
- `fromdate` is the UTC date 14 days before now, and `todate` is the UTC date of now. GDACS returns every event that is active in that window, so a flood that began on 2026-05-19 and is still current is in the response.
- The provider fetches page 1, then page 2, and so on. It stops at a page that answers 204, at a page whose `features` list has fewer than 100 entries, and after page 5. A record that the provider drops still counts as an entry.

### D4: The fields of an event

The provider keeps `id`, `type`, `eventId`, `episodeId`, `name`, `alert`, `alertScore`, `current`, `country`, `iso3`, `from`, `to`, `modified`, `latitude`, `longitude`, `severity`, `origin` and `reportUrl`.
- The `id` is the type and the event id, for example `FL-1104230`.
- The `alert` is `green`, `orange` or `red`. The `current` is true only for the text "true" or the value true in `iscurrent`.
- The `origin` is the name that the feed gives for the source of the data, for example `GLOFAS`. The name `source` stays for the document.
- In `properties`, the feed fields are `eventtype`, `eventid`, `episodeid`, `name`, `alertlevel`, `alertscore`, `iscurrent`, `country`, `iso3`, `fromdate`, `todate`, `datemodified` and `source`.
- The field `severitydata` holds `severity`, `severitytext` and `severityunit`.
- The provider drops every other field of the record.
- Examples are the icons, the HTML description, the plain description, the event name and the three links of the feed.
- More examples are `glide`, `sourceid`, `polygonlabel`, `Class`, `istemporary`, `affectedcountries`, `countryonland` and `bbox`, and the episode alert fields.

### D5: The report link comes from the ids

The provider builds `https://www.gdacs.org/report.aspx?eventid=<id>&episodeid=<episode>&eventtype=<type>` from three checked values. It ignores the link of the feed. Then a feed that gives a link to another host cannot send a person to that host.

### D6: Severity needs a unit and a value above 0 after the provider rounds it

GDACS gives a severity for earthquakes, storms, droughts and wildfires. For a flood and a volcano it gave 0, with the unit empty, in every record that the scout read. The provider rounds the value to a whole number. It sets `severity` to `{value, unit, text}` only when the unit is not empty, the value is a finite number and the rounded value is above 0. Otherwise it sets `severity` to null. The unit and the text follow the text rules, and a text that is empty gives `text` null.

### D7: The cache and the stale document have their own times

The provider keeps the document for 10 minutes (Reticulum: 60 seconds). The provider serves the last good document while it is younger than 1 hour (Reticulum: 2 hours). The time limit is 30 seconds for all pages (Reticulum: 8 seconds for one answer). A page has a limit of 2 MiB (Reticulum: 4 MiB).

In the scout, droughts changed in one daily batch and storms changed every few hours, so 10 minutes is short enough. A page of 100 records is about 140 KB, so the limit of 2 MiB is far above a real page.

Browser requests that come while a refresh waits share that refresh. The provider does not cache a failed refresh. The provider takes the options `setTimer` and `clearTimer`, as the Reticulum provider does. A cached document has the old date window for at most 10 minutes. When GDACS fails, the last good document can have the old window for up to 1 hour, and `stale` is true.

### D8: No polygons in this change

The feed gives a point for each event. The affected area is a separate file for each event. The scout measured five flood files of 0.09 to 1.8 MB. A set of current floods can need many MB. A later change can add the areas, with a size limit and a simplified outline.

### D9: The user agent has no personal data

The request header `User-Agent` is `gods-eye-view-gdacs-proxy/1.0`, as the cctv and gbfs providers do. The request has no cookie, no `Authorization` header and no referrer. A page request has exactly the options `method`, `redirect`, `signal` and `headers`.

### D10: A time is UTC and has one form

GDACS sends times such as `2026-10-12T01:00:00` with no time zone. The provider takes a time of this form as UTC. It also accepts a fraction of one to three digits and a final `Z`.

It sets any other value to null, for example a time with an offset or a date with no clock time. It checks the calendar, so `2026-02-30` is not valid. The tests set the time zone of the process to `Pacific/Kiritimati` (UTC+14), so a parser that reads local time fails them. The provider also builds the dates in the page request in UTC, and it uses the same dates for all page requests of one refresh.

### D11: The order of the work

The provider checks the rules of each record first. Then it joins the records of one type and event id, sorts the events and cuts the list at 500. So a bad episode does not remove a good episode of the same event. An event past the limit of 500 is not a dropped record. The count `dropped` counts only the records that the rules drop.

A real page holds at most 100 records, so 5 pages give at most 500 records. The test for the limit uses a fake page of 520 records.

### D12: What a bad answer is

A status 204 means no more events. A status 200 with an empty body is a failure, because an empty body is not valid JSON. Any other status is a failure. This includes a redirect and the status 206. A body must be an object with `type` "FeatureCollection" and a `features` value that is a list.

## Files and measures

The change adds `server/providers/gdacs.js` and `src/data/gdacsProxy.test.mjs`. It edits `server/providers/local.js`, `openspec/ownership.json`, `scripts/format-scope.json`, `DATA_SOURCES.md` and `CHANGELOG.md`.
- The trace gate checks the scenario IDs `gdacs-source-001` to `gdacs-source-027`. Each test name starts with its IDs in square brackets.
- The coverage gate needs 100% of lines, branches and functions in `server/providers/gdacs.js`.
- A named fault is a change of the code that must make a test fail. The named faults show that a change of a list, a limit or a rule makes a test fail. The fault runs use the committed tree and write `evidence/mutations.txt`.
- The ownership gate reads `openspec/ownership.json`, and the format check reads `scripts/format-scope.json`.
- The lead runs the gates in the Docker image and both review agents on the final tree.

## Risks / Trade-offs

- [GDACS can change the shape of a record] → The provider checks each field and drops a bad record. The count `dropped` shows how many records it dropped.
- [The API does not state the license of the feed] → The Known limit `license-inferred` names the facts. The document carries the attribution and the disclaimer, and the owner accepts the interpretation before the merge.
- [The route can look empty on a day with few events] → The Known limit `thin-live-content` shows the numbers. The layer of change 2 says how many events it shows.
- [A bad page can fill the memory] → The provider reads at most 2 MiB of a page. A page with more bytes is a failure.
- [The date window moves at midnight UTC] → See decision D7 for how old a window can be.
- [GDACS fails for a long time] → Each browser request that comes when no refresh waits then asks GDACS again. See the Known limit `outage-refetch`.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show recent flood, drought, volcano and storm alerts of the world. Read the GDACS event list, keep a short list of fields for each event, and serve one small document."
