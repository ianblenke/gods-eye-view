Verdict: PASS

Tree read: /home/ianblenke/docker/gev-work/director-3, branch backfill-director-3, commit c1c69e4e3733d85090593e406a1ccedfc9f96c9f. I ran no code. I found no critical or major finding. All findings are minor and can become Known limits.

- [ ] FINDING minor openspec/changes/archive/2026-10-08-backfill-director-packs-sharing/proposal.md:65 The four new Known limits sit under `## Pass 7 scope`, not under `## Known limits and later changes` (:30). The additive-edit limit for media types, formats and protocols (audit.md:233-241) is not in the proposal. The `[2, 3]` set at geojson.js:19 is in neither place, and the closed-sets table (audit.md:219-231) omits it. `[2, 3, 5]` passes all tests, because only lengths 1 and 4 are tested (backfill.test.mjs:2823). Move the bullets into the section and name the additive-edit limit for every closed set.

- [ ] FINDING minor openspec/changes/archive/2026-10-08-backfill-director-packs-sharing/audit.md:433 Rows :433, :435 and :437 name one test but list hand rows that other tests kill.
  - m432 and m434: "The export writes each asset index and filename" (mutations.md:12673, :12727).
  - m447: "The import stops after the second digest" (:13112).
  - m448: "The export stops after the second digest" (:13227).

  Name each killer in its row, or state one test for each hand row.

- [ ] FINDING minor src/director/sharing/sharing.test.mjs:2553 The title says "before the source reads the work promise", but `withShareSignal` reads it. Scenario 107 says "The helper attaches its listener before it reads the work promise". backfill.test.mjs:191 says "The source registers its listener…", but the session does it (scenario 089: "The session attaches the source listener…"). Name the helper and the session in the titles.

- [ ] FINDING minor openspec/specs/director/spec.md:865 The director-088 clause "calls the source and renderer for each data pack format" can be read as format selecting both. session.js:95-96 selects the source by `pack.source.adapter` and the renderer by `pack.format`. The clause is the only text on registry selection. State the source name for sources and the format for renderers.

- [ ] FINDING minor openspec/specs/director/spec.md:767 The rewording of director-079 dropped the order byteLength before digest. The test at backfill.test.mjs:105 still asserts it. The director-090 clause at :898, "validates the handle without the old source signal state", has two meanings: does not read it, or ignores it. The test (backfill.test.mjs:3039-3053) asserts that load returns false and the state is read zero times. Restore the order and state "does not read the old source signal state and returns false".

- [ ] FINDING minor src/director/packs/backfill.test.mjs:3257 Two new tests assert extra-field rejection under tags that do not state it. The media placement test carries [director-081], and scenario 081 (spec.md:783-788) has no extra-field clause. The geojson placement test carries [director-080], but scenario 080 covers image packs only. Scenario 077 states extra fields only in general. Add the clauses, or tag the tests 077.

Part 2 of 2 (checked clean, read and not-read lists) was sent to team-lead with SendMessage.

CHECKED CLEAN
- Two absent layers (sharing.test.mjs:2846): fixture has one shot in scene 'one'; the test sets layers {traffic, ships} and expects ['traffic','ships']. m449 slice(0,1) gives [traffic], m450 slice(1) gives [ships], m451 slice(0,-1) gives [traffic]; reverse and sort also fail on order. Input-side narrowing m465/m466 and scene/shot flatMap narrowing are killed by this test or by the 108/110 test ('later' in scene 1, shot 1).
- Registry test (backfill.test.mjs:3225): needs both entries. First-entry-only maps lose 'pictures' or 'image' and the session throws the stable error; a first-entry source lookup changes the calls array. m452-m454, m463, m464 valid.
- Allow-list tests: all 8 lists (manifest.js 34, 48, 51, 84-92 x3; bundle.js 78, 86) covered for script and adapters. Messages match fields() in documentFields.js:27-31. Added names other than extra/script/adapters pass: named as Known limit allowed-field-added-members.
- All 31 hand-row patterns (m449-m479) occur once in the named file; replacements are valid code; killer titles in mutations.md match the table except as in finding 2.
- geojson.js:20 last coordinate: tests for field 0, 1 and 2 not finite exist (backfill.test.mjs:2000-2019, [0,0,'bad']), so p.slice(0,2) is killed.
- Literal SHA-256 of bytes 1,2,3 is the standard value; m478/m479 killed by the literal-digest test.
- Traversal table: 52 rows = 66 tool operations (pass7/traversals.log) - 8 constructors without input - 1 media type Set - 5 grouped operations. lifetime.js has none. I found no loop, filter, map, every, some, reduce, entries, keys, values, spread, Set or Map copy that is missing. Run names consistent (rerun after pass 4 / final rerun = pass 5). One number (52) in proposal, design (x2), tasks, audit, evidence.
- Counts: 13 new tests = 7 + 6; 670 = 430 + 12 + 228; 479 rows = 448 + 31; 971 = 840 + 127 + 4. history.jsonl:2041-2053 all name this change (13 lines; the new one is 2053). gaps.json keeps one untraced test each in packs.test.mjs (:39) and sharing.test.mjs (:638) = ledger 12->1 and 10->1. links.json holds the new and renamed titles.
- Old titles removed from tests, spec, mutations.md and survivors.md (only evidence.md keeps them as Old records). Main spec and delta spec edits are identical in the diff. No requirement sentence changed. Production diff empty (evidence); no QA script in the diff.

READ
round6 report and diff (all hunks except the bodies of evidence.md before line 2990, mutations.md rows m001-m448 and survivors.md rows outside the changed hunks); the 7 production files; documentFields.js; the three test files at the changed hunks, the helpers and the neighbours I cited; main spec 715-1134; audit.md 1-489; design.md 100-182; proposal.md; tasks.md tail; checks.md; probe-feature-order.txt; evidence.md 2990-3500; round-4 and round-5 spec reports; mutations.md m409-m479 Test records; traversals.log and traversals.mjs; history.jsonl lines for this change; links.json and gaps.json by grep.

NOT READ
/home/ianblenke/docker/gev-tools/director-3/muts.json (I used the mutations.md Old/New spans); most of survivors.md; most of mutations.md m001-m408 and the automatic result files (saved results exist at automut/director-3-final2 but I did not compare labels); the evidence logs and probe outputs except probe-feature-order and probe-registry-order; the QA scripts; the STE wording; the rest of the three test files outside the slices I opened. I ran no code and could not confirm host test results, only the stated numbers.
