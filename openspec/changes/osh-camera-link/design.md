## Context

`src/layers/osh/index.js` opens the video of the selected system in `openStreams()`. It calls `openVideoSession(states.find((state) => state.video), generation)`, where `states` are the datastream states of the selected system only. A system with no video datastream of its own gets no video today; `openVideoSession` returns early on a null state.

The layer keeps `_systemRecords`, a `Map` of every system record it read, by id, each with a `name` field. `source.getDatastreams(systemId)` already reads the datastreams of one system, by id.

## Goals / Non-Goals

**Goals:**

- When the selected system has no video datastream, find another system whose name matches, and play its video instead.
- Show the matched system's own name in the video view, not the selected system's name.
- Add no datastreams call for a system that already has its own video.

**Non-Goals:**

- This change does not add a link field to any system record, or change the server's own data.
- This change does not change `osh-control` or the command view.
- This change does not change the detail panel's own text.

## Decisions

### D1 A number token from each system's own name

A number token is the first run of digits in a system's `name` field, found by a simple digit pattern. A name with no digit has no number token, and gets no match.

The first run, not every run, keeps the match simple. It stays free of a name's other digits, such as a firmware or model number placed elsewhere in the text.

### D2 The match rule

Two systems match when both have a number token and the tokens are equal. The candidate system's own name also has the word "camera", read without regard to letter case. The selected system's own name does not need the word "camera".

The search reads `_systemRecords`, every system record the layer read, not only the placed or the visible ones. A system with an empty or an absent `name` gets no number token, so it matches nothing and causes no error.

### D3 One match, by a fixed order

When more than one system matches, the layer keeps the first one in the iteration order of `_systemRecords`. A `Map` keeps insertion order, so the first system the layer read from the server wins. This is deterministic, and it needs no new sort.

### D4 A second datastreams read, only as a fallback

`openStreams()` still checks the selected system's own states first. Only when none of them carries video does the layer search for a system that matches. When it finds one, it calls `source.getDatastreams()` for that system's id. This keeps the normal case, a system with its own video, at one datastreams read.

The matched system's video session opens the same way `osh-087` already opens one: one stream, one player, one view, closed with the selection. The view's own name comes from the matched system's record, not the selected system's.

## Risks / Trade-offs

1. **A number that appears in more than one system's name for an unrelated reason.** Mitigation: the match also needs the word "camera" in the candidate's own name. This narrows a false match to a system whose own name has the word "camera" and carries the same number by chance.
2. **The extra datastreams read adds one request when no camera matches.** Mitigation: this read happens only once per selection, only when the selected system has no video of its own. It is the same cost the layer already pays today, for a system with no video datastream of its own.

## How the gates measure this change

Coverage: `src/layers/osh/index.js` already has full line, branch and function coverage. The new file, `src/layers/osh/cameraLink.js`, and its own tests, `src/layers/osh/cameraLink.test.mjs`, must reach full coverage too. The new match function and its call site in `index.js` are lines this change adds, so its own tests must reach them.

Trace: the change retires no scenario. `osh-086` through `osh-094`'s own tests keep their tags and their assertions. A new scenario, `osh-097`, states the match rule and the fallback video.
