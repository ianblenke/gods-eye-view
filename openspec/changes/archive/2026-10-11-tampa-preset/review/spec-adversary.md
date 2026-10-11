Verdict: PASS
Commit read: 21ae21654a9248ab49a9ef6b49e1e6f0e9a94b6f (clone tampa-preset, scope full, change archived in 2026-10-11-tampa-preset). I ran no code and no request. No critical and no major finding. Paths are under openspec/changes/archive/2026-10-11-tampa-preset/.

- [ ] FINDING minor proposal.md:30 and :41 (Known limit `search`) say that the preset geocoder answers `Tampa` and each of the five place names, and declines `Tampa, FL`. The queries in evidence/name-collision.txt:31 hold none of `Tampa`, `Tampa International Airport`, `Henry B. Plant Museum` or `Tampa, FL`. The claims are true in the code (presetGeocoder.js:5-12 folds case and punctuation; the index holds the city id, the city name and each place name; `tampa fl` is in no index), but no run records them. Add the four queries to the script and the output, or add: "The lead read this in `src/search/presetGeocoder.js`; no run records it."
- [ ] FINDING minor specs/location-presets/spec.md (scenario 005): no test pins the Tampa answer of the preset geocoder (a search in src/search tests finds no `Tampa`). The behavior change is named in Known limit `search`; record it as accepted by name in review.md.
- [ ] FINDING minor evidence/places.txt:8 "outside the view box": every other file says "view bounds". Write "(not a place of the preset; outside the view bounds)".

Open for review.md, by name: the deviation from rule 1 (the name reached the code in 0f18d842 and the test in bc525a6e before the scenario in 5991e1c2), and the minors above.

Checked, no finding:
- Spec and tests:
  - The literals of 001, 006, 007 and 008 match the spec and the code; the five places in the test equal the table line by line.
  - "Preset order" is the only requirement that becomes false.
  - The merged spec differs from main only in the 001 requirement and scenario and in the three added requirements (checked against main's file).
  - Test 003 still proves its text (count, key order, Taiwan first, Taiwan before Austin).
  - No test passes against the opposite of the code.
- Trace:
  - ids.json holds 006, 007 and 008 with change tampa-preset. The 001 entry keeps since and change, and its hash is new.
  - links.json titles equal the test titles.
  - 926 scenarios, 3716 traced, untraced unchanged at 5923. No retired id is used.
  - The history has 2 lines: the totals of locations.js go from 1605 to 1660 lines (+55).
- Faults: 32 faults in mutations.txt (lines 2-33), in mutations-run.txt (lines 4-35) and in the script. Every part of 001, 006, 007, 008 and the second part of 003 has a fault that fails it; the excerpt blocks start with their own "test at" line (153:1 and 763:1).
- Evidence: red-green.txt (4 fail, 50 pass, then 54 pass); name-collision.txt rows agree with findPoiByName and presetGeocoder (labels at presetGeocoder.js:86; HUD tag at hudLocality.js:51 with hud.js:76-83).
- Truth of the claims: the 33 files (a search with the command gives the same 33 files); ten presets before, eleven pills; the 55 lines; Austin and San Francisco ranges and pitches; the voice schema list (8 ids); `overflow-x: auto` (location.css:84); the coordinates against places.txt; the commit e897866a exists.
- Pre-review corrections: all applied (nine to ten; camera numbers; the name; the CHANGELOG split; the loops before deepEqual; the faults; the order in scenario 006; the label limit; the excerpt blocks). No banned word in the *.md files; no new sentence over 25 words.

Could not check: running code; the 789 tests; the OpenStreetMap results; the two runs of the 32 faults.
