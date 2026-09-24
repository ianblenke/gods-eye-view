# Skeptic verdicts of round 3

One skeptic for each major or critical finding. Minor findings had none.

## ste S43: real=True, severity fair=True, fix ok=True

Confirmed. The cited text exists at openspec/changes/archive/2026-09-24-osh-live-observations/specs/osh/spec.md:9 and openspec/specs/osh/spec.md:31: "each recorded upstream call has method `GET`, no body and an `AbortSignal`". It is in scope, because the round-2 to round-3 diff (live-r3.diff PART 2 and PART 3) changed the WHEN of osh-004 from "the base probe, the list fetch and the observation fetch each run" to "the systems, datastreams, observations and live routes, so that each upstream call runs". That widening brings the WebSocket call under "each recorded upstream call". Before the change the THEN was limited to fetch calls by its WHEN.

The WebSocket call has no `AbortSignal`, and its option object has no method and no body key. `oshOpenStream()` (server/providers/osh/get.js:124-127) runs `new WebSocketImpl(String(url), { headers })` and nothing else. Line 10 of the delta says the same ("an option object with only `headers`"). The oshProxy.test.mjs osh-004 test (lines 130-176) asserts method, body, redirect and `AbortSignal` for the `calls` array of `fixtureFetch` only. For the live route it records the socket in a separate `sockets` array and asserts only `Object.keys(sockets[0].options)` equals `['headers']`.

The extended test also records the WebSocket call, so "recorded" does not exclude it. A reader can take line 9 as covering the socket call, and lines 9 and 10 then contradict each other. That is two meanings and a disagreement with the code, so major is fair. I found no test or script that reads the phrase, so nothing else depends on the wording. The same phrase at spec.md:447 and :524 sits in other scenarios whose WHENs name fetch-only routes, so those are not affected.

The fix is right. Write "**THEN** each recorded fetch call has method `GET`, no body and an `AbortSignal`", and keep the WHEN and the AND. The sentence is well under 25 words, and "fetch call" is the term osh-005 already uses. Edit both spec copies.

The scenario hash covers the scenario body lines (scripts/spec/lib/specs.mjs `scenarioHash`), so the osh-004 hash in openspec/trace/ids.json changes. `updateRegistry` and `compareRegistryWithBase` need a changed test that carries the [osh-004] tag. Two such tests already exist in this change (the new one in oshGet.test.mjs and the extended one in oshProxy.test.mjs), so the ratchet passes. Edit ids.json as text, not through a JSON round trip.
