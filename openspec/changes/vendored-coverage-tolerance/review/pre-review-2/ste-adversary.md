Verdict: FAIL

Tree: working tree of `/home/ianblenke/docker/gev-work/vendored-tolerance`, branch ref `vendored-tolerance` = 975a6230. I cannot run git status, so uncommitted edits are possible. D = openspec/changes/vendored-coverage-tolerance. There are 8 majors and about 55 minors. This is part 1 of 4. Parts 2 to 4 are in your inbox: majors 6-8, the minors, then the clean checks and the read and not-read lists. In part 4, "rows 12 and 21 leave keep" should read "row 21".

- [ ] FINDING major D/specs/gap-ledger/spec.md:19,20 "when the not-covered count is smaller or equal" / "For a larger not-covered count". The text names no comparator and two counts are possible (current or entry), so a reader can reverse the rule. The code is `gap[metric] <= entry[metric]` (ledger.mjs:238), and scenario 154 (:76) says "current ... above its entry count". -> ":19 ... when the current not-covered count is smaller than or equal to the entry not-covered count. :20 For a current not-covered count larger than the entry not-covered count, never-worse counts MUST write the entry not-covered count and entry total count."

- [ ] FINDING major D/specs/gap-ledger/spec.md:17,18 "MUST use toleranceCounts for a file with base content" / "MUST use never-worse counts". Neither sentence has the tolerance condition. Read literally, they cover a file with another content hash or untrue coverage. For such a file ledger.mjs:637-638 (`tolerant ? ... : gap`) writes the current counts. Scenario 143 (:56) has the condition. -> ":17 When a file has the tolerance conditions, the ratchet command MUST use toleranceCounts if the file has base content, also when it equals its adopted source. :18 ... MUST use never-worse counts if the file equals its adopted source and has no base content."

- [ ] FINDING major D/specs/gap-ledger/spec.md:89,90,91 "names the tolerance conditions as the only exception" / "applies to no other file". (a) Base spec :33 says "A file with the tolerance conditions is an exception", not "the only exception". (b) The bound omits the equal content hashes and true loaded coverage of :86. A file with a valid adopt line, equal counts and another hash is inside the bound, but scenario 152 (:130) makes it stale. -> ":89 That sentence names the tolerance conditions as an exception to the stale rule. :90 The exception applies only to a file with a valid adopt line of the checked change, equal content hashes, true coverage from a test that loads the file, and equal not-covered counts of lines, branches and functions."

- [ ] FINDING major D/design.md:68 "adopt line | History line that meets Adoption of merged code". With this meaning every adopt line is valid. Scenarios 138 (spec.md:32-35) and 151 (:125-128) and design.md:21 name an "adopt line" whose `from` commit is not a merged commit. "Invalid adopt line" then contradicts itself, and "valid adopt line" adds nothing. -> "adopt line | History line with the kind adopt." and a row "valid adopt line | Adopt line of the checked change that meets Adoption of merged code." Also fix spec.md:7: "The adopt line MUST meet ..." becomes "A valid adopt line is an adopt line that meets ...".

- [ ] FINDING major T/ledger.test.mjs:1588,1597 "records total differences as stale" / "records another ledger hash as stale". The object of "stale" is a difference or a hash. The scenarios (spec.md:119,123,127,133) and the glossary (design.md:75) say the ledger entry. This is the open pre-review 1 major (stale with three objects). The correction row 9 (evidence.md:569) claims it is closed. The same titles are in evidence.md:664,665. -> "the gate records the ledger entry as stale for total differences without an adopt line" and "the gate records the ledger entry as stale for a content hash that differs from the ledger entry".

Majors 6-8 (title and tag mismatches in ledger.test.mjs:1620,1643,1655, and tasks.md:64 with two instructions) are in part 2.

---- Part 2 of 4 (sent to the lead by SendMessage) ----

Part 2 of 4 (STE pre-review 2, vendored-coverage-tolerance, working tree at branch ref 975a6230). D = openspec/changes/vendored-coverage-tolerance. T = src/tooling/spec. Part 1 (my final message) has the verdict and majors 1-5. Here: majors 6-8, then minors for spec.md.

- [ ] FINDING major T/ledger.test.mjs:1620,1655 titles. (1620) "selects larger equal and smaller counts per metric" has no commas and no outcome. It can mean "selects the larger counts", the opposite of scenario 154 "Write no larger count". -> "the ratchet command writes the current count for a smaller or equal not-covered count and the entry count for a larger one, for each metric". (1655) "uses base content counts when both source predicates are true": "source" means the base commit content (sameAsBase) and the `from` commit content (adoptedAsIs). "base content counts" and "source predicates" are in no glossary row (design.md:62-123). Scenario 143 (spec.md:58) says "uses toleranceCounts for a file with base content". -> "the ratchet command uses toleranceCounts for a file with base content that also equals its adopted source". The same titles are in evidence.md:667,669.

- [ ] FINDING major T/ledger.test.mjs:1643,1655 tags. 1643 has the tag gap-ledger-147. Its WHEN (spec.md:100) says the file differs from its adopted source, but the test passes adoptedAsIs true and the title says "equals". 1655 has the tag gap-ledger-154. Its WHEN (spec.md:75) says "has no base content", but the test passes sameAsBase true. Each tag names a scenario that the test does not run. -> remove gap-ledger-147 from 1643 and gap-ledger-154 from 1655 (also evidence.md:668,669). Scenarios 147 and 154 keep their tests at ledger.test.mjs:1552 and gates.test.mjs:2816.

- [ ] FINDING major D/tasks.md:64 "Correct T1 to T8 and all STE findings." Two instructions in one task. The label T8 is in no file of the change (evidence.md:546-553 names T1 to T7; the T labels come from a prompt outside the change). -> two tasks: "Correct the eight spec findings of pre-review 1." and "Correct the 43 STE findings of pre-review 1."

MINORS, spec.md (D/specs/gap-ledger/spec.md)
- [ ] FINDING minor :12 "These are the tolerance conditions" - "These" can mean :10-11 (the exception) or :5-8 (the four conditions). -> "The four conditions above are the tolerance conditions of a file that equals its adopted source."
- [ ] FINDING minor :14 "MUST apply ... its coverage loss errors": an error is reported, not applied (glossary row of the lead: apply, report, compare, write). -> "MUST apply the count tolerance of the requirement "Count tolerance" and report its coverage loss errors." Also "The commands" (:14,:63), "The gates" (:4,:83), "the command" (:57-59) and "The gate" (:15,:84) name the gate and the ratchet command in four ways; the self-check at evidence.md:620 says the actors use the glossary words, which is false for these. -> "the gate", "the ratchet command", "each command".
- [ ] FINDING minor :20,:77 "keep" means "write the entry value"; proposal.md:13,14 and design.md:51 use "keep" for "do not change"; evidence.md:613,745,859 use it for other meanings. -> ":20 MUST write the entry not-covered count and entry total count"; ":77 the ratchet command writes the entry count and entry total count of that metric".
- [ ] FINDING minor :19,:79,:20 "smaller or equal" and "larger" name no comparator (see major 1). Same gap at design.md:33,34,87 and ledger.mjs:231-232.
- [ ] FINDING minor :53 "the not-covered count rise and covered count loss": "rise" is a verb used as a noun. -> "when the not-covered count rises by more than the tolerance and the covered count falls by more than the tolerance".
- [ ] FINDING minor :25,:51,:53,:49 "count tolerance" means the rule (:25), the number (:51); ":53 the tolerance" is the number; ":49 count limits" (also ledger.test.mjs:1532) is a third name. -> the glossary rows at design.md:76-77: "tolerance" for the number, "count tolerance" for the rule; delete "count limits".
- [ ] FINDING minor :15,:20,:51,:77,:114 "entry" with no "ledger" (glossary: ledger entry). -> "ledger entry".
- [ ] FINDING minor :78 "the base comparison reports" - the term is in no glossary row; proposal.md:41 says "hand-edit check", design.md:23 "ledger comparison", design.md:45 "the comparison". -> "the ratchet command reports no LEDGER-NOT-IN-BASE and no LEDGER-MORE-THAN-BASE" (glossary: the ratchet command compares the ledger with the base ledger).
- [ ] FINDING minor :80 "the current gap still has its current total counts" repeats itself and hides the test (the ratchet command must not change the current gap). -> "the ratchet command does not change the total counts of the current gap".
- [ ] FINDING minor :15,:94 "MUST not" - the OpenSpec keyword is "MUST NOT" (I am not sure that the lint checks it).
- [ ] FINDING minor :3,:82,:96 the titles "Count tolerance for adopted files" (a file that equals its adopted source) and "Total counts for adopted files" (a file with a valid adopt line) use "adopted files" for two sets; no glossary row defines "adopted file". The bodies are exact. -> rename the titles, or add one row and a note that the titles are labels.
- [ ] FINDING minor :106 "an entry total of 400" -> "an entry total count of 400".

---- Part 3 of 4 (sent to the lead by SendMessage) ----

Part 3 of 4 (STE pre-review 2, vendored-coverage-tolerance, branch ref 975a6230). D = openspec/changes/vendored-coverage-tolerance. Minors for design.md, proposal.md, tasks.md, evidence.md and the code comments.

design.md
- [ ] FINDING minor D/design.md:81,82 "merged commit | Commit from a parent other than the first parent": "commit from a parent" can mean any commit in the history of that parent. "base commit" (supplies the gate base ledger) and "base ledger" (ledger at the base commit) define each other. -> "merged commit | A parent of a merge commit, except the first parent."; "base commit | The commit that the gate compares with the checked tree."
- [ ] FINDING minor D/design.md:87 "never-worse counts | Use the current count ..." is an instruction, not a definition. -> "Counts that use the current count and total for a smaller or equal not-covered count, and the entry count and total otherwise."
- [ ] FINDING minor D/design.md:103 "lead | Person who decides the correction for a design defect." proposal.md:25 and evidence.md:471,472,883 give the lead other duties (runs the image checks, gets the review passes). -> add those duties.
- [ ] FINDING minor D/design.md:111 "CI artifact | ... from the CI command" - "CI command" and the "ci command" (:79) look like one word with two meanings. I am not sure what the CI command is. -> "from the CI run".
- [ ] FINDING minor D/design.md:104,115 blank lines split the glossary table; rows 105-114 and 116-123 have no header and render as plain text. -> delete the two blank lines.
- [ ] FINDING minor D/design.md:29,35,45,51-52 "adopt line not-covered counts" is a group of four nouns; "The change does not change" uses "change" as noun and verb; "The comparison applies" (compareLedger) differs from "the base comparison" (:29); "The new requirement" (two requirements are new; "new" is a time word). -> "the not-covered counts in the adopt line"; "This change leaves compareWithBase ... as they are"; "compareLedger applies"; 'The requirement "Count tolerance for adopted files"'.

proposal.md
- [ ] FINDING minor D/proposal.md:40 "Pass 2 sets no bound ... The covered baseline can lag." "Pass 2" is a time label (pre-review 1 rows 16, 33); "covered baseline" (glossary :112) and "covered count" (:92) are two names; "lag" is vague. -> 'The requirement "Total counts for adopted files" sets no bound on the size of a total difference. The covered count of the ledger entry can differ from the covered count of the current gap by more than the tolerance.'
- [ ] FINDING minor D/proposal.md:34 "gives no tolerance from this requirement": the proposal adds two requirements, so "this requirement" has two antecedents; for "Total counts for adopted files" the sentence is false (that exception applies to a file that differs from its adopted source). -> 'from the requirement "Count tolerance for adopted files"'.
- [ ] FINDING minor D/proposal.md:45-47 "This has no effect", "the base content tolerance", "The total-only guards" - "This" has two antecedents; the two other terms are in no glossary row. -> name the condition: "A file with base content already gets this exception from the requirement "Count tolerance" when its coverage is true. The code refuses the exception for untrue coverage."
- [ ] FINDING minor D/proposal.md:50 "The full gate command" -> "make gates CHANGE=vendored-coverage-tolerance". Also :3 "Timers can change those counts": I cannot check this cause in the files.

tasks.md
- [ ] FINDING minor D/tasks.md:70 "Run all host checks from prompt-3.md." names a file outside the change. -> "Run the host checks that evidence.md lists under Host commands and verdicts."
- [ ] FINDING minor D/tasks.md:73 "Check the title echoes" uses the word "echo" (the lead's brief bans it in new prose). -> "Check each document title against the live test titles with check-echoes.py."
- [ ] FINDING minor D/tasks.md:75 "Run the CI artifact command on s3-replay3." is a third name for "Replay the real CI data" (:35,:44). -> "Replay the real CI data on s3-replay3."
- [ ] FINDING minor D/tasks.md:66 "metric tests" - no glossary row for the combination. -> "Write the tests of lines, branches and functions for gap-ledger-154 before its code."

evidence.md
- [ ] FINDING minor D/evidence.md:520,845,848,878 "the echo script" -> "the check-echoes.py script" (or "the title script").
- [ ] FINDING minor D/evidence.md:511,512 "The named fault" and "that fault": tasks.md:33,71 and evidence.md:788 say "named mutation". -> "The named mutation is ..." (the headings at :31,:39,:268 are old records).
- [ ] FINDING minor D/evidence.md:629,746 "the source of each selected count", "the source of the selected totals": "source" means "origin of a value"; the glossary row means the content at the `from` commit. -> "the origin of".
- [ ] FINDING minor D/evidence.md:420,421,424,866 "Current script commit", "The current coverage command" mean pass 2; "The current tree" (:866) means pass 3. -> "Pass 2 script commit"; "The pass 3 tree".
- [ ] FINDING minor D/evidence.md:531-533 the pointers design.md:50, spec.md:55, tasks.md:59-60 point to other text now (design.md:50 is "Add tests ...", spec.md:55 is scenario 143, scenario 154 is at :74, tasks.md:59 is blank). The text says "apply to code commit 04554050". -> "At that attempt the lines were ...", or delete the pointers.
- [ ] FINDING minor D/evidence.md:479 "T3 stops the work" - a task cannot stop work, and T3 is first defined at :550. -> "At the first pass 3 attempt, the red test for T3 stops the work."
- [ ] FINDING minor D/evidence.md:575,601 the pointers of rows 35 and 41 do not match their rows: row 35 "Thus" -> evidence.md:467 (the "required" fix), row 41 "count noise" -> ledger.test.mjs:1606 (title 153; the old title is at :1499).
- [ ] FINDING minor D/evidence.md:745 "now" (time word).

Code comments
- [ ] FINDING minor T/ledger.test.mjs:716 "the gate givess no" - a typo that this diff adds (an edit of a comment of the old test gap-ledger-074 that needs no change). -> revert the line to "the gate gives no LEDGER-LOST-COVERAGE".
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:444 "A valid adopt line allows total-only differences" - an adopt line allows nothing. -> "The gate accepts a total-only difference for a file with a valid adopt line when the not-covered counts are equal."
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:213-216 "keeps the entry counts when the covered count is smaller than in the entry" ("keep", "than in the entry") -> "writes the entry counts when the current covered count is smaller than the entry covered count".

---- Part 4 of 4 (sent to the lead by SendMessage) ----

Part 4 of 4 (STE pre-review 2, vendored-coverage-tolerance, branch ref 975a6230). T = src/tooling/spec. Correction to part 3: the pointer of row 35 is evidence.md:595 (not :575).

Test-title minors
- [ ] FINDING minor T/ledger.test.mjs:1540 and spec.md:55 "writes better counts" / "Write the better count": "better" is in no glossary row; the requirement says "never-worse counts". -> "the ratchet command writes never-worse counts for a file that equals its adopted source".
- [ ] FINDING minor T/ledger.test.mjs:1606 "reports the exact result for untrue or unloaded coverage" says nothing about the result. -> "the gate gives no total count exception for untrue or unloaded coverage".
- [ ] FINDING minor T/ledger.test.mjs:1511,1597 "another ledger hash" - the hash of the current gap is not a ledger hash. -> "a content hash that differs from the hash in the ledger entry".
- [ ] FINDING minor T/ledger.test.mjs:1532 "outside the count limits" -> "outside the count tolerance" (see part 2).
- [ ] FINDING minor T/gates.test.mjs:2689,2700,2710 "the adopted source requirement" is an unnamed name for the requirement "Count tolerance for adopted files"; :2700 has "from ... from" ("tolerance from the requirement from another change") and can mean that the requirement comes from another change. -> :2700 "the gate gives no tolerance for an adopt line of another change"; :2689 and :2710 name the requirement.
- [ ] FINDING minor T/gates.test.mjs:2719,2785 "the gate needs the code file in a valid adopt line", "the gate needs a valid adopt line for total differences": "needs" is not an outcome of a scenario. -> "the gate gives no tolerance to a code file that no valid adopt line names"; "the gate records the ledger entry as stale when no valid adopt line names the file".
- [ ] FINDING minor T/gates.test.mjs:2805 "rejects an invalid from commit": scenario 151 says the gate records the ledger entry as stale and reports LEDGER-ADOPT-FROM. -> "the gate records the ledger entry as stale and reports LEDGER-ADOPT-FROM for an invalid from commit".

CHECKED CLEAN
- Owner's banned words and forms (explicit, verify, malformed, wiring, dismiss, expose, permit, retain, emit, prior, preserve, renew, lone, handover, execute, prescribed): no hit in the five documents, in the changed lines of the two test files or in scripts/spec/lib/ledger.mjs. Old hits (ledger.test.mjs:1356 "permits", gates.test.mjs:122,126,183,605,1591,1594) are outside the diff.
- SHALL, SHOULD, MAY: none. MUST, WHEN, THEN, AND are right. No contractions. No -ing word in the prose of the spec, proposal, design and tasks except "heading" and "string"; evidence.md has only command text and code names. Passive voice: one old hit (evidence.md:35, a pass 1 record).
- Every task except tasks.md:64 has one instruction and starts with an imperative verb.
- Pre-review 1 replacements: rows 1-34 and 36-43 of the table at evidence.md:561-603 are in the files and say the same, except the faults reported above (row 9 is open in two test titles; rows 12 and 21 leave "keep"). Each pointer of the table that I checked (spec.md:4-130, proposal.md:5-40, tasks.md:3-46, design.md:3-67) matches its line.
- Check 5: the 27 titles that evidence.md:657-682 quotes equal the live titles in the two test files (grep at ledger.test.mjs:1499-1655 and gates.test.mjs:2663-2816). Each scenario 136 to 154 has a task and a tagged test. "echo" does not occur in the spec, proposal or design.
- Numbers: ledger 103/103 (100 + 3 new tests), gates 240/240 (239 + 1), mutations 61 + 2 = 63 killed and 1 EQUIVALENT of 64, all agree between evidence.md and the brief.

READ
The brief and report-pre2.md; pre2.diff lines 1-865 and 5525-6283 (design, evidence first part, proposal, spec, tasks, ledger.mjs, both test files); the working-tree files proposal.md, design.md, tasks.md, specs/gap-ledger/spec.md, evidence.md (lines 1-535 in part, 455-534, 800-884, and all lines that grep showed); review/pre-review-1/ste-adversary.md; base spec openspec/specs/gap-ledger/spec.md lines 4, 32-40, 258-302 (grep); scripts/spec/lib/ledger.mjs lines 187-243, 434-452, 520-566, 637-650 (grep).

NOT READ
proof.json, proof-pass2.json, proof-pass3.json (diff lines 922-5524); diff lines 866-921; evidence.md lines 536-800 only through the diff and grep; scripts/spec/gates.mjs (not in the diff); AGENTS.md and .claude/ (not changed); the logs and tools under /tmp and gev-tools; git state (I cannot run git status, so uncommitted edits are possible; I read the files in the working tree and the ref 975a6230).

NOT MY SCOPE, ONE LINE FOR THE SPEC REVIEWER
scripts/spec/lib/ledger.mjs:240 neverWorseCounts reads entry.totals[metric] with no guard. An old-format entry has no totals (LEDGER-NO-TOTALS is a ratchet fix code), so a TypeError looks reachable for a file that equals its adopted source with a larger current count. toleranceCounts has the guard at :225. I could not run it.
