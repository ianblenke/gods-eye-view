Verdict: FAIL
Commit read: c085ba4c5b4cad7876d98c6ef72b0e0f47f26051 (clone cyclones-early-advisory, scope full; change A not judged). I ran no code and no request. Paths are under openspec/changes/archive/2026-10-11-cyclones-early-advisory/.

- [ ] FINDING major proposal.md:37 (Known limit `row-time`) "The age label shows "just now", because `snapshotAgeSec()` in `src/data/layerSnapshot.js` clamps a negative age to 0" is false for the layer row. The row calls `this._timeAgo(stats.lastUpdate)` (src/ui/layerPanel.js:551 and :653), which returns "just now" when `diff < 5`; no panel or lifecycle file uses layerSnapshot.js. `snapshotAgeSec` serves only the provenance label (hud, voice and brief tools). Write: "The age label of the row shows "just now". `_timeAgo()` in `src/ui/layerPanel.js` gives "just now" for any age under 5 seconds, and a negative age is under 5 seconds. The age label in `src/data/layerSnapshot.js` also shows "just now", because `snapshotAgeSec()` clamps a negative age to 0." I checked this against the code: 9, 20 and 17 words, and the bullet then has 5 sentences.
- [ ] FINDING major evidence/host-checks.txt:1 "the evidence files and the documents changed in later commits only" is false. The merge a835553e (after 2685df14) brought the code and tests of change A (build/vite.js:104-105 has the new entries). Write: "The checks ran on the files of the commit 2685df14. Later commits change the evidence files and the documents of this change, and the merge commit a835553e brings the files of the change vite-deny-runtime-state." (12 and 24 words)

- [ ] FINDING minor proposal.md:29 "The two changed lines of `server/providers/cyclones.js`": the diff adds 3 lines (2 comment lines and the constant) and changes 1; COVERAGE-DIFF gives 15 - 11 = 4. Write "The two changed code lines".
- [ ] FINDING minor evidence/mutations.txt: the 26-minute case has no fault of its own (the 5-minute fault fails both cases). Add "Set the window to 25 minutes".
- [ ] FINDING minor CHANGELOG.md:5 the entry has no date, but the fork entries around it have one (2026-10-10).
- [ ] FINDING minor proposal.md:3-4 and live-feed.txt: the 22.7, 27.0 and 24.5 minutes compare `publicAdvisory.fileUpdateTime` with `lastUpdate` (the position time). For the field `forecastAdvisory.issuance` that the parser reads, the payload gives 22.7, 12.0 and 4.0 minutes (20:37:18, 20:47:56 and 20:55:59 against 21:00). Name the field in the Why.

Checked, no finding:
- The hunk equals #741: the blob id d580357c is the same in upstream-hunk.txt and r1-code.diff.
- The tests match the spec: literal 26, 90 and 1 ms; each AND line matches (key `issuedAt` for the advisory time, `positionAt` for the position time); the other field is EARLIER, which is valid.
- 12 faults: the script texts match the names and the run lines; each is attributed to the test it fails. They cover the window (5, 89, 91, none), both boundaries, both fields and the key swap.
- The tests came before the fix (commit order aa8725e5, then 26926eb0).
- ids and links in the trace; the ownership and format-scope entries (sorted); the spec delta is only appended (34 headings become 37); the Purpose is still true.
- cyclonesProxy.test.mjs is upstream class and its 11 tests still pass (its future case is 20 hours ahead).
- The client validator does not check the clock (source.js:20-28).
- The route sends the stale snapshot or none (cyclones.js:398-404).
- The arithmetic: 63 = 90 - 27; Last-Modified 23:56 against 00:00 is 4 minutes; 22.7, 27.0 and 24.5 recomputed from the payload.
- No banned word in the change documents, and the longest new sentence is 24 words.

Could not check: running code; "by the maintainer" for #741; the 12270 bytes of the payload; the gate lines for gates-docs (not there yet).
