# ste-adversary round 1 — osh-camera-link

Scope: full
Verdict: FAIL

## Findings

- [x] S1 major `openspec/changes/archive/2026-09-29-osh-camera-link/specs/osh/spec.md:51` "the found system's own name" — one word, one meaning. Inside this one scenario the same referent is called three things: "the found system", "the matched system", and "a linked camera" in the scenario's own title. The split continues outside the spec: `tasks.md` section titles say "a linked camera", `proposal.md:21` says "a linked camera's video", `design.md`'s D1-D4 decisions and the risk section speak only of "match"/"matched". Corrected: standardized on "matched" everywhere, including the scenario's own title (now "Play the matched camera's video when the selected system has none").
- [x] S2 minor `proposal.md:21` "gains a match rule" — GAIN is not an approved STE word. Corrected: "adds a match rule."
- [x] S3 minor `proposal.md:9` "the existing video view" — "existing" is a present participle used as an adjective, not on the project's `allowedIng` list. Corrected: "the current video view."
- [x] S4 minor `design.md:5` "every system record it has seen" — present-perfect tense; STE allows only simple present/past/future/imperative. Corrected: "every system record it read" (both occurrences).
- [x] S5 minor `design.md:54` "no scenario is retired" — passive voice in a description. Corrected: "the change retires no scenario."
- [x] S6 minor `design.md:47` "a system that is itself named as a camera" — passive voice, inconsistent with the same file's own active phrasing elsewhere. Corrected: "a system whose own name has the word 'camera'."
- [x] S7 minor `src/data/oshLayer.test.mjs:3895` "the matched camera's own datastreams read fails" — READ used as a noun; STE approves READ only as a verb. Recurs at `design.md:39,41,48`, `tasks.md:32,33`, and a second test name at `oshLayer.test.mjs:3926`. Corrected in round 2.
- [x] S8 minor `tasks.md:13` "Read the first digit run of `selectedName` with a digit pattern; return `null` at once when it finds none." — two sequential instructions joined by a semicolon, not actions at the same time. Recurs at `tasks.md:14` and `tasks.md:36`. Corrected: split into separate bullets.
