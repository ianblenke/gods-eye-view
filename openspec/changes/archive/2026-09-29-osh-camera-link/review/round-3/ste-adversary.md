# ste-adversary round 3 — osh-camera-link

Scope: diff 397b492 (commit 889604e)
Verdict: FAIL

S7 and S9 confirmed fixed: no stray "read" survives as a noun; "call" as a noun is established precedent across the accepted spec corpus (`openspec/specs/osh/spec.md`, `osh-control/spec.md`, `cyclones/spec.md`, `credential-boundary/spec.md`, `spec-trace/spec.md`) satisfying one-word-one-meaning; "digit" now appears only inside "number token" or in "digit pattern"/"has no digit", both genuinely distinct concepts, not third synonyms.

## Findings

- [x] S10 major `openspec/changes/archive/2026-09-29-osh-camera-link/design.md:50` "adds one request when no camera matches" — voice/consistency. Contradicts D4 (design.md:41): "Only when none of them carries video does the layer search for a system that matches. When it finds one, it calls `source.getDatastreams()`..." The extra call happens only when a camera DOES match, never when none matches. Task 2.2's own no-match test proves zero extra calls on no-match. This line changed as part of round 2's S7 fix, so it was in scope. Corrected in round 4: "adds one request when a camera matches."
- [x] S11 minor `src/layers/osh/cameraLink.test.mjs:26` "both the number token and camera" — articles and nouns. "the number token" has an article; the parallel item "camera" does not. Corrected: "both the number token and the word 'camera'", matching design.md D2's own phrasing.

New prose reviewed (the team-lead-found keyRequired gap, tasks.md's new bullets and the new test name) — no STE issues.

S10 is major, so round 3 does not pass to the accept-by-name path regardless of round count; it needed a real fix and another check (done in round 4).
