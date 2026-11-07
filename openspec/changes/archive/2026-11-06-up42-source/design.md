## Context

The scout report describes a password grant, a public collection list and one archive search for each host.
The report is `/home/ianblenke/docker/gev-tools/imagery-scout/up42.md`.
Sections 1, 2, 5, 7, 9 and 10 supply the response shapes and the known limits.
The source tree is commit `69d3e674df2775b372e6f6d2a9c9ae71a8729046`.

## Goals / Non-Goals

Give the app scene facts for a small box and date window.
Keep credentials on the server and send only the three allowed request forms.
Later changes add thumbnails and price facts.

## Decisions

### D1: Routes and input

`server/providers/up42.js` supplies both Vite hooks through `up42Plugins()`.
`server/providers/local.js` installs the plugin beside SkyWatch.

The request key is `box`, an array in the SkyWatch coordinate order: west, south, east, north.
`validate.js` checks input and computes the spherical area with a radius of 6371008.8 metres.
The date window includes both dates, so 92 days means a difference of at most 91 days.
The steps are method, same site, rate limit, body, box, area, dates, options, credentials, store and daily count.
Collection membership needs the fetched list and occurs within the counted search.

After the body exceeds 4096 bytes, the reader discards bytes through the end or until the total exceeds 65536 bytes.
This lets the route send 400 for a body above the cap but below the hard stop.

### D2: Credentials and transport

`auth.js` builds only fixed UP42 URLs and sends no redirect.
It reads at most 4194304 bytes and keeps each timer active through the response body.
Each call has a time limit of 15000 ms.
The client cancels each error body before it clears the timer. It ignores errors from cancel.

The token cache expires 60 seconds before the token lifetime ends.
Concurrent requests share one login. A refused API token allows one new login and one retry.
The public collection request has no authorization header.
Failures contain fixed names, with no upstream error text.
The route writes only a fixed success or failure log line.

### D3: Collections and search

`upstream.js` keeps the collection map for 21600000 ms and shares a request that is in flight.
The Spring page has `content`; each collection has `name`, `integrations` and `providers` with `roles`.
The map uses the provider with role `HOST`, after the strict host check.
A bad list fails the search; it does not use a guessed host list.
The client checks the host again before it builds a path.

Each search uses at most ten host groups and four workers.
The client reads one page and never follows a next link.
The end date becomes 23:59:59.999 UTC. The start date becomes midnight UTC.

### D4: Scene facts

`normalize.js` constructs each answer field from the named upstream field.
It accepts a Polygon with one closed ring of 4 to 2000 positions.
Each position has two or three finite numbers, and the answer keeps longitude and latitude only.
An invalid optional number gives null. Invalid identity, time, collection or geometry drops the feature.
The route gives no raw upstream document or URL.

### D5: Store and count

The store keeps at most 32 good answers for less than 600000 ms.
Its key includes box, dates, cloud limit and collection names.
Identical requests share one search that is in flight. Failures do not enter the store.

The route checks the store and claims a new search in the same tick, before it waits.
The daily count increases before the upstream work starts and resets on the next UTC day.
The route checks the credentials before it reads the store. A request without credentials cannot use a kept answer.

## Files and measures

The proposal names all code, test and document paths.
Host Node runs the four test files with fake fetch functions and reports coverage for the six new code files.
Each file needs 100 percent line, branch and function coverage.
Named faults measure the critical checks. Evidence records the commands and the tests that fail.

The STE lint checks the change documents. A separate check compares test titles with the project word list.
The lead must run the calibrated gates and the two review agents before a merge.

## Purpose at archive time

Describe how the server searches the UP42 archive for scene facts while it keeps credentials on the server.
