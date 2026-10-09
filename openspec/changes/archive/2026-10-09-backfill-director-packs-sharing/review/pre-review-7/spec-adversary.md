Verdict: FAIL

Tree: working tree of `/home/ianblenke/docker/gev-work/director-3`, branch backfill-director-3, HEAD `c8f4c17befae038bca3fee9efdbbe11dd356c95f`. I could not check for uncommitted changes, and I ran no code.

- [ ] FINDING major src/director/packs/backfill.test.mjs:2144 and :2149 Pass 8 titles say "rejects media fields in image placement" and "rejects image fields in media placement". Both bodies only call `doesNotThrow` on a valid pack. No image pack carries `anchorId` and no media pack carries bounds or height (grep). Adding `'anchorId'` to the image list (manifest.js:88), or `'bounds'` to the media list (:90), passes every test. The Known limit `allowed-field-added-members` admits this. The false titles are the killer records of m238 and m239 (mutations.md:6486, :6515 and the final lists; evidence.md:200, :215, :4767, :4772, :7770). Restore positive titles ("returns without an error for the fields of an image placement"), or add cross-field rejection tests with hand rows. The self-check `outcomeFailures: 0` missed this.
- [ ] FINDING minor backfill.test.mjs:2581 and :2858 Titles end "returns bytes" and "returns coordinates", but both tests assert that `session.load` returns true. :2341 and :2346 say "returns coordinates" but assert a count and an id length. :1712 "rejects image height outside both limits" rejects only 1000000001; -12001 is rejected at :786. sharing.test.mjs:2406 "return the project" asserts only the call order.
- [ ] FINDING minor spec.md:150, spec.md:327, backfill.test.mjs:542, sharing.test.mjs:364 Wrong actor. `PACK_LIMITS` is frozen in manifest.js (the validator) and `SHARE_LIMITS` in bundle.js, not in the session or `createSceneBundle`. survivors.md a0004 shows manifest.js:10 killed by "The session rejects...". Also, the :327 clause says "The export" but the test title says "The bundle helpers".
- [ ] FINDING minor spec.md:84 The director-082 clause lost "ignores". The test uses `Object.create({dataPacks:[null]})`, but a validator that checks a valid inherited list also meets the clause. Write "does not read a data pack list from the parent object of the scene and returns without an error".
- [ ] FINDING minor backfill.test.mjs:448-450 The rows 'extra placement field', 'placement object' and 'height reference' keep tag 080 but drive a GeoJSON `pack()`. Scenario 080 WHEN is an image pack. Pass 8 retagged only the script/adapters rows. Retag them 077 or use `imagePack()`.
- [ ] FINDING minor audit.md:259-260 "The table names each such set in the seven files" is false. These are missing:
  - `BUNDLE_SOURCE` 'scene-bundle' (bundle.js:100, preview.js:17).
  - The '.gevbundle.json' suffix (bundle.js:117).
  - The trailing slash (source.js:15).

  Add rows or narrow the claim.
- [ ] FINDING minor evidence.md:3236 "52 table rows" conflicts with audit.md:433 and evidence.md:6118 ("56 rows for 52 traversals").
- [ ] FINDING minor mutations.md:13231 "Final complete pass 6 output" keeps the pass 6 Command line but lists pass 8 titles. Say the labels were replaced, or point to the hand-last run (evidence.md:7529).

The `[2, 3, 5]` gap is named as a Known limit (proposal.md:68-73, audit.md:255-257), so I did not file it.

I sent the rest (checked clean, read, not read) to team-lead with SendMessage in 2 numbered parts, and sent both before this message.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (checked clean) for pre-review 7, tree: working tree of /home/ianblenke/docker/gev-work/director-3, branch backfill-director-3, HEAD c8f4c17befae038bca3fee9efdbbe11dd356c95f. I ran no code and could not check for uncommitted changes.

CHECKED CLEAN
- Pass 8 adds no test body. Every changed test line is a title, a template label or a tag cell (backfill.test.mjs:3253, :3255; sharing.test.mjs label 'it checks declared integrity'). No new process, /proc, file write or worker use.
- Spec delta: the 35 IDs 076-110 are unchanged. The requirements are ADDED with Origin: backfill and the requirement sentences are unchanged. No review/round-N file and no QA script is in the diff. The production diff is empty (file list in round7.diff).
- Registry (backfill.test.mjs:3225): sources assets/pictures selected by pack.source.adapter, renderers geojson/image by pack.format, and the calls array fixes the order. This matches the 088 clause and session.js:95-96. A first-entry-only lookup fails it.
- Allow-lists: 8 lists = manifest.js 34, 48, 51, 84-92 (x3) and bundle.js 78, 86. Tests: loop at backfill.test.mjs:3249-3266 (6) and sharing.test.mjs ~2855 (2). Both keys script and adapters are asserted, with the message per key. Hand rows m455-m462 add script only; adapters is covered by Known limit allowed-field-added-members. The retag to 077 matches the 077 clause "rejects extra fields". Both keys are still needed.
- Closed sets: [2, 3, 5] is named in proposal.md:68-73 and audit.md:255-257. Tests reject lengths 1 and 4 only. Accepted as a Known limit. The table rows at audit.md:224-243 match the code except the omissions in my finding on audit.md:259.
- Loop table: 56 rows (audit.md:438-493) for 52 traversals (4 extra rows: bundle.js:23, :84, :143 x2). Hand-last killers (evidence.md:7941-7980) equal the audit rows. m432, m434, m435 = sharing.test.mjs:90 (two packs, different paths, so slice(0,1) fails). m447/m448 = template at :2799. m409/m410 = template at :2658. m411/m412 = one test. The m447 mutation removes the post-digest check and adds one before the loop, so check number 5 never fires and assert.rejects fails.
- Hand-run provenance: evidence.md:7529-8012 (hand-last) has the mut-host command, 479 rows, survivors m172 and m389. The expansion of 47 clipped killer labels is disclosed at :8015.
- Numbers: 430+12+228=670; 479=448+31; 971=840+127+4; survivors m172, m389; 35 scenarios. One stale number: evidence.md:3236.
- Reworded clauses with an asserting test: 079 order (:105, :116); 088 registry; 089 order (:191, :265, :336); 090 (:347, :2968, :3039); 092 (:229 asserts reads 1 and renders 0; sharing.test.mjs:2157 setter asserts reads 1, the total 2 comes from JSON.stringify); 099; 105; 107 (:2658, :2799, :1953, :2553); 108/110 (:2717, :2846, :1475, :1403).
- links.json and gaps.json still hold pre-pass-8 titles. That is expected before the image ratchet; the ratchet must run on this tree.

CONSIDERED, NOT FILED
- readSceneShare post-text checkAbort (bundle.js:129): no test makes it throw. sharing.test.mjs:1548 counts 3 calls, :2406 checks order, and m234 replaces only its argument. The 107 clause "They reject cancellation" rests on the call count there. withShareSignal's own post-settle check (lifetime.js:18) is tested, and the glossary makes "share helpers" include both, so I did not file it. Add a test whose second throwIfAborted call throws if you want it closed.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (read and not read) for pre-review 7, same tree and HEAD c8f4c17befae038bca3fee9efdbbe11dd356c95f.

READ
- report-round7.md; round7.diff: the document hunks for audit.md, design.md, proposal.md, spec.md, tasks.md, probe-ranges.md, the head of survivors.md and mutations.md, evidence.md "Pass 8" (lines 6105-6800), both test file diffs in full.
- The delta spec in full; proposal.md in full; design.md 100-230; audit.md 195-515; the 7 production files in full.
- backfill.test.mjs lines 1-480, 1255-1335, 1555-1615, 1705-1735, 2135-2165, 2335-2380, 2575-2605, 2750-2775, 2850-2880, 3040-3267.
- sharing.test.mjs lines 80-110, 505-575, 585-690, 1090-1130, 1380-1410, 1475-1500, 1925-2025, 2150-2220, 2340-2470, 2700-2830.
- mutations.md rows m234, m237-m240, m431-m436, m446-m448 and the head of the pass 6 final list; evidence.md 3150-3490, 6090-6800, 7505-8043; the round 6 spec report.
- Grep-checked: polarity of every title with reject/accepts against doesNotThrow/throws in both test files; killers of m409-m479 in hand-last; closed-set literals in the 7 files; the m455-m462 titles.

NOT READ
- The rest of backfill.test.mjs, sharing.test.mjs and packs.test.mjs.
- QA scripts; the evidence logs and probe outputs; muts.json, expand-killers.py, check-echoes.py, self-check.py, codex-9.txt.
- The STE wording (the STE adversary has it).
- Most of the label-only rows of mutations.md and survivors.md, and tasks.md outside section 11.
- I did not check for duplicate test titles after the renames. The pass 7 preflight said duplicateTitles 0; the pass 8 evidence gives no duplicate count, so please confirm it.
- No gate output was supplied and no image run exists for pass 8.
