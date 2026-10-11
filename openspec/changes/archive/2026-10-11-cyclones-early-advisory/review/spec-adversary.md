Verdict: PASS
Commit read: 90e3077e9aff10bc9a407405ab0d98e340f199e7 (clone cyclones-early-advisory, scope diff c085ba4c plus the round 1 majors). I ran no code and no request. No critical and no major finding. Paths are under openspec/changes/archive/2026-10-11-cyclones-early-advisory/.

Round 1 majors, checked in the files:
- proposal.md:38 `row-time` now matches the code: layerPanel.js:551 calls `_timeAgo`, :653-655 returns "just now" for `diff < 5`, and a negative diff is under 5; layerSnapshot.js:72 clamps with `Math.max(0, ...)`; getStats() takes `Date.parse(storm.issuedAt)` for a selected storm (index.js:439-441). The bullet has 5 sentences and the longest has 20 words.
- evidence/host-checks.txt: the commit cd5716e2 exists (.git/logs/HEAD line 15, made 02:10:56Z, before the stated read time 02:21:11Z) and holds the merge a835553e and the trace records. The values agree: 974 modules; the layer token line "30 published, 0 new"; 1341 files (1340 plus the test file of change A); 2 and 11 tests (cyclonesProxy.test.mjs has 11 tests); lint 0 errors, 716 warnings (A's own check also gives 716). "make gates does not run make precheck" is true: the Makefile `gates:` recipe runs only `gates.mjs check` (Makefile:42-43), and `precheck:` is a separate target (:48-49).
- design.md:4 "each time that `parseCycloneStatus()` gives to it" is true: iso() has two callers (cyclones.js:105 and :107).

Other corrections, checked:
- Impact says "two changed code lines". The Why names the fields and now has 4, 3 and 5 sentences in its three paragraphs; "five clocks" is the 5 rows of live-feed.txt; 22.7, 27.0 and 24.5 recompute from the payload.
- live-feed.txt: rows 1 and 2 are headers (Date, Last-Modified), rows 3 to 5 are chosen. The blob fede1aad is the old blob in both upstream-hunk.txt and r1-code.diff, and A did not touch cyclones.js, so the claim "6e54707e (the blob fede1aad)" holds.
- `window`: 63 = 90 - 27, and the new fast and slow wording is right; the longest sentence has 24 words.
- Task 3.3 has one instruction. The CHANGELOG date 2026-10-10 equals the local date of the fix commit (1791679210 is 20:40 at -0400). No banned word in the change documents (the matches in CHANGELOG.md are old upstream entries).

Accepted by name, none is major:
- (a) The fault "Set the window to 25 minutes": any window that rejects 26 minutes also rejects 90, so no window fault isolates the 26-minute case. My round 1 minor was wrong.
- (b) "gives the storm" has one meaning (it returns an array that holds the storm; the test asserts length 1).
- (c) "stamp" and "nominal" are not on the word lists; "nominal" is in the title of #741.
- (d) "window" and "limit": the Known limit names the 90-minute window, and the old check was the limit.

- [ ] FINDING minor evidence/host-checks.txt:1 "The checks below ran on the files of the commit 2685df14" conflicts with the last section, which ran on cd5716e2. The next sentences clear this up. Write "The first sections below ran on the files of the commit 2685df14."

Open minors for review.md, by name: the one above, and the accepted items (a) to (d).

Could not check: running code; the author record of #741 (gh output is only summarized in upstream-hunk.txt:3); whether "make gates" runs no format check inside gates.mjs (I checked only the Makefile).
