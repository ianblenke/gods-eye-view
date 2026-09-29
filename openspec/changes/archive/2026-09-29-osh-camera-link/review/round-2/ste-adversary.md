# ste-adversary round 2 — osh-camera-link

Scope: diff cd33ea5 (commit 397b492)
Verdict: PASS

S1-S6, S8 confirmed resolved. S7 confirmed NOT fixed, still present in 7 spots (design.md's D4 heading/body, the Risks section, tasks.md, and two test names). Corrected in round 3.

## New findings this round

- [x] S9 minor `tasks.md:13` "the first digit run" — one word, one meaning. `design.md`/`spec.md` call this a "number token"; `tasks.md` calls it a "digit run" (5 spots); `cameraLink.test.mjs` test names use bare "number" (3 spots). Corrected: standardized on "number token" everywhere.

## Carried forward (not fixed this round)

- [ ] S7 minor (7 spots): `design.md:39,41,48`, `tasks.md:34,35`, `oshLayer.test.mjs` test names at lines 3924/3955 — "read" used as a noun. Corrected in round 3.
