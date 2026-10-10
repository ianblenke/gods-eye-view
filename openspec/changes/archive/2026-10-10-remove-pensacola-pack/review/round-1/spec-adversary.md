Verdict: FAIL
Commit 7c2426e5f4e012ee6e2c06a44cd2c17dbed3f8af (clone remove-pensacola-pack). No file changed. A = openspec/changes/archive/2026-10-10-remove-pensacola-pack.

- [ ] FINDING major A/design.md:10 (and :4) "go together. No part stays." contradicts D3 (:20-21): CHANGELOG.md keeps the entry that added the pack, and README.md keeps "Up to 4,000". :4 "removes every file, entry and requirement of that change" is false for the same two texts, and for the 21 entries that stay in ids.json. Fix for :10: "The module, its test, the catalog entry, the settings, the manifest entries and the pack text of the documents go together. Two texts stay (see D3)." Fix for :4: "removes the code, the settings, the document text and the requirements of the pack". I checked both against D3, CHANGELOG.md:3-9 and README.md.

- [ ] FINDING minor CHANGELOG.md:3 "Only 17 of the 65 cameras served a frame" has no date; the old entry (:7) says "On 2026-10-09". Fix: "On 2026-10-09 only 17 of the 65 cameras served a frame".
- [ ] FINDING minor A/design.md:15-16 D2 names the hand edit of retired-ids.json only. Also the hand edit of links.json (21 empty links) and the 21 entries that stay in ids.json are not named. The gate accepts both: registry.mjs:56-58 skips a retired ID, and the log rp-r1-gates-docs.txt shows no TRACE-LINKS-STALE at this commit. A later ratchet drops the ids.json entries (registry.mjs:89-93), as for gap-ledger-033. "stay in the registry" is ambiguous (retired-ids.json or ids.json). Fix: name both files.
- [ ] FINDING minor A/proposal.md:36-38 and A/evidence/host-checks.txt The search covers the word Pensacola and the settings. I also searched fl511, divas.cloud, images-dis, 3wFbqsFPLeKqOlIK, Escambia and cctvPensacola in the clone (not archive, trace, local_data): only CHANGELOG.md matches (the two entries). Fix: add these names to the search line of the evidence.

Answers to your questions:
- links.json hand edit: not a breach of rule 18. It removes only keys of scenarios that no spec has, which is what buildLinks gives. The edit is by text, and the gate checks the result.
- README "Up to 4,000" is true: DEFAULT_CCTV_MAX_SOURCES is 4000 (constants.js:14). The sum of the default pack caps after the removal is 4955 (the sum before the pack was added), which is above the cap.
- Rule 13: no new test is needed. The tests of the pack leave with the code, and nothing remains to fail. The gate stops on a retired ID in a test or a spec.

Checked, no finding:
- catalog.js, package-boundaries.json, format-scope.json, ownership.json (two paths), .env.example, DATA_SOURCES.md and CURRENT-STATE.md return to the blobs before cctv-pensacola (catalog 9bc3b70e; the same blob ids in the diff index lines).
- The delta lists the three requirements with scenarios 010-018 and 030, 019-025, 026-029 = 21 IDs. retired-ids.json is sorted and holds exactly those 21 more IDs.
- No test carries a retired ID.
- The gaps.json entry of catalog.js has 17/6/0, totals 287/54/33, and the pre-Pensacola hash.
- The numbers in the gates-docs log are consistent: 915 scenarios (936 - 21), 9600 tests (9685 - 85).
- The old record 2026-10-09-cctv-pensacola has no removal text.
- STE has no banned word, and the bullets and paragraphs are 6 sentences or fewer.
