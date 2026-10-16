## Why

The globe shows earthquakes, fires and storms near the United States. It shows no flood, no drought and no volcano alert, and no storm outside the area of the National Hurricane Center.

The Global Disaster Alert and Coordination System (GDACS) publishes these events as a JSON feed. The feed needs no key and no account. A scout of the data sources of the Nature paper "Advancing subseasonal forecasting with machine learning" found GDACS on 2026-10-16. It was the one source of that paper that fits a live layer.

This is change 1 of 2. It adds the server provider. Change 2 adds the layer on the globe.

## What Changes

- Add the route `/api/gdacs`. A GET request gets one JSON document of the recent disaster events.
- The provider reads the GDACS event list for flood (FL), drought (DR), volcano (VO) and tropical cyclone (TC) events. It asks for all three alert levels and for the last 14 days. An event that is still active stays in the list, also when it began earlier.
- The provider keeps a short list of fields for each event and builds the link to the GDACS report itself. It drops icons, HTML text and every upstream link.
- The provider keeps the document for 10 minutes. It serves the last good document for 1 hour when GDACS fails.
- The document carries the attribution, the license note and the GDACS disclaimer, so the layer of change 2 can show them.
- The provider sends only a fixed address, with a date and a page number that the code builds. No key, no cookie and no personal data go to GDACS.

## Capabilities

### New Capabilities

- `gdacs-source`: the route `/api/gdacs`, the fields of an event, the rules for a record, the request to GDACS, the cache and the stale answer.

### Modified Capabilities

None.

## Impact

- New files: `server/providers/gdacs.js` and `src/data/gdacsProxy.test.mjs`.
- Changed files: `server/providers/local.js` (two lines), `scripts/format-scope.json`, `openspec/ownership.json`, `DATA_SOURCES.md` and `CHANGELOG.md`.
- This change opens no gap in `openspec/trace`, because the new owned code file has full coverage. It closes no gap.
- The change needs no environment variable and no key.
- No screen uses the route until change 2. The tests use a fake fetch function. One run reads the real feed once, to compare the counts of the provider with the counts of the feed.

## Later changes

- Change 2, `gdacs-layer`: a layer "Disaster Alerts" in the group Events. The color shows the alert level. A chip shows only the events that are still active, or the events of the last 14 days. A press on a point shows the name, the severity, the dates and the link to the GDACS report. The layer shows the attribution and the disclaimer.
- A later change can add the affected areas as polygons. A polygon file of one event has 0.09 to 1.8 MB, so the provider needs a size cap and a simplification first.

## Known limits and later changes

- Known limit `eq-wf-left-out`: GDACS also lists earthquakes (EQ) and wildfires (WF). The globe already has an earthquake layer and a fire layer, so the provider leaves both out. A later change can add them by a change of one list.
- Known limit `cyclone-overlap`: The cyclone layer shows storms of the National Hurricane Center. GDACS also lists these storms. A storm in that area can show in both layers.
- Known limit `thin-live-content`: On 2026-10-16, 18 of 65 events of the last 14 days were still active. 11 floods, 1 drought and 6 storms were current, and no volcano was current. The layer can look empty on a quiet day.
- Known limit `utc-assumed`: GDACS sends times with no time zone. The provider reads them as UTC. A feed read at 12:38:42 GMT on 2026-10-16 had a newest `datemodified` of 12:38:32, which fits UTC. GDACS does not state the zone.
- Known limit `license-inferred`: The GDACS terms page is a disclaimer and gives no license. The legal notice of the European Commission, which the GDACS footer links, licenses the content of the Commission under CC BY 4.0. The RSS feed of GDACS says "public domain". The feed also relays data of NOAA, JTWC, GloFAS, GDO and the volcanic ash centers, and their own terms apply. The document shows the attribution and the disclaimer. The owner must accept this interpretation of the license.
- Known limit `flood-severity-none`: GDACS gives a severity of 0 for every flood and every volcano. The provider sets `severity` to null for these events, so the layer shows only the alert level.
- Known limit `window-14-days`: The provider lists no event that ended more than 14 days ago.
- Known limit `page-overlap`: GDACS pages can overlap while the data changes. The provider keeps one record for each event.
- Known limit `real-service-once`: No test sends a request to GDACS. One run read the real feed once, and the evidence shows it.
