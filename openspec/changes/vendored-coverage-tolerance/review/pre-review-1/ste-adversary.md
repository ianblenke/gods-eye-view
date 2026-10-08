Verdict: FAIL

Part 1 of 5. Tree: clone /home/ianblenke/docker/gev-work/vendored-tolerance, branch vendored-tolerance, commit a746a532616cf8c69b6338acace40e816dcf6478. The working tree matches full.diff. Parts 2 to 5 are in your inbox: majors 7 to 12, two parts of minors, and the clean checks with the read and not-read lists. D = openspec/changes/vendored-coverage-tolerance.

- [ ] FINDING major D/specs/gap-ledger/spec.md:3,32,36,40,55,56,63,69,86 "adopted file" has two meanings. In pass 1 (:3,32,36,40) it means a file that equals its adopted source. In pass 2 (:55,56,63) it means any file with a valid adopt line, even one that differs from its source. The base spec (:423,:472) and the code `adoptedFile` agree with pass 2. -> Pass 1: "a file that equals its adopted source". Keep "adopted file" for pass 2.

- [ ] FINDING major spec.md:4,7,19 "source" has two meanings. At :4 it is the content at the from commit ("equals its valid adopted source"). At :7 it is the adopt line ("The source MUST satisfy adoptsOf and checkAdopts"), and at :19 ("invalid source"). tasks.md:14 "source file record" (a code file) and tasks.md:46 "source commit" add more. -> ":7 The adopt line MUST pass adoptsOf and checkAdopts. The content of the file MUST equal its content at the `from` commit."

- [ ] FINDING major spec.md:5,57,64,90 "Both records" and "either record" have no antecedent. They also clash with "adopt record" (:20,:24,:44,:48,:52,:73,:77,:81), because the base spec says "adopt line" and an adopt line also has the field `untrue` (base :476,:493). So :90 can mean the adopt line. -> "Both the ledger entry and the current gap MUST…"; ":90 the ledger entry or the current gap has untrue coverage". Use "adopt line" in every file (design.md:9,15,31 too).

- [ ] FINDING major spec.md:58-59 "that file" has two antecedents (:56 and :58). The code disagrees with the :56 reading. `toleranceCounts` (scripts/spec/lib/ledger.mjs:224-225) keeps the entry total for a metric with a lost covered count. So for a file that equals its source, ":59 MUST write the current total counts" is false. -> ":59 The ratchet command MUST write the current total counts for a valid adopted file that differs from its adopted source."

- [ ] FINDING major D/evidence.md:75 "A zero-stale result for all four files would conflict with the owner's rule" is false for the final change. evidence.md:313-315 reports "Pass 2 | None" and "The new run has 0". -> ":75 At pass 1 the source check rejects src/keySetupCore.mjs. Pass 2 clears it, because only its total counts differ." Add "At pass 1" to :68-69.

- [ ] FINDING major D/proposal.md:30 "Count tolerance applies only to files that equal the adopted upstream commit" is false. A file with base content keeps its count tolerance (base spec gap-ledger-069, `sameAsBase(file) ||` at ledger.mjs:188), and a file cannot equal a commit. -> "Count tolerance applies to a file with base content and to a file that equals its adopted source. A fork edit of an adopted file gets no count tolerance."

---- Part 2 of 5 (sent to the lead by SendMessage) ----

Part 2 of 5 (STE pre-review 1, vendored-coverage-tolerance, commit a746a532616cf8c69b6338acace40e816dcf6478). D = openspec/changes/vendored-coverage-tolerance. Majors 7-12. The verdict and majors 1-6 are in part 1 (my final message).

- [ ] FINDING major D/specs/gap-ledger/spec.md:36,40 "an adopted file with the tolerance conditions" has two meanings. The base requirement (openspec/specs/gap-ledger/spec.md:264) defines the conditions with base content, and base scenario gap-ledger-074 (:299-302) gives no tolerance to other content. Scenario :27-29 (a new file without base content) gives tolerance, so two scenarios give opposite results for one input. design.md:39-40 calls this an exception, but 074 names none. -> :36 "a loaded file with true coverage that equals its adopted source and has the hash of its ledger entry exceeds the count tolerance"; same shape at :40; add to the requirement text: "This requirement is an exception to the base content condition of the requirement "Count tolerance"."

- [ ] FINDING major spec.md:69-70 (gap-ledger-148) "that adopted file" has no antecedent in its own scenario, and ":70 keeps each coverage error and the stale rule exact" has no testable meaning. ledger.test.mjs:1569-1584 asserts LEDGER-LARGER-GAP or LEDGER-LOST-COVERAGE for a larger count and LEDGER-STALE for a smaller count; the scenario names neither. A reader can take "that adopted file" as a file that equals its source: then the count tolerance applies and "exact" is false. -> ":69 WHEN a valid adopted file has equal hashes and true loaded coverage, and a not-covered count differs from its ledger entry; :70 THEN the gate reports LEDGER-LARGER-GAP or LEDGER-LOST-COVERAGE for a larger count; AND the gate records the entry as stale for a smaller count".

- [ ] FINDING major spec.md:13,65,74,78,82,87 "stale" has three objects: "counts" (:13), "the file" (:65), "total count differences" (:74,78,82,87). The base spec says "record the entry as not current" (base :67,:272,:342,:375) and the code pushes {kind:'coverage', file}. No scenario says the effect (the build stops until the ratchet command runs, base :375). "The stale rule" (spec.md:8,70; design.md:24) and "stale decision" (design.md:31) have no definition. -> in each place: "the gate records the entry of the file as stale, and the build stops until the ratchet command runs".

- [ ] FINDING major D/proposal.md:35 "This rule hides no coverage count" has two readings and one is false. By spec.md:66 a total of 400 can become 399 with an equal not-covered count, so the covered count falls and the rule accepts it. -> "This rule hides no not-covered count. It accepts a difference in the total counts, and the covered counts that follow." Also :34 "The second rule" -> "The requirement Total counts for adopted files".

- [ ] FINDING major D/proposal.md:32 vs D/evidence.md:238,466: the proposal says "the owner" checks the upstream remote and the merge second parent; the evidence says "The lead" checks it. AGENTS.md rule 21 says "The person who merges". Two actors for one duty. Rule 21 also needs that person to record the result in review.md; the Known limits omit it. -> in both files: "Rule 21 needs the person who merges to check the merged commit against the upstream remote and to record the result in review.md."

- [ ] FINDING major D/evidence.md:3,291 vs :192,416,421,431 "base" has two meanings: e2437f94 (main; :3 "Base commit", :291 "Replay base commit", :192 "The base ledger command has 90 tests") and 125dc3ae (the pass 1 tip; :416 "Base code and test commit", :421 "The base command reports 95 tests", :431 table "Base tests"). The gate base is a third use (spec.md:20). A reader who compares test counts can use the wrong tree. -> "Main commit e2437f94", "Pass 1 commit 125dc3ae", table columns "Pass 1 tests" and "Pass 2 tests"; use "base commit" only for the gate base.

---- Part 3 of 5 (sent to the lead by SendMessage) ----

Part 3 of 5 (STE pre-review 1, commit a746a532). Minor findings for spec.md and design.md. D = openspec/changes/vendored-coverage-tolerance.

- [ ] FINDING minor D/specs/gap-ledger/spec.md:12,16,28 "equals ... its ledger hash", "differs from ... its ledger hash": a file does not equal a hash. -> "its content hash equals the hash in its ledger entry".
- [ ] FINDING minor spec.md:56,63 "valid adopted file": "valid" belongs to the adopt line. -> "a file with a valid adopt line of the checked change".
- [ ] FINDING minor spec.md:8,13,29,36 "the same count tolerance", "the same tolerance size" have no referent. -> "the count tolerance of the requirement "Count tolerance"".
- [ ] FINDING minor spec.md:17,21,25,33,49,53, proposal.md:31, design.md:39-40, evidence.md:69,300 "no new tolerance", "the new rule", "now" are time words that go old after archive. -> "no tolerance from this requirement".
- [ ] FINDING minor spec.md:12 "of this change" -> "of the checked change" (as :4,56).
- [ ] FINDING minor spec.md:66 "such as 399 or 401 from 400, or 100 from 101"; "current totals" differs from "current total counts" (:59). -> "the ratchet command writes the current total counts, for example 399 or 401 for an entry total of 400".
- [ ] FINDING minor spec.md:44-45 "ci, check or the ratchet command checks a change" (the ratchet command does not check); "valid source and current content checks" has two readings. -> "the ci command, the check command or the ratchet command runs for a change with adopt lines"; "each command checks the adopt line and compares the content of the file with its content at the `from` commit in the same way".
- [ ] FINDING minor spec.md:48-49 "that current file" (the file is absent); "lacks" (I am not sure that STE approves it). -> "a file that the current tree does not have"; "does not read the file".
- [ ] FINDING minor spec.md:8,21,35,39,70,83,85,89 "keep" has four meanings: apply again (:8,:35), report again (:21,:83), compare with no tolerance (:70,:85,:89), write (:39). -> ":21 still reports the error LEDGER-ADOPT-FROM"; ":35 Apply the count limits"; ":85 Compare another hash with no tolerance".
- [ ] FINDING minor spec.md:20,81, design.md:13, proposal.md:32 "no merge after the base brought", "merge second parent", "the merge parent" name one thing. The base spec says "merged commit" (base :413,:458); git.mjs:46 accepts each parent except the first. -> "a commit that is not a merged commit".
- [ ] FINDING minor spec.md:52-53, proposal.md:31, gates.test.mjs:2719 "production file" -> "code file" (base spec term).
- [ ] FINDING minor spec.md:57 "equal not-covered counts" names no metric; design.md:31 says "for all metrics". -> "equal not-covered counts of lines, branches and functions".
- [ ] FINDING minor design.md:15-16 "git show at the from commit"; "Other source content gives no evidence, also after a conflict that a person resolves by hand". -> "If the current file differs from its content at the `from` commit, the file gives no evidence. This includes a conflict that a person resolves by hand."
- [ ] FINDING minor design.md:22 "All three commands" (the design never names check). -> "The ci, check and ratchet commands use the same predicate."
- [ ] FINDING minor design.md:23 "each eligible entry" ("eligible" is not an approved word). -> "each entry that has the tolerance conditions".
- [ ] FINDING minor design.md:30 "it" has two antecedents (the predicate, compareLedger). -> "The gate computes the predicate from the same valid adopt lines as adoptedAsIs, without a source content check."
- [ ] FINDING minor design.md:33 "its current total count rule": "current" means "existing" here and "measured" elsewhere. -> "its existing rule for total counts".
- [ ] FINDING minor design.md:1,28 "Read commit:" ("read" is on the nounVerbs list; imperative or label?). -> "Commit read:".

---- Part 4 of 5 (sent to the lead by SendMessage) ----

Part 4 of 5 (STE pre-review 1, commit a746a532). Minor findings for proposal.md, tasks.md, test titles, code comments and evidence.md. D = openspec/changes/vendored-coverage-tolerance.

- [ ] FINDING minor D/proposal.md:5 (also :35, design.md:33) "Fork edits can also have different total counts": edits have no counts. -> "A file that the fork edits can also have different total counts and equal not-covered counts."
- [ ] FINDING minor proposal.md:18 names one requirement; the change adds two. -> add "Total counts for adopted files".
- [ ] FINDING minor proposal.md:34, design.md:26, tasks.md:16 "The second rule", "Pass 2", "the pass 2 total count requirement" name one requirement three ways. -> the title "Total counts for adopted files".
- [ ] FINDING minor proposal.md:27 "whichever is less" -> "the smaller of the two numbers". proposal.md:3 "Background work" is vague -> name the work.
- [ ] FINDING minor evidence.md:124 "Thus" -> delete it. evidence.md:463 "required" is a form of the listed word "require" -> "the heading that the owner names".
- [ ] FINDING minor verbs as nouns: proposal.md:5,35 and design.md:33 "edits"; tasks.md:44-45 "Check OpenSpec JSON", "Run OpenSpec validation"; evidence.md:56,68,81,144,379 "replay", "the before run", "such a stop", "A failed-test stop". -> "Check the JSON output of `openspec show`"; "Validate the change with OpenSpec"; "the mutation fails a test".
- [ ] FINDING minor tasks.md:35 "Commit the change": "change" is the OpenSpec change or the code. -> "Commit the code, the tests and the change folder."
- [ ] FINDING minor tasks.md:31,40 "Run each named code fault", "Run named mutations" use two words for one thing (evidence.md:264 has the header "Fault" under "Named mutations"). -> "Run each named mutation".
- [ ] FINDING minor tasks.md:14 "the source file record" -> "the adopt line of the code file"; tasks.md:46 "the source commit" -> "the commit that design.md names".
- [ ] FINDING minor tasks.md:3 names three documents in one task. -> three tasks, or accept as one action.
- [ ] FINDING minor test titles. ledger.test.mjs:1499 "count noise" (the spec says "count tolerance") -> "allow a count difference inside the tolerance for a new adopted file". :1532 "stop adopted counts outside the count limits" (a count does not stop) -> "report an error for adopted counts outside the count limits". :1540 "adopted entry" -> "the ledger entry of an adopted file". :1586 "adopt evidence" -> "an adopt line". :1604 "untrue and unloaded total differences" (a difference is not untrue) -> "keep total differences stale when a record has untrue or unloaded coverage". gates.test.mjs:2663,2768 "in check ci and the ratchet command" has no commas -> "in the check, ci and ratchet commands". :2680 "an adopted source edit" (the file is edited, not the source) -> "an edit of the adopted file". :2805 "an invalid from" -> "an invalid from commit". :2744 "waiver count" -> "waived count" (base spec term).
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:383-387 comment. The sentence at :383-384 has 26 words and no verb for "its entry hash". It cites only "Count tolerance" (:387), not the two new requirements, and says nothing about the stale exception (:429-431). -> "A file with the tolerance conditions is a loaded code file with true coverage and the hash of its ledger entry. It has base content or adopted source content." and "See the requirements "Count tolerance", "Count tolerance for adopted files" and "Total counts for adopted files"." Add one comment line above :429 for totalsOnly.
- [ ] FINDING minor evidence.md:76,316 "noise", "approximations" are not terms of the spec. evidence.md:277-279 "the current untrue guard", "The current errors": "current" has two meanings. evidence.md:247 "Command: git rev-parse HEAD." gives no result. evidence.md:379 "it" can mean the stop or the mutation. evidence.md:417 "The fixture processes use their own spec files." is unclear.

---- Part 5 of 5 (sent to the lead by SendMessage) ----

Part 5 of 5 (STE pre-review 1, commit a746a532616cf8c69b6338acace40e816dcf6478, read from .git/refs/heads/vendored-tolerance). Checked clean, read and not read.

CHECKED CLEAN
- Banned words (explicit, verify, malformed, wiring, dismiss, expose, permit, retain, emit, prior, preserve, renew, lone, handover, execute, prescribed) and the words.json list: no hit in the five change .md files, the new test titles or the changed code lines. The only hits are "priority" (design.md:44, evidence.md:251,361) and `--expose-gc` inside an old test title in proof.json:226,464, which is a code name.
- -ing words in prose: none except "heading" and "string". Contractions: none. Passive voice: none found by pattern. SHALL, SHOULD and MAY: none. MUST, WHEN, THEN and AND are used correctly.
- Tasks: each task starts with an imperative verb.
- Check 5: each of gap-ledger-136 to 153 has a task and a live test title (ledger.test.mjs:1499-1604; gates.test.mjs:2663-2805, with 069 at :2731 and 081 at :2744). Each ID in the evidence tables resolves (also coverage-gate-022, 024, 031, 048; spec-trace-039, 040).
- Numbers in the documents agree with the files: ledger tests 90, 95, 100 (5 added in each pass); gate tests 227, 235, 239 (8 and 4 added); 14 named faults in the table; mutations 159+0+6 = 165 killed and 14+2 = 16 EQUIVALENT of 181; 14 x 11520 = 161280; 7 x 1536 = 10752. "Opens no gap and closes no gap" is consistent with the file list.
- Code against prose: compareLedger and ratchetLedger take adoptedAsIs; only compareLedger takes adoptedFile; the gate computes both once before the ratchet and the comparison (gates.mjs:595-605). Part 1, finding 4, is the one place where the requirement disagrees with the code.

READ
The brief; report-pre1.md; full.diff (all 746 lines); the five change .md files in the working tree (proposal, design, tasks, evidence, specs/gap-ledger/spec.md); base spec openspec/specs/gap-ledger/spec.md lines 255-334 and 405-534; scripts/spec/lib/ledger.mjs lines 180-190, 378-440 and the toleranceCounts, toleranceOf and METRICS definitions; scripts/spec/gates.mjs lines 590-620; scripts/spec/lib/git.mjs:43-59; openspec/ste/words.json; test title lines by grep.

NOT READ
proof.json (grep only); .openspec.yaml; the rest of the base spec; the full bodies of the new tests beyond the diff; AGENTS.md, .claude/agents and .claude/commands (the diff does not change them, and the grep for the change's words found no match); the logs and tools under /tmp and gev-tools (evidence.md paths); git history (I cannot run git, so I did not check "that commit only shortens a comment" at evidence.md:8); the change ownership-scoped-gates.

LIMITS
I am not sure about the ASD-STE100 status of "lack", "satisfy", "eligible", "whichever" and "survivor"; the findings say so where they matter. The brief says a test title has an actor and an outcome verb; the project titles use a verb without a subject (for example change-review-033), and I judged the new titles against that habit.
