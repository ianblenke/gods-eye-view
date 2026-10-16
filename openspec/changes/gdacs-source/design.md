## Context

Base commit: `f512a398` (main, after the merge of `beemaps-burst-panel`).
A provider in this project is a Vite plugin that mounts one handler under `/api/<name>`. The file `server/providers/reticulum.js` is the model for the document, the cache, the stale answer and the refusal of other methods. The file `server/providers/cyclones.js` is the model for a public weather feed.

GDACS is a cooperation framework of the United Nations and the European Commission. Its event list is a REST call that answers a GeoJSON FeatureCollection. A scout read the feed on 2026-10-16. The call needs no key. A request with an `Origin` header got `Access-Control-Allow-Origin: *`.

A page holds at most 100 events. The call answers 204 with no body for a page that has no event. A request for 14 days returned 65 events on one page.

## Goals / Non-goals

**Goals:**
- A route that gives the recent flood, drought, volcano and storm events of the whole world as one small document.
- One upstream refresh for all browsers, so many tabs do not load GDACS.
- Tests that need no network and a code file with full coverage.

**Non-goals:**
- A screen. Change 2 adds the layer.
- The affected areas as polygons. See the Known limit in the proposal and decision D8.
- Earthquakes and wildfires. See the Known limit `eq-wf-left-out`.

## Decisions

### D1: A server provider, and not a call from the browser

The scout found that GDACS allows calls from a browser. The earthquake layer uses that way. This change still uses a provider, for four reasons.
- One cache serves all tabs and all viewers on the network. GDACS gets one refresh for each 10 minutes.
- The provider joins the pages, drops the duplicates and drops the fields that the layer does not use. For 65 events, the raw page had 93 KB and the document has about 34 KB.
- The provider checks every record. A bad record cannot reach the layer.
- The provider builds the link to the report from the ids. The layer never opens a link that GDACS supplies.

### D2: The route and the document follow `/api/reticulum`

The route answers GET with `Cache-Control: no-store` and the type `application/json`. It refuses another method with 405 and a query or a sub-path with 400. A failure of GDACS gives the status 200 and `unavailable` true, as the Reticulum route does. A layer then needs one rule for both routes.

The document has `schemaVersion`, `source`, `attribution`, `license`, `disclaimer`, `coverage`, `fetchedAt`, `stale`, `unavailable`, `reason`, `counts` and `events`.

### D3: The question to GDACS

The provider calls `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH` with these parameters: `eventlist=FL;DR;VO;TC`, `fromdate`, `todate`, `alertlevel=green;orange;red` and `pagenumber`.
- The default of `alertlevel` is orange and red only. In a 30-day query of all six event types, the scout got 15 events with the default and 1631 events with all three levels. So the call names all three.
- `fromdate` is the UTC date 14 days before now, and `todate` is the UTC date of now. GDACS returns every event that runs in that window, so a flood that began on 2026-05-19 and still runs is in the answer.
- The provider reads page 1, then page 2, and so on. It stops at a page that answers 204, at a page with fewer than 100 events, and after page 5. So the document holds at most 500 events.

### D4: The fields of an event

The provider keeps `id`, `type`, `eventId`, `episodeId`, `name`, `alert`, `alertScore`, `current`, `country`, `iso3`, `from`, `to`, `modified`, `latitude`, `longitude`, `severity`, `origin` and `reportUrl`.
- The `id` is the type and the event id, for example `FL-1104230`.
- The `alert` is `green`, `orange` or `red`. The `current` is true only for the text "true" in `iscurrent`.
- The `origin` is the upstream source name, for example `GLOFAS`. The name `source` stays for the document.
- The provider drops the icons, the HTML description, the three upstream links, `glide`, `sourceid`, `polygonlabel`, `Class`, the episode alert fields, `istemporary`, `affectedcountries`, `countryonland` and `bbox`.

### D5: The report link comes from the ids

The provider builds `https://www.gdacs.org/report.aspx?eventid=<id>&episodeid=<episode>&eventtype=<type>` from three checked values. It ignores the link of the feed. A feed that points a link to another host can then not send a person away from GDACS.

### D6: Severity is null unless it has a unit

GDACS gives a severity for earthquakes, storms, droughts and wildfires. For a flood and a volcano it gave 0, with the unit empty, in every record that the scout read. The provider sets `severity` to `{value, unit, text}` only when the unit is not empty and the value is a number above 0. Otherwise it sets `severity` to null.

### D7: The cache and the stale answer follow the Reticulum numbers, with longer times

The document lives 10 minutes, and the last good document serves for 1 hour after a failure. GDACS changes at different rates. In the scout, droughts changed in one daily batch and storms changed every few hours. Requests that come while a refresh waits share that refresh. A failed refresh is not cached.

The refresh has a limit of 30 seconds for all pages, and a page has a limit of 2 MiB. A page of 100 events is about 140 KB, so the limit is far above a real page.

### D8: No polygons in this change

The feed gives a point for each event. The affected area is a separate file for each event. The scout measured five flood files of 0.09 to 1.8 MB. A set of current floods can need many MB. A later change can add the areas, with a size cap and a simplified outline.

### D9: The user agent has no personal data

The request header `User-Agent` is `gods-eye-view-gdacs-proxy/1.0`, as the other providers do. The request has no cookie, no `Authorization` header and no referrer.

## Risks / Trade-offs

- [GDACS can change the shape of a record] → The provider checks each field and drops a bad record. The counts show how many records it dropped.
- [The license of the feed is not stated for the API] → The Known limit `license-inferred` names the facts. The document carries the attribution and the disclaimer, and the owner accepts this interpretation before the merge.
- [The route can look empty on a quiet day] → The Known limit `thin-live-content` shows the numbers. The layer of change 2 says how many events it shows.
- [A bad page can fill the memory] → The provider takes at most 2 MiB of a page and stops when the page is larger.
- [The date window moves at midnight UTC] → The cache time is 10 minutes, so a stale window lasts at most 10 minutes.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Show recent flood, drought, volcano and storm alerts of the world. Read the GDACS event list, keep a short list of fields for each event, and serve one small document."
