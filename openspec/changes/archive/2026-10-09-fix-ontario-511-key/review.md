# Review: fix-ontario-511-key

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-09
Gates: make gates CHANGE=fix-ontario-511-key passed
Rounds: 13
Scope: diff d46ce25d
Reviewed-Tree: 1cf5e3c133feaf4eb836007c22a0ada2a8114ce8f817e2124f02a0fd3db086f4

## Findings

Full agent reports: `review/pre-review-1/` to `review/pre-review-11/` (eleven pre-reviews of the working tree), `review/round-1/` (the first confirming round on the archived tree, scope `diff 90cbb4ab`: the spec adversary gave PASS, the STE adversary gave FAIL with one major) and `review/spec-adversary.md` and `review/ste-adversary.md` (the second confirming round, scope `diff d46ce25d`: PASS and PASS).

Record of the image ratchet (box 9.3 of tasks.md). The first image ratchet stopped with LEDGER-NEW-COVERAGE-GAP for two probe scripts in the evidence folder and gave no verdict. After the two scripts became text files, the second image ratchet ran with `make ratchet CHANGE=fix-ontario-511-key` in the Docker image `gods-eye-view:local`. Its log starts with `Command: ratchet`. The comparison lines are:

```text
Trace: 833 scenarios, 833 verified, 0 open. 8609 tests, 3558 traced, 5051 untraced.
Coverage: 942 files, 274 complete, 96 not loaded, 51 untrue.
ERROR REVIEW-MISSING openspec/changes/fix-ontario-511-key/review.md Change fix-ontario-511-key has no review.md
```

The only error was the missing review.md. The gap of `server/providers/cctv/sources.js` fell from 411 to 314 lines, from 107 to 103 branches and from 7 to 3 functions (box 9.4; `openspec/trace/history.jsonl`).

### Pre-reviews 1 to 11 (reports in review/pre-review-1/ to review/pre-review-11/)

Finding counts of each report (spec adversary / STE adversary): pre-review 1: 3 majors, 17 minors / 13 majors, 23 minors. Pre-review 2: 2, 7 / 6, 27. Pre-review 3: 2, 7 / 3, 26. Pre-review 4: 1, 4 / 2, 16. Pre-review 5: PASS, 8 minors / 2, 19. Pre-review 6: 1, 8 / 2, 16. Pre-review 7: PASS, 7 minors / 3, 13. Pre-review 8: 1, 5 / 2, 9. Pre-review 9: PASS, 4 minors / 1, 11. Pre-review 10: PASS, 4 minors / 1, 8. Pre-review 11: PASS, 6 minors / PASS, 6 minors.

- [x] FINDING major (spec-adversary and ste-adversary, pre-reviews 1 to 10: 10 spec majors and 35 STE majors) Spec text and test titles that claimed more than their bodies assert, words with two meanings, false sentences in the proposal and the evidence, missing channel and mutation records, and old records that a later pass rewrote with a newer fact. Each was corrected in the next pass; the pass blocks of evidence.md record every correction.
- [x] FINDING minor (spec-adversary and ste-adversary, pre-reviews 1 to 10) Wording, labels, counts, glossary rows and line pointers. Corrected in the next pass, or recorded below.

### Confirming round 1 (scope diff 90cbb4ab, reports in review/round-1/)

- [x] FINDING major (ste-adversary) The Purpose sentence that the lead wrote at archive time was not the sentence of design.md:107-110 and used the words "credential" and "covers". Corrected: openspec/specs/live-sources/spec.md now has the sentence of design.md word for word ("The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules."). The edit changes no ledger hash. The second confirming round checked it.
- [x] FINDING minor (spec-adversary and ste-adversary) The three open boxes 9.2, 9.3 and 9.4 were done. Corrected: they are checked. The count is now 116 of 120 tasks, 4 open (9.1, 9.5, 9.6, 9.7). Boxes 9.5, 9.6 and 9.7 are the review, this file and the final gate run.
- [x] FINDING minor (spec-adversary) The proposal names the ratchet commit `60099724` of an earlier ratchet, while history.jsonl records `37137e64`; the Impact section does not name the directionText.js branch total. The numbers agree. The ratchet changed gaps.json, history.jsonl, ids.json and links.json. The directionText.js entry (`src/data/directionText.js`, branch total 32 to 33, not-covered count unchanged) is a measurement shift of a file that this change does not own; no gap opens or closes. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (ste-adversary) The title "Reject a non-array response" of scenario live-sources-009: in this capability "reject" means a promise rejection, and the scenario says the loader returns an empty list. The body is clear. A new title needs a new image ratchet. Accepted by the lead by name; recorded as a known limit; the owner confirms in the pull request.

### Confirming round 2 (PASS / PASS)

- [x] FINDING minor (spec-adversary) Box 9.3 had no record in the change. Corrected in this file: the ratchet verdict lines are quoted above.
- [x] FINDING minor (spec-adversary) Box 9.1 (the coverage reader issue) stays open while box 9.3 is checked. The image ratchet found no gap for `ontarioRequest.js` and no entry in gaps.json or history.jsonl. Box 9.1 stays open: the lead accepts the open reader issue by name. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (ste-adversary) The text "114 of 120, 6 open" in `review/round-1/ste-adversary.md` is a dated record. The live count is 116 of 120 tasks, 4 open.
- [x] FINDING minor (ste-adversary) Box 9.3 needs a record inside the change. Corrected in this file (see the quoted ratchet lines above).

### Known limits that the lead keeps

- [x] FINDING minor (lead, pre-review 11 and the confirming rounds, 12 minors of pre-review 11 plus the optional wording at proposal.md:43) Wording of notes in the Pass 8 to Pass 12 blocks of evidence.md (labels T and U, the words "gains" and "ran again", the links of the Pass 10 block to two Pass 11 outputs, the Command line of repeated-titles.json, links to corrections-search.log and status-ignored-first.log) and the word "covers" at proposal.md:43. None decides a verdict. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) The Pass 5 scratch tree `/tmp/ont-pass5-tree` held the Pass 5 tests during the named runs and older Key and Rows test files during the automatic mutation run (evidence S18). Pass 6 reran all 140 mutants on the live tests with the same nine survivors, so no verdict depends on the older copy. The equivalence probes of the nine survivors were not run again after that rerun. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) A throw inside `refreshCctvSources` does not move the cache time (`catalog.js:256`). On data that fails every time, "at most once in 15 minutes" at proposal.md:43 then fails. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) The lead accepts by name the limit of proposal.md lines 76 to 78 (evidence E7): the evidence does not show the order of the Pass 5 changes to the tests and to the scenario text. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) The Known limits of proposal.md that the lead keeps: the reset hook of `server/providers/cctv/ontarioRequest.js` for tests (line 49), the console channels that the tests do not watch (line 57), the clauses of scenarios 004, 005 and 008 that name no console channel (lines 72 to 74), and that no worker ran the console probe on Node 24.14.0 (line 69; the CI matrix runs Node 24.14.0 and 26.x, the Docker image runs Node 24.21.0). The README phrase "poses are first estimates" is a decision of the lead (evidence.md, Pass 4). Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) Rule 18 and the stored scripts: the first image ratchet counted two probe scripts in the evidence folder (a `.sh` file and a `.mjs` file) as new code files that no test loads. The lead stored them as `evidence/pass6/automatic-rerun.sh.txt` and `evidence/pass6/console-probe.mjs.txt`; no gate changed. The reports `pre-review-5/spec-adversary.md` and `pre-review-6/spec-adversary.md` cite the old names. The archive does not hold about 15 scripts that evidence.md cites in `gev-tools` and `/tmp`; it holds eleven `.py` scripts and the two text files, and no gate measures them. Recorded as a known limit; the owner confirms in the pull request.
- [x] FINDING minor (lead) Tasks 9.5, 9.6 and 9.7 are the two review rounds, this file and the final gate run. They stay unchecked because tasks.md is part of the reviewed tree.
- [x] FINDING minor (lead) The Ontario 511 developer key: the owner must register a key at https://511on.ca/developers/doc. Free access to the key is not confirmed. The pack makes no request without the key.
