Verdict: FAIL
Tree read: clone vendored-tolerance, commit a746a532616cf8c69b6338acace40e816dcf6478 (working tree, change active). I ran no code. The 4 detail parts are already in your inbox by SendMessage.

- [ ] FINDING major openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:3 Pass 1 contradicts the base spec. specs/gap-ledger/spec.md:4 and :264 define the tolerance conditions with "the content of the base commit". Scenario gap-ledger-074 (:299-302) gives no tolerance to "other content than the base commit". Scenario 140 gives it to such a file. Scenarios 004, 008, 013, 054, 057 and 069 to 074 now use "the tolerance conditions" in two meanings. Scenarios 142 and 143 use the term for a file with no base content. An ADDED requirement cannot change 074. Fix: use a MODIFIED delta for Count tolerance and 074, or bound 074 by name in the new text.
- [ ] FINDING major openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:55 Pass 2 contradicts scenario 078 (base spec :62-68: "without the tolerance conditions, the gate records the entry as not current") and the Ratchet rule (:33 names only the tolerance conditions as an exception). The gate test for 147 uses a fork-edited adopted file with total 101 to 100 and equal not-covered counts, and the code does not mark it stale. Fix: modify 078 and the :33 sentence to name this second exception.
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:60 "The ratchet command MUST write the current total counts for that file" has no bound. For an adopted-as-is file whose total falls, toleranceCounts (ledger.mjs:217-227) keeps the entry total. Add "that differs from its adopted source".
- [ ] FINDING minor src/tooling/spec/ledger.test.mjs:743 Test 153 asserts `stale.some || errors.some`. On the gap side, COVERAGE-FAKE or LEDGER-UNLOADED always fires. The test passes with or without `gap.loaded` and `!gap.untrue` (ledger.mjs:429-430; evidence.md:278 admits no verdict changes). Assert the exact outcome per case. Remove the two operands or record them as accepted equivalents.
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:217 toleranceCounts keeps the entry count only when the covered count falls. A V8 split (not-covered +1, total +1) writes a larger count. compareWithBase (ledger.mjs:505, 549) then reports LEDGER-NOT-IN-BASE or LEDGER-MORE-THAN-BASE against the adopt count. gates.test.mjs:470-485 would not see it. This is probable, not observed. Add a gate test that runs the ratchet on that input, or name it in the Known limits.
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:429 Pass 2 sets no bound on the size of a total difference (pass 1 has 8 or 4%). The ledger's covered baseline (total minus not-covered) can lag or be hand-set. "This rule hides no coverage count" (proposal.md:35) over-claims. Bound it with toleranceOf, or add it to the Known limits.
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/proof.json:1 This file holds pass 1 only (a6eeca2a). The pass 2 proof (165 killed, 16 equivalent) is in gev-tools, but evidence.md:178 sends the owner to proof.json. Copy the pass 2 proof into the change, or change the pointer.
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:7 "MUST satisfy adoptsOf and checkAdopts" cites function names. Cite the requirement "Adoption of merged code" instead. Scenario 141 does not say which record (153 says "either record").

---- Part 1 of 4 (sent to the lead by SendMessage) ----

Part 1 of 4 (vendored-coverage-tolerance, commit a746a532616cf8c69b6338acace40e816dcf6478, working tree). Answers to attack items 1 to 3.

1. RULE 18. Inputs that failed before and pass now: (pass 1) a loaded, true-coverage file with entry hash == current hash, whose text equals `git show <from>:<file>` for an adopt line of this change that passes checkAdopts; counts move at most 8 or 4%. (pass 2) a valid record, same hash, equal not-covered counts for lines, branches and functions, both records loaded and true, totals differ. Both classes are inside what you listed. Checked each attack:
- Edited after the merge: adoptedAsIs compares text, so false (pass 1). Pass 2 still needs equal counts (tests 137, 148). Absent file: existsSync false (145); readFileAt returns null for a file absent at `from`, and null never equals a string.
- Other change: adoptsOf filters line.change === change (139, 150).
- `from` as short hash, branch name, HEAD^2 or a non-second-parent: mergedCommits.has(from) is an exact set test, so the line is not valid and LEDGER-ADOPT-FROM stays (138, 151).
- File the merge did not change: LEDGER-ADOPT-FILE, line not valid. Base history prefix: historyLinesOf slices after baseHistory.
- Untrue or unloaded: hasTolerance needs entry.loaded, gap.loaded, !untrue on both (141). No ledger entry: LEDGER-NEW-COVERAGE-GAP comes before any tolerance (last line of test 148).
- Residual: a person can merge a local branch and run adopt --from on it. That is rule 21, and the Known limits name it.

2. PASS 2 HIDES NOTHING? METRICS is lines, branches, functions (ledger.mjs:7). That is the whole list; an entry has no other count (untraced is a separate map). totalsOnly equals sameGap minus the totals compare (given loaded true and untrue false), so nothing else is dropped. LEDGER-LARGER-GAP and LEDGER-LOST-COVERAGE live in compareCoverageEntry and did not change; totalsOnly only matters when entryErrors is empty. Total grows with equal not-covered counts: covered grows, no loss. Total falls with equal not-covered counts: lossOf = min(0, fall) = 0, which scenario 078 already accepts (as stale). The only new effect is that the entry no longer has to refresh its totals (see findings 2 and 6). The ratchet never writes a worse count for a tolerant file (toleranceCounts); a pass-2 file is not tolerant, so next = gap, and the earlier blocking compare stops a larger gap first. See finding 5 for the one input I think writes a larger not-covered count.

3. ONE RULE. gates.mjs:595-605 computes adoptedFile and adoptedAsIs once, after ci selects the change (514), before the ratchet (610) and before compareLedger (657). gates-docs goes through the same runGateCommand (noMeasure only changes `measured`). init (537), rebaseline (566) and adopt (576) return before the predicates. The only call sites of compareLedger and ratchetLedger are gates.mjs:624 and 657. The ratchet's inner compareLedger gets adoptedAsIs but not adoptedFile; that is fine because LEDGER-STALE is in RATCHET_FIXES. Moving checkAdopts before the ratchet changes nothing: the ratchet writes coverage and measurement lines, no adopt lines, and reachedValid reads measured.current and baseLedger, not the ledger the ratchet rewrites. historyText re-read after the ratchet is not used by the adoption code.

---- Part 2 of 4 (sent to the lead by SendMessage) ----

Part 2 of 4 (commit a746a532). Answers to attack item 4, tests.

Scenario to test map (all 18 IDs have a tagged test and a task line; test tasks come before code tasks in tasks.md):
- 136: ledger test (+4 on each metric passes with adoptedAsIs, fails without; smaller gap; closed gap) and gate test over check, ci, ratchet.
- 137: ledger test (other hash gives three LEDGER-LARGER-GAP) and gate test (local edit gives LEDGER-STALE first merged.js).
- 138, 139, 145, 146: gate tests, each asserting LEDGER-STALE first merged.js (138 also LEDGER-ADOPT-FROM). 145's only observable is the crash from readFileSync (the missing file already gives sha undefined, which is stale); that matches the THEN "does not try to read".
- 140: ledger (no sameAsBase) and gate (merged.js is new). 141: ledger, both sides, asserts LEDGER-LARGER-GAP appears, so each operand of hasTolerance is observable for pass 1. 142: ledger, 19 vs 10 on total 400 and 2 vs 1 on total 24. 143: ledger, deepEqual on the whole entry and history []. 144: gate loop over check, ci, ratchet; the ratchet leg fails without adoptedAsIs in ratchetLedger (GATES-RATCHET) and the final branches === 0 assertion catches a worse write.
- 147: ledger (each metric, 399 and 401; ratchet writes 399 and 401) and gate (101 to 100, literal). 148: ledger, one metric at a time, +1 and -1, exact codes. 149: ledger and gate. 150, 151: gate. 152: ledger. 153: ledger, weak for the gap side (finding 4).
- The two extra gate tests tagged 069 and 081 assert their THEN lines (no LOST-COVERAGE or STALE for legacy.js; waiver accepted and STALE for the edited merged.js).

Rule 14: 147 uses the literal 100. adoptedNoise builds ledger values from the parsed stub lcov, but only as fixture; assertions use literals and regexes. Rule 15: tolerance comes from gapTolerance(gap.totals), the measured totals, not from the ledger.

Stub spawn (TOLERANCE_OPTIONS) writes lcov, guard, tests-main and coverage files, but only under the mkdtemp fixture root, the same pattern as gates.test.mjs lines 1400, 1611 and 2631. No new child process apart from the existing git helper. The new tests have no GUARDED_RUN; they start no real test process, so that is fine.

Numbers checked: ledger tests 90 to 100 (10 new: 136/140, 137, 141, 142, 143, 147, 148, 149, 152, 153); gate tests 227 to 239 (12 new: 136/140/144, 137, 138, 139, 145, 146, 069, 081, 147, 149, 150, 151). IDs 136 to 153 are free (highest in ids.json is 135; no hit in retired-ids.json). No gaps.json entry exists for scripts/spec/gates.mjs, scripts/spec/lib/ledger.mjs or the two test files, so "opens no gap and closes no gap" holds. scripts/spec and src/tooling/spec are outside the format scope (format-scope.json, format-runtime.json), so format:check is not at risk. Not asserted anywhere: LEDGER-NOT-IN-BASE after a ratchet on an adopted file (finding 5).

---- Part 3 of 4 (sent to the lead by SendMessage) ----

Part 3 of 4 (commit a746a532). Attack items 5 and 6.

Known limits: "Rule 21 still needs the owner to check the upstream remote and the merge second parent" is the main residual and it is true. Not in the section and not in the gates:
(a) The contradictions with gap-ledger-074, 078 and the Ratchet rule sentence (findings 1 and 2).
(b) Pass 2 sets no bound on the size of a total difference (finding 6); "hides no coverage count" over-claims.
(c) The closed-file arm (ledger.mjs:433-437; ledger test lines 639-640): an adopted-as-is file whose gap fully closes is no longer marked stale, so its old entry stays until a ratchet runs. Base-content files already behave this way and the Purpose line says "can have a smaller gap", but no scenario of the new requirement names it.
(d) checkAdopts puts `reached` lines in `valid`, so a reached record also feeds adoptedFile (pass 2). No test and no sentence covers it. A reached file has base content and already has tolerance, so the effect is small.
(e) The replay evidence uses the author's own stale-check-s3.mjs with a copy of the predicates, not the gate command (evidence.md:62-63, 300). The real proof is `make gates` in the image on the sync-3 tree.

Item 6, ownership-scoped-gates: it replaces `mergedCommits.has(from)` with isAdoptSource at gates.mjs:595-600 (the same lines this change moves and extends). Expect a textual conflict there; the new adoptedFile and adoptedAsIs lines sit directly under it, and adoptedAsIs's exact-hash assumption will hold once isAdoptSource requires a 40-hex hash. Not a defect of this change.

Brief discrepancy, not a finding: the brief says "7 named faults"; evidence.md lists 14 (pass 1) and 10 (pass 2).

---- Part 4 of 4 (sent to the lead by SendMessage) ----

Part 4 of 4 (commit a746a532, read from .git/refs/heads/vendored-tolerance).

Read: report-pre1.md; full.diff (all 746 lines); proposal.md, design.md, tasks.md, evidence.md, specs/gap-ledger/spec.md of the change; proof.json (first 70 lines, and grep for 0945baee, a9898, a9903, 125dc3ae: no hit, so it holds pass 1 only); scripts/spec/lib/ledger.mjs lines 1-260 and 330-730; scripts/spec/gates.mjs lines 425-742 and the grep of NODE_V8_COVERAGE; lib/git.mjs (readFileAt, mergeParents, changedByCommit); lib/ci.mjs planCi; the main openspec/specs/gap-ledger/spec.md lines 1-130 and 205-345, plus a grep of every "tolerance", "not current" and "stale" line in the whole file; gates.test.mjs lines 1-105, 1000-1140 and the new block; ledger.test.mjs helper lines 31-72 and the new block; scripts/format.mjs, format-scope.json, format-runtime.json; coverage.mjs parseLcov and contentHash.

Not read: openspec/config.yaml; the unchanged parts of both test files; main spec lines 387-640 except by grep; openspec/trace/history.jsonl and links.json (no ratchet has run, so the new IDs are not there yet); /tmp logs and the replay artifact; the ownership-scoped-gates change. I ran no code. Finding 5 is therefore a reading of toleranceCounts and compareWithBase, not an observed failure; a one-line gate test (ratchet, then no LEDGER-NOT-IN-BASE) settles it.
