## Why

The globe shows earthquakes, fires and storms. It shows no flood, no drought and no volcano alert. Its storm layer covers only the Atlantic and the eastern and central North Pacific.

The Global Disaster Alert and Coordination System (GDACS) publishes these events as a JSON feed. The feed needs no key and no account. A scout of the data sources of a Nature paper on subseasonal forecasts found GDACS on 2026-10-16. The paper uses GDACS flood events. GDACS was the one source of that paper that fits a live layer.

This is change 1 of 2. It adds the server provider. Change 2 adds the layer on the globe.

## What Changes

- Add the route `/api/gdacs`. A GET request gets one JSON document of recent disaster events.
- The provider asks the GDACS event list for flood (FL), drought (DR), volcano (VO) and tropical cyclone (TC) events. It asks for all three alert levels. It asks for the events that were active on any day from the UTC date 14 days before the refresh.
- A current event is an event that GDACS marks as still active. The document marks each event as current or not, so the layer can show only the current events.
- The provider keeps a short list of fields for each event. It builds the link to the GDACS report itself, and it drops icons and every link field of the feed. It removes angle brackets from the text fields.
- The provider keeps the document for 10 minutes. When GDACS fails, it serves the last good document if that document is younger than 1 hour at the start of the failed refresh.
- The document carries the attribution, the license note and a disclaimer about the GDACS estimates, so the layer of change 2 can show them.
- The provider sends only a fixed address, with two dates and a page number that the code builds. No key, no cookie and no personal data go to GDACS.

## Capabilities

### New Capabilities

- `gdacs-source`: the route `/api/gdacs`, the fields of an event, the rules for a record, the page request to GDACS, the cache and the stale document.

### Modified Capabilities

None.

## Impact

- New files: `server/providers/gdacs.js` and `src/data/gdacsProxy.test.mjs`.
- Changed files: `server/providers/local.js` (two lines), `scripts/format-scope.json`, `openspec/ownership.json`, `DATA_SOURCES.md` and `CHANGELOG.md`.
- This change opens no gap in `openspec/trace`, because the new owned code file has full coverage. It closes no gap.
- The change needs no environment variable and no key.
- No screen uses the route until change 2. The tests use a fake fetch function.
- Task 3.5 runs the provider once against the real feed with a script outside the repository. The file `evidence/live-run.txt` shows the counts of that run.

## Later changes

- Change 2, `gdacs-layer`: a layer "Disaster Alerts" in the group Events. The color shows the alert level. A chip switches between the current events and all events of the document. When a person presses a point, the layer shows the name, the severity, the dates and the link to the GDACS report. The layer shows the attribution and the disclaimer, and it never sets HTML from the document.
- A later change can add the affected areas as polygons. The file of one event has 0.09 to 1.8 MB, so the provider must limit the size and simplify the outline first.

## Known limits and later changes

- Known limit `eq-wf-left-out`: GDACS also lists earthquakes (EQ) and wildfires (WF). The globe already has an earthquake layer and a fire layer, so the provider does not list them. A later change can add them, but it must change the type rules, the counts, the coverage text and the limit of 500 events.
- Known limit `cyclone-overlap`: The cyclone layer shows storms of the National Hurricane Center and the Central Pacific Hurricane Center. GDACS also lists these storms. A storm in that area can show in both layers.
- Known limit `thin-live-content`: On 2026-10-16, 18 of 65 events in the window were current. Of these, 11 were floods, 1 was a drought and 6 were storms. No volcano was current. The layer can look empty on a day with few events.
- Known limit `utc-assumed`: GDACS sends times with no time zone. The provider takes them as UTC. The scout read the feed at 12:38:42 GMT on 2026-10-16, and the newest `datemodified` was 12:38:32. This fits UTC. GDACS does not state the zone.
- Known limit `license-inferred`: The GDACS terms of use (www.gdacs.org/About/termofuse.aspx) are a disclaimer and give no license. The legal notice of the European Commission (commission.europa.eu/legal-notice_en#copyright-notice) licenses "content owned by the EU on this website" under CC BY 4.0. The GDACS footer links this notice. The scout of 2026-10-16 read both pages.
- Known limit `license-owner-step`: The notice names the Commission website, not the gdacs.org feed. It does not cover the part that the United Nations own. The RSS feed of GDACS says "public domain". The owner must accept the step from the Commission website to the gdacs.org feed.
- Known limit `license-third-party`: The feed relays data of NOAA, JTWC, GloFAS, GDO and the volcanic ash centers, and their own terms apply. CC BY 4.0 asks you to say what you changed. The `license` text says that the provider shortens the data and rounds the positions.
- Known limit `flood-severity-none`: On 2026-10-16, each of the 41 floods and 2 volcanoes in the window had a severity of 0. The provider sets `severity` to null for such an event, so the layer shows only the alert level.
- Known limit `window-14-days`: The provider asks for the events that were active on any day from the UTC date 14 days before the refresh. An event that ended on that date can be 15 days old.
- Known limit `page-overlap`: GDACS pages can overlap while the data changes. The provider keeps one event for each type and event id.
- Known limit `outage-refetch`: The provider does not cache the stale document or the `unavailable` document. While GDACS fails, each browser request that comes when no refresh waits asks GDACS again, with up to 5 pages. The provider serves a stale document only when the failed refresh starts less than 1 hour after the `fetchedAt` of that document.
- Known limit `text-cleaning`: The provider removes the characters "<" and ">". Three of the ten storm severity texts of 2026-10-16 hold "Hurricane/Typhoon > 74 mph". The provider loses the sign. The provider cuts the longest name of that day (311 characters) to 120 characters. It cuts the longest country (296 characters) to 80.
- Known limit `page-cap`: The provider fetches at most 5 pages and lists at most 500 events. A window with more records loses the rest, and the document shows no sign of it.
- Known limit `silent-empty`: A change in the shape of the feed can make the provider drop every record. The document is then good, it has no event, and `unavailable` is false. Only `counts.dropped` shows it.
- Known limit `empty-body-fails`: An answer 204 means no more events. An answer 200 with an empty body is a failure.
- Known limit `real-service-once`: No test sends a request to GDACS. One run reads the real feed once, and `evidence/live-run.txt` shows it with the code commit. The run read one page of 65 records. The page size of 100, the answer 204 and the pages 2 to 5 never ran against the real feed.
- Known limit `text-is-plain`: The text fields `name`, `country`, `origin`, `severity.unit` and `severity.text` can hold any text, a web address included. The provider cleans them by the Text rules. Change 2 must show these fields as plain text.
