# Round 2, spec adversary (scope: diff 228f7221, tree commit 9060286f7f47b46ac51028c3db72d26dfdcf251b)

This file holds the final message of the agent as the lead received it.

Verdict: PASS
Commit 9060286f7f47b46ac51028c3db72d26dfdcf251b (clone cctv-pensacola). No file changed. A = openspec/changes/archive/2026-10-09-cctv-pensacola.

Round 1 majors, all three corrected, and the corrections add no major fault:
1. A/evidence/mutations.txt:12 now names "[live-sources-021] handles HTTP 503 with body" and :21 names the fault "Reject a latitude equal to the south boundary". Both titles are in r1-test-titles.txt (lines 50 and 85). scratch/faults2.py ran the two faults on the final test file, parsed the first failing "✖ [live-sources-0NN" line, and restored pensacola.js (it asserts this). Fault 030 is lat < BOUNDS.south changed to <=, which fails only the corner 30.2 -87.65. I checked all 21 failing-test titles against the 85 titles: every one exists.
2. Box 5.2: A/evidence/live-check.txt:39-55 (Run 3) matches scratch live-check-run3.txt line for line. fl-10416 and fl-9183 gave HTTP 200, image/jpeg, X-CCTV-Source upstream-image (cctv.js:504) and JPEG signature true, through the handler /api/cctv/frame. Three real requests. Box 5.2 is now true.
3. A/proposal.md:45: a0420 (resp.body?.cancel(), pensacola.js:108) is covered by the catch of discard; a0600 (error?.message, :151) matters only for a thrown null or undefined. The text is true. Numbers: 656 = 633 + 1 + 22 (automatic-mutations.txt table); 17 + 1 + 2 + 2 = 22; 17 of 65 and 48 match frame-census.txt.

- [ ] FINDING minor A/proposal.md:37,43 (commit 9060286f) The facts of 2026-10-08 ("FDOT does not host the layer", "5 dead frames of 66") have no file in the change. The only source is a memory note, which says 5 HTTP 404 and 1 no connection (6 not served). Fix: store the 2026-10-08 result in evidence/, or write "5 HTTP 404 and 1 no connection of 66".
- [ ] FINDING minor DATA_SOURCES.md:38 "Another ArcGIS account hosts it, and it has no license text": "it" is the account or the layer. The layer metadata has no license text (live-check scope probe). Same pattern in A/proposal.md:49 "and it gives the warning". Fix: repeat the noun.
- [ ] FINDING minor src/data/cctvPensacola.test.mjs:48 Round 1 recorded that 027 and 028 do not clear four settings (`test-env`), but not that setup() replaces process.env with a plain copy. Fix: add it to `test-env`, or restore the keys one by one.

Your question about the kept items: none is a major. The code comments are outside the lint (it reads .md only) and no rule in the major list names a sentence length in a comment. The 85 titles have no word of words, phrases or newWords (grep of the titles with the forms), and none is longer than 25 words.

Notes, not findings: the new text of .env.example, CHANGELOG.md and DATA_SOURCES.md is outside the three document-gate paths, and host-run.txt predates it. The final make gates runs the full tests, which include the files that read these texts (keySetupCore.test.mjs:381, bundleCredentials.test.mjs:15, drawTool.test.mjs:141, transitFeeds.test.mjs:216); run them on the host first. Every bullet of the proposal is 6 sentences or fewer (`mutants` has exactly 6). The new text has no banned word.

## Correction (second message of the agent)

Correction to my round 2 spec report (Verdict: PASS stays). Two references were wrong. (1) The title "[live-sources-030] checks area point 30.2 -87.65" is line 80 of r1-test-titles.txt, not 85. (2) "The layer metadata has no license text" comes from scope-source-probe.md (copyrightText and description are empty), not from live-check.txt. Nothing else changes.
