Verdict: FAIL
Commit ca8f87fea3c0b06ca142f7b6f0d05eeb58e4fd87 (clone remove-pensacola-pack). No file changed. A = openspec/changes/archive/2026-10-10-remove-pensacola-pack.

- [ ] FINDING major A/evidence/host-checks.txt:10 "The last name in the pattern is the item id of the layer" is false. 3wFbqsFPLeKqOlIK is the id of the ArcGIS account in the layer address (services.arcgis.com/3wFbqsFPLeKqOlIK/arcgis/rest/services/..., from the deleted pensacola.js). The item id of the layer is 8c0046dd833347bea1c39decec1d3abb (scope-source-probe.md:120). Fix: "is the id of the ArcGIS account in the layer address". I searched the clone for 8c0046dd: no match outside the archive and the trace files, so the name is not needed in the pattern.
- [ ] FINDING major A/tasks.md:21 Box 3.2 "Run each CCTV test file on the host" is ticked, but the record (host-checks.txt:12) covers 22 files of src/data/cctv*.test.mjs; the two server globs match no file. Nine other CCTV test files are in no record: src/cctvFocusPolicy, src/cctvFocusRequest, src/devCctv, src/tooling/precomputeCctvHeights, src/ui/cctvControls, src/ui/cctvVideo, and src/layers/cctv/headingConfidence, source and videoPlayback. Rule 17. The round 1 wording "of `src/data`" was true. Fix: restore it, or run the nine files and extend the record. Also 3.1 "the names of the layer": the pattern holds escambia and cctvPensacola, which are not layer names. Fix: "the names of the pack and the layer".

- [ ] FINDING minor A/design.md:10 "Only the history stays" omits the count text in the README row that D3 (:22) keeps. Fix: add "and the count text in the README row (see D3)".

Round 1: all corrections are complete and true.
- design.md:4 and :10 no longer say that no part stays; the add entry of CHANGELOG.md is named in both.
- D2 (:15-17) is true: the 21 ids.json entries stay until a later ratchet (registry.mjs:89-93 skips a retired ID). links.json has no live-sources-010 to 030 key at this commit (count 0). The reason for the links edit matches the TRACE-LINKS-STALE of round 1.
- proposal.md:12-13 splits the CHANGELOG item from the retire item. The pr-605 text and "Retired scenarios:" are clear.
- CHANGELOG.md:3 has the date. The old add entry (:6-9) is unchanged.

Checked, no finding: the host-checks grep lists the same six CHANGELOG lines as my own search (3, 4, 6, 7, 8, 9). Boxes 4.1 to 4.3 have a record (ratchet history lines, retired-ids.json, links.json); boxes 4.4 to 4.6 are open. No banned word in the change documents. D2 has exactly 6 sentences; the longest sentence has 25 words (design.md:4). The drawTool.test.mjs check of CHANGELOG.md is in your brief; I did not run it.
