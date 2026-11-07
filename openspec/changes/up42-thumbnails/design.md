## Context

The base tree is commit `7d4d1643b92767344587435ebf12116d2949a25e` on branch `up42-thumbnails`.
The scout report section 3 supplies the thumbnail path and known limits.
Tests use fake fetch only. No live request checks these facts.

## Decisions

The scenes plugin exports `thumbnailHostOf` from its own answer store.
It reads answers from newest to oldest and selects the first scene with the id.
A false thumbnail flag in that newest answer refuses the request.
Expired or evicted answers give no host.

The function `up42Plugins()` keeps its one scenes plugin and accepts a shared client.
The function `up42SourcePlugins()` in `server/providers/up42-thumbnails/plugins.js` creates that client and returns both plugins.
The local provider list uses the new function.
The thumbnail route lives in `server/providers/up42-thumbnails/thumbnails.js`.
The source folder still has five helpers beside `up42.js`.

The route checks path, same site, method, variable, rate, scene and image store in that order.
It claims new work before any wait after a store miss.
The cache key includes host and id, so a newer host cannot use bytes from the old host.
The store removes its oldest entry above 32 and rejects entries at 600000 ms.
It stores no failure and changes no daily search count.

The client checks the existing host regex and shared scene id rule before it requests a token.
It builds the path from constants and these checked parts.
It reuses the source token cache and retry machinery without a finally block around the new returns.
A second thumbnail 401 gives credentials_rejected; source search behavior stays unchanged.
Each non-200 body receives cancel before the timer clears.

The client imports generic image checks from `server/providers/skywatch/image.js` without an edit to that file.
The common byte reader enforces 1048576 bytes while it reads the stream.
The timer covers headers and body for 15000 ms.
The client cancels non-image bodies and checks first bytes before it sends an image.
The client also checks decoded image bytes for current and previous secrets.
The route copies no upstream header and writes no thumbnail log.

## Files and measures

The proposal lists each changed file.
The new test file checks each scenario with assert methods, fake responses, fake timers and a fake clock.
It checks local provider construction with fake process variables and a fake global fetch.

The host runs all UP42 and SkyWatch test files and measures each edited provider file at full coverage.
Named faults must fail their named tests. The evidence records the command, commit and source hash for each fault.
The STE lint checks the documents. A separate word-list check reads expanded test titles.

The host work does not run make, Docker, a commit or a network request.
The lead runs the calibrated gates and two review agents before merge.

## Purpose at archive time

Describe how the server sends checked UP42 thumbnails for scenes in kept answers while it keeps credentials private.
