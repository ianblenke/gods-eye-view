Verdict: PASS

Tree: `/home/ianblenke/docker/gev-work/ownership-gates`, commit 670c6778587f06cf81e2ab7e8aa6c18ce51bdd99. I read the files and logs only and ran no code. I found no critical or major finding, no bypass and no weaker gate.

Both pre-review 6 majors are closed.
- **ownership-018:** Both tagged tests now assert a clause. ownership.test.mjs:199 asserts the 5 line gaps and the two count-1 waivers. ownership.test.mjs:217 asserts "Owned gaps: 0 code files, 0 lines, 2 test files, 7 tests." The scenario text is true for the :217 body (3 + 4).
- **S159:** The message appears in exactly five places: ownership.mjs:91, spec.md:299, ownershipGate.test.mjs:343, and ownership.test.mjs:359 and :440.
- **Named faults:** The five faults in `pass9/named-*.log` fail at ownership.test.mjs:218, :50, :147 and :55, and at ownershipGate.test.mjs:138. The `{` case is covered at unit and gate level.
- **Order table:** Nine rows give seven tests. Row 1 is the coverage-ignore test at ownershipGate.test.mjs:641, and rows 7 and 8 are cases inside the :469 test.
- **Counts:** The test counts 50/40/49/11/228 and scenario IDs 001-054 match. Lint shows 0 errors.

Findings (all minor; accept by name or fix):

- [ ] FINDING minor specs/ownership/spec.md:185-189 (ownership-018) The WHEN lines describe one ledger with code gaps 2 and 3 and two test files. The last AND prints "0 code files, 0 lines" "for those test files without code gaps". Under that WHEN the line cannot be true, and no single test makes the whole WHEN (:199 has no test files, :217 has no code gaps). Both halves are asserted, so nothing is hidden. Fix: give the test-only ledger its own WHEN. Or add the two code entries to the :217 ledger and expect "2 code files, 5 lines, 2 test files, 7 tests.". The Math.max fault still fails :218.
- [ ] FINDING minor specs/ownership/spec.md:493 (ownership-054) "The gate writes no adopt record." is a separate sentence with no condition. The code is all-or-nothing (gates.mjs:617), but :641 has one script. It cannot tell "no record for that script" from "no record at all". Say "The adopt command writes no record for any script", or add a second clean script to :641.
- [ ] FINDING minor design.md:264 and spec.md:46,186 "valid waiver" is defined only in the design glossary, which is not copied to `openspec/specs` at archive. It has no referent for "same file". It omits the after-base and checked-change bound (`waiversOf`, ledger.mjs:253). It also omits the line-waiver bound `lines.length <= count` (ownership.mjs:149). Scenarios 004, 008 and 018 still have no AND line for the bounds (pre-review 6 F3). Tests tagged 004 and 008 prove them (ownership.test.mjs:79, :115, :165). The code is stricter than the definition, so this is no bypass.
- [ ] FINDING minor evidence.md:3266 "this pass uses no ... gate ... command" is false as written. The same block lists `node scripts/spec/gates.mjs lint`. Pass 8 said "full gate". Restore "full gate" or name lint.

I sent two numbered parts to team-lead by SendMessage. They cover the tests of each touched scenario and the clause each asserts, the fault line checks, and the Order-table mapping. They also list what I read and did not read, and the caveats. I did not do checks 6 and 8 (no gate output). I cannot confirm the lead's host runs that are still in progress.

---- Part 1 of 2 (sent to the lead by SendMessage) ----

Part 1 of 2 (spec adversary, pre-review 7, ownership-scoped-gates, commit 670c6778587f06cf81e2ab7e8aa6c18ce51bdd99 read from .git/refs/heads/ownership-gates). Read/Grep/Glob only, no code run. Verdict PASS, 4 minors, no critical/major, no bypass, no weaker gate. Part 2 follows.

ATTACK 1 - TESTS OF EACH SCENARIO THAT PASS 8/9 TOUCHED, AND THE CLAUSE EACH ASSERTS
- ownership-018: ownership.test.mjs:199 asserts WHEN 2+3 line gaps -> gapReport "Owned gaps: 2 code files, 5 lines, 0 test files, 0 tests." (THEN 5 line gaps); two count-1 waivers on one file with uncovered 2 -> faults() == [] (waivers waive 2); plus an extra single count-2 waiver case (not in the scenario, harmless). ownership.test.mjs:217 asserts the AND line: single.js {one:2,two:1}=3 and src/own/a.test.js {three:4}=4 -> exact array whose first element is "Owned gaps: 0 code files, 0 lines, 2 test files, 7 tests." The scenario text is true for the :217 body. Each 018 test asserts a clause; no other test carries 018 (links.json:3106-3107 lists both, with an old title for the first, which the ratchet rewrites).
- ownership-031 (wording-only edits "makes the gate print", "values"): gates.test.mjs:2627 asserts status 1, /ERROR LEDGER-ADOPT-FROM openspec\/trace\/history.jsonl/, no LEDGER-ADOPT-REACHED, spawn trap (stop before test run) = reached-record AND line. ownership.test.mjs:469 asserts isAdoptSource false for 8 strings plus null and 1, spawnSync calls === 0 = "values ... reads no merge parents" (null and 1 are in the list, so "values" is true). ownershipGate.test.mjs:333 asserts the literal error line (matches spec.md:299 byte for byte). :566/:445 cover the seven name forms.
- ownership-054 (coverage-ignore AND): ownershipGate.test.mjs:641 asserts status 1, /ERROR COVERAGE-IGNORE scripts\/qa-merge.mjs/ and zero adopt records, with a new script, no QA tag. Code path checked: qa-register.mjs:48-55 gives no synthetic header before the record exists, so inventory.mjs:43 keeps the file and coverage.mjs:181 flags it; gates.mjs:616-617 stops with no record. After a record exists the script leaves the inventory (no COVERAGE-IGNORE), and the WHEN binds the sentence to the adopt command, so no conflict. A new script with a valid header is outside the sentence ("with no QA tag"): F2 of pre-review 6 is closed.
- ownership-001 (test-only pass 9): ownership.test.mjs:55 and ownershipGate.test.mjs:138-140 add the `{` case. readOwnership catch (ownership.mjs:28) is shared by all causes; before pass 9 only parseOwnership('{') (:45) reached JSON.parse, so a rethrow of SyntaxError was untested. Now covered at unit (:55) and gate level (runGates:416 then report). Title "returns an error with the code OWNERSHIP-MANIFEST for an absent or invalid manifest file" is true; the `{` unit case asserts only .code (file and message are asserted for the absent and `{}` cases, same catch).

ATTACK 2 - FIVE NAMED FAULTS (logs in openspec/changes/ownership-scoped-gates/pass9/)
- test-count-sum: named-test-count-sum.log actual "2 test files, 4 tests" vs expected 7 at ownership.test.mjs:218:10; the 018 sum test at :199 passes. Sorted order single.js < src/own/a.test.js gives max = 4, as logged.
- absent-message-number: 'number' !== 'string' at :50:10 (the :51 notEqual would have passed with message 1, so :50 is the one that fails).
- config-adopt-sentence: regex /...run the adopt command\./ not matched at ownership.test.mjs:147:10 (the log shows the removed line as blank).
- syntax-catch-unit: SyntaxError from parseOwnership via readOwnership, thrown at ownership.test.mjs:55:16.
- syntax-catch-gate: SyntaxError from readOwnership at gates.mjs:416:21 via runGates and run(), thrown at ownershipGate.test.mjs:138:21.
Every line number equals the current file line. Pass 8 evidence "Named faults" line refs (:194 :195 :198 :199 :140 :146) are for tree d84cd029; the two lines pass 9 inserted at ownership.test.mjs:54-55 move them to :196 :197 :200 :201 :142 :148 in the final file. The section names its tree, so I did not report it.

ATTACK 3 - ORDER TABLE (tasks.md:181-193)
Nine rows, seven tests. Map: row 1 (7.11, drop-other-error-code) = ownershipGate.test.mjs:641 (evidence.md:2189 says that fault was killed by the coverage-ignore test; NOT the other-error mode of :602, which has a red pair and is the mode tasks.md:196 mentions); row 2 = ownership.test.mjs:457; row 3 = qaRegister; row 4 = ownership.test.mjs:469; rows 7 and 8 = cases 'x0123...' (prefix) and '00123...' (41 digits) inside :469; rows 5, 6, 9 = ownershipGate :618, :629, :653. Live ownershipGate titles with no red pair in pass9/order-title-map.json = :618, :629, :641, :653 = 4 (live 40 = 37 top-level + 3 loop tests, red 36). So 2 + 4 + 1 = 7. TRUE. Counts 48/50/2, 36/40/4, 48/49/1 agree with order-counts.log.

---- Part 2 of 2 (sent to the lead by SendMessage) ----

Part 2 of 2 (spec adversary, pre-review 7, commit 670c6778587f06cf81e2ab7e8aa6c18ce51bdd99). Checked clean, read / not read, caveats.

CHECKED CLEAN
- Requirement ownership-018 text against code: gapReport sums ledger.coverage[file].lines (ownership.mjs:162) and test instances (:163); coverageFaults ownWaivers (:137) filters file, sha, Number.isInteger(count), count > 0, and the metric filter is at :142 and :149. TRUE. Not "only": the sentence no longer claims it.
- proposal.md:125 "stays the same in five places": grep of live files finds ownership.mjs:91, spec.md:299, ownershipGate.test.mjs:343, ownership.test.mjs:359 and :440 = exactly five. TRUE.
- spec.md:270-296 (reached adopt record): glossary "reached adopt record" matches gap-ledger-096/105/106 (field reached, value true); validAdoptSources (ownership.mjs:89-95) throws before checkAdopts for a reached or plain record; gates.mjs:535-538 prints the code at HISTORY_FILE. TRUE.
- Rule 17: tasks.md 3.8-3.10 (image ratchet, review agents, final make gates) are still [ ]; sections 10 and 11 check only work the logs show. The config.yaml "last group" rule has been false since passes 2-9 appended groups after group 3; pass 9 adds no new violation.
- Rule 18: the diff changes no script, AGENTS.md or config.yaml (pass9/self-check.log says so; the diff file lists only change documents and two test files). Test edits only add assertions and rename one title. No box or number weakened.
- Numbers: ownership 50 / ownershipGate 40 / qaRegister 49 / v8Merge 11 / gates 228 (224 pass, 4 named host failures coverage-gate-024, -031, -048, spec-trace-039/040) in pass9/final-*.log. I counted 50 test( lines in ownership.test.mjs and 37 top-level + 3 loop tests in ownershipGate.test.mjs. Scenario IDs 001-054 present. Lint: "STE: 0 errors, 584 warnings." at pass9/lint-final.log:586. validate-final.log: "Change 'ownership-scoped-gates' is valid". No live use of "coverage item" in spec, design, proposal, tasks or tests (F7 closed). Glossary rows "check command", "DA record", "reached adopt record" are single-meaning and agree with the code and with LCOV record (design.md:221).
- Pre-review 6 minors: F2 closed, F4 closed (:50 and :147 now have faults), F5 closed, F6 closed (sentence + sections), F7 closed. F3 only partly closed (see finding 3 in my report).

NOT READ
evidence.md except the diff, 2650-2700, 2940-3070 and the Pass 9 block; qaRegister.test.mjs, v8Merge.test.mjs; gates.test.mjs outside 2600-2645 and grep hits; review folders pre-review-3..5 and rounds 1-2; mutation-results.json; trace files except grep hits in links.json/ids.json; AGENTS.md except grep of the owned/adopt lines; config.yaml (read through the log of the config fault); the python helpers and pass9/*.json beyond order-title-map.json and named-results.json.

CAVEATS
- Checks 6 and 8 (ledger, gate output errors) not done: no gate output was given, and the diff touches no trace file. links.json:3106 still has an old 018 title and ids/links will change at the image ratchet; I claim nothing about it.
- I read the working tree files and cannot tell committed lines from uncommitted ones. pass9/*.log files are covered by .gitignore *.log, but a grep of .git/index finds pass9/named-test-count-sum.log and pass8/named-*.log, so they are in the index (added with -f). Before the archive move, keep git add -f in mind (archive drops ignored *.log).
- I could not verify that the five fault runs came before the green runs, or the lead's host runs that are in progress. I claim nothing about gates.test, lint or validate beyond the worker's logs.
- Severity judgement: finding 1 (018 WHEN with two ledger states) is minor because every clause is asserted by a tagged test and nothing is hidden. If your scale counts a WHEN that no single test can make as a spec/test mismatch, it is the one that could be raised to major; the fix is small (add the two code entries to the :217 ledger and expect "2 code files, 5 lines, 2 test files, 7 tests.").
