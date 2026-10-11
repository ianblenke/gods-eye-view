Verdict: PASS
Commit read: 21ae21654a9248ab49a9ef6b49e1e6f0e9a94b6f. A = openspec/changes/archive/2026-10-11-tampa-preset/

- [ ] FINDING minor A/proposal.md:42 @21ae2165 The Known limit `label` names two places where the name of the first place shows the city twice: the geocoder label and the HUD tag. A third place is missing. The row of places shows `poi.name` on each button (locationControls.js:99), so the first button reads "Bank of America Plaza, Tampa". Add one sentence: "The row of places shows the same name." (7 words; the bullet then has 5 sentences.) This is a gap in a statement, not a false statement.

Both the major finding and the three minor findings of pre-review 2 and pre-review 3 are done in the files. I need no change to a scenario text or a test title.

Checked, no finding:
- Spec <-> test <-> code:
  - The merged spec equals the delta (specs/location-presets/spec.md:55-84). The scenario at line 65 has one meaning: an ordered list with 24 words, equal to the order in locations.test.mjs:790-836.
  - Only "Preset order" becomes false. The Purpose, "Location pills" and scenario 003 stay true.
  - Test 003 still proves its text. It checks the pill count, the keys, `pills[0]`, and the line `ids.indexOf('taiwan') < ids.indexOf('austin')`.
  - Each part of each scenario has a fault: 001 (three keys), 006 (name, elevation, four bounds, count, finite, inside, five names, order), 007 (three parts) and 008 (five numbers). There are 32 faults; mutations.txt has 32 lines and mutations-run.txt lines 4-35 match.
  - The values are literals (rule 14). The numbers in 008 come from `flyToPresetLocation()` and the pills from the real `LocationControls` (rule 15). The reversed-order fault fails 001 and 007.
- Ratchet: 926 scenarios and 926 verified (+3). Tests are 9639 (+3 from 9636) and traced are 3716 (+3). History shows `src/locations.js` lines 1605 to 1660 (+55). COVERAGE-DIFF is 55. The only error is REVIEW-MISSING.
- Claims:
  - Ten presets before the change (locations.js:27-578 without Tampa), and eleven pills.
  - The coordinates round correctly. Austin 500-550 m and -28 to -18; SF 420-1400 m and -30 to -20.
  - The name-collision rows follow from locations.js:899-913 and presetGeocoder.js:86; the HUD tag follows from hudLocality.js:51.
  - The two test files are not in ownership.json (upstream).
  - The 33 files in host-checks.txt equal my grep count.
  - `overflow-x: auto` is at location.css:84.
- Prose:
  - No banned word and no -ing word except `heading` in the markdown.
  - The longest sentences have 25 words (proposal.md:32, design.md:20).
  - Paragraphs and bullets have 6 sentences or fewer; the tasks have 17 words or fewer; the code spans have 3 words or fewer.
  - "view box" remains only in the old record places.txt:8, and rightly so.
  - The CHANGELOG entry has 3 sentences of 21 words or fewer.

Not checked: the 789 count, the lint counts (718 and 946), the OSM answers, the red-green run, and "two runs gave the same lines". I did not explain "12 owned" in the ratchet against "17 owned" in gates-docs; it is not a claim of the documents.

Reminder: review.md must record the rule 1 deviation, which is the rename in commit 0f18d842 before the scenario in commit 5991e1c2.
