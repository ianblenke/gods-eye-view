Verdict: PASS
Tip commit 9515c3d9, scope diff 698fa03f. C = openspec/changes/archive/2026-10-17-beemaps-frames-limits. I found no critical or major finding.

Check of my round-2 findings. The code and Grep results are the source for each result.
- **`frames-dropped-by-route`:** corrected. source.js:6 sets `FRAME_LIMIT` to 200 and :62 sends it. beemaps.js:208 cuts with `entry.frames.slice(0, limit)`. upstream.js has no limit parameter, so "the route sends no more" and "the route drops the others" are true. Grep for `frames-dropped` finds the old name only in review files.
- **"Nothing else sends a request":** corrected. DATA_SOURCES.md:116 now says "No other action sends a request for frames." In index.js, `press()` (:95) is the only caller of `source.getFrames`. `update()` sends only the status request.
- **`comment-in-proxy-test`:** the claim is true. In beemapsProxy.test.mjs:993-996 the cache folder is a file, and `budget.js:33` reads `budget.json` under it. That read fails with ENOTDIR, not ENOENT, so `load()` throws and `reserve()` returns 'unavailable'. The credit file uses a fake fs, so it does not fail. beemapsBudget.test.mjs:259 is a test of `createBudget` tagged 017 with a failing `writeFile`.
- **"count", "A restart keeps the count", "It splits", "fixes the text":** corrected in proposal.md:16, 29, 51, 60, 67, design.md:86 and DATA_SOURCES.md:108.
- **"whether":** kept. The same sentence is in the DATA_SOURCES.md of main at line 108, so it is old text. It is accepted.
- **Length:** the longest new sentence is proposal.md:15, with exactly 25 words. The CHANGELOG entry has 6 sentences. No new paragraph has more than 4.

New faults that the corrections add. All are minor.

- [ ] FINDING minor proposal.md:72 (9515c3d9) "the failed read" and "the failed write" use verbs as nouns. The correction added both. Write: "So the test stops at the step that reads the budget file. The test in `src/data/beemapsBudget.test.mjs` shows what happens when the plugin cannot write that file."
- [ ] FINDING minor proposal.md:15, DATA_SOURCES.md:112, CHANGELOG.md:9 (9515c3d9) "it has/names the credits when the answer reports them" can mean "only when". The ok line always has the fields `creditsUsed=`, `creditsRemaining=` and `cost=`, with the value "none" when the answer has no number (beemaps.js:173, design.md:70). A line for a status failure or a timeout has no credit field. Under the "only when" meaning the sentence is false for the ok line. Write: "The line of an answer that Bee Maps sent has the credits, or "none" when the answer has no number."
- [ ] FINDING minor DATA_SOURCES.md:112, CHANGELOG.md:9 (9515c3d9) "one line" / "one log line for each upstream request" is not exact. When the credit file write fails, the route first writes "[beemaps] credits file not written" (beemaps.js:162-164, spec 035), so one request gives two lines. The next sentence says "the line has the status", so a reader takes it as the result line. Write: "one result line".

Accepted minors from round 1 and round 2 stay open: the test titles, the log text "credits file not written", the comment at beemaps.js:24 and "whether". Their reasons are true and none has a banned word.
