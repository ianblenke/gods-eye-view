Verdict: FAIL
Tree read: fb411b575df0506a7fb6a9bcbf8ba4d1ed67acd1.

- [ ] FINDING critical scripts/spec/lib/ownership.mjs:74-80 A forged adopt line works again in PR CI. isAdoptSource uses resolveCommit (git rev-parse), so a history line's `from` accepts any revision name; checkAdopts compared the exact hash before (gates.mjs:682). I assume CI checks out the pull_request merge ref (ci.yml:69-85 sets no ref): then HEAD^2 is the PR head, a merge second parent. Trace: add {"kind":"adopt","change":<c>,"file":<file the PR changed>,"from":"HEAD^2",counts}. validAdoptSources accepts it; syncChangedLines (ownership.mjs:106) diffs the work tree with HEAD^2, finds no line, and COVERAGE-DIFF exempts the whole PR; checkAdopts accepts it too, so large counts plus a hand-made ledger entry open a gap (gap-ledger-092/093). Fix: in isAdoptSource require /^[0-9a-f]{40}$/ and mergeParents(...).has(from); keep resolveCommit for the --from option only (gates.mjs:480). My round-1 fix text said resolveCommit; that was too loose. Flip the ownership-031 short-hash assertion and the ownership-041 AND line; add a merge-HEAD fixture where from "HEAD^2" gives LEDGER-ADOPT-FROM.
- [ ] FINDING major scripts/spec/lib/qa-register.mjs:41 Code and spec disagree. The requirement "QA exception boundary" and ownership-035 keep QA-HEADER for a script whose base header has a QA tag. The code gives the synthetic header when a valid adopt record names the script, whatever the base has; no test combines both. Use baseText !== null ? !hasQaTag(baseText) : adopts.some(...), or add the carve-out to 035, and add the test.
- [ ] FINDING major scripts/spec/lib/qa-register.mjs:41 The adopt arm has no producer. adopt writes lines only for coverage gaps or untraced tests (ledger.mjs:676-689); a new header-less script gives QA-HEADER, which stops adopt (gates.mjs:611) before any write. ownership-040 and 044 hand-write the record, and AGENTS.md:37 sends sync authors to hand-written history. Make adopt write such a line (scenario and test), or make rule 22 say the author adds a header.
- [ ] FINDING major tasks.md:6.11-6.45 Order and origin. Code tasks 6.11-6.16 come before the test tasks of ownership-039, 041-044, 050, 051 (6.27-6.41); only 029-036 have a red run (evidence.md:684-693). ownership-045..049 describe old code (coverage-gate spec line 59, gap-ledger-090) but have Origin: spec-first. Mark them backfill and state the real order.
- [ ] FINDING minor src/tooling/spec/qaRegister.test.mjs:77 qa-scripts-023 calls readQaRegister with no manifest and pins 83 scripts and no error, so a tree with a synthetic-header script fails it. The QA exception lists qa-scripts-002, 003, 019, not 023.
- [ ] FINDING minor evidence.md:1341-1381 The survivor table has 39 rows for 44 survivors; c9613, c9629, c9631, c9659 and n0014 are only in mutation-results-pass4.json.
- [ ] FINDING minor scripts/spec/gates.mjs:537 Bad history JSON gets the code LEDGER-ADOPT-FROM, which no scenario names. The second ownership-038 test asserts no error line, so any early stop passes it.
- [ ] FINDING minor proposal.md:95-97 "An owned path leaves the owned set only through a later change" is false: a manifest edit passes the gates and applies at the next base. Rule 23 does not tell the owner to review removals.

More follows in 2 parts by SendMessage (checked clean; answers; read and not read).

---- Further messages of the reviewer (sent to the lead by SendMessage): message 2 of 3 ----

Part 1 of 2 (tree fb411b575df0506a7fb6a9bcbf8ba4d1ed67acd1). Your attack list, items 1 to 4.

1. Forgeries after D1. Closed: a line with no `file` (ownership.mjs:90 throws), a work-branch hash, an ancestor hash, a non-string `from`, a null byte (isAdoptSource catch), a later invalid record (the loop checks every record in the suffix). validAdoptSources checks `records` (kind adopt, this change); `adopts` from adoptsOf is a subset, because historyLinesOf (ledger.mjs:234) only drops lines that do not start with "{". So no accepted line escapes the check.
- A valid line for another change: skipped by both filters.
- A line before the base prefix: skipped (slice at baseHistory.length). A different prefix gives [] (base diff rule), and compareWithBase reports the prefix change.
- A line in a later commit: no difference, the gate reads the file.
- Several `from` values: each is checked; a file uses its own last record, other files use adopts.at(-1) (ownership.mjs:106). A line that names an unrelated `file` gives its source to all other files, but a line is exempt only when the source holds it. LEDGER-ADOPT-FILE (checkAdopts) still fires for a file the merge did not change, so no bypass there.
- Own-branch merge: named at proposal.md:93, still accepted.
- NEW, the critical finding: the CI merge ref plus revision names. By hash the PR head is unreachable (the line is part of the head hash), so the hash form stays circular. After the fix, only the own-branch residual remains.
Inputs that failed before and pass now: from = short hash, branch name, HEAD^2, origin/<branch> (checkAdopts used the exact string). Inputs that passed before and fail now: lines with no `file` or a non-string `from` (gap-ledger-095 said "no error"; the new requirement gives itself priority, which is fine) and bad history JSON (it was a crash).

2. Manifest union (D3). Current manifest absent, invalid, or renamed: OWNERSHIP-MANIFEST at gates.mjs:416, before the base is read. Prefix shortened or path removed: the union keeps it (ownership.mjs:27, test ownership-029). Absent base manifest: empty, which this very change needs. Not reported as a finding: an invalid base manifest also blocks the change that repairs it. The removal path takes effect one base later (finding on proposal.md:95-97). I could not check the manifest against upstream/main; ownership-030 reads the real file and checks the three sentinels.

3. QA header (D2). Renamed or moved script: no base file, so QA-HEADER (good). Header deleted: QA-HEADER, except when an adopt record names the script (finding 2). Owned script: QA-HEADER (test 010). A valid header implies hasQaTag(text) is true: parseQaHeader needs a tag line inside the first block, and hasQaTag reads the same block from the same start, so a1732 and a1753 are equivalent. Changed lines in a script with a synthetic header get no line check (it leaves the inventory); proposal.md:57 names that.

4. The 44 equivalent claims and 12 CRASH. I read the mutated code against the live code for all 44 (also the probe files equivalent-probe.mjs and equivalent-gate-probe.mjs): all equivalent. Notes:
- a1384/a1386/a1387/a1411/a1412: `.test(undefined)` and `.test('x')` find no "@" tag, so same.
- a1702/a1739/a1744/a1754: pure operand order, no side effect, and `manifest &&` still guards classify.
- c4477/c4481/c4482: the faults at gates.mjs:485-487 stop a null fromCommit first.
- c6441/c6442: true only because validAdoptSources ran at gates.mjs:535 on the same history; the ratchet appends measurement lines only. It stays true after the critical fix.
- c9602/c9608/c9609/c9613/c9629/c9631/c9659/c9522/c9523, c4952/c4966/c4995/c4996/c4999/c5000, c0147/c0149/c0154/c0550/c0588/c0614/c0619/c9140/c9167/c9184/c9185 and n0014: fine as described.
- The probes use the branch name `source` as `from` (equivalent-gate-probe.mjs:43), so they also pin the name-accepting behaviour in the critical finding.
- The probe for qa-register has no case "base tag plus adopt record" (equivalent-probe.mjs:37-42); same gap as the major finding.
The 12 CRASH records (c0540, c0545, c0572, c0573, c4933-c4937, c4956, c4957, c9183) each name failed tests, so they are real kills the tool does not count.

---- message 3 of 3 ----

Part 2 of 2 (tree fb411b575df0506a7fb6a9bcbf8ba4d1ed67acd1). Items 5 to 7, extra minors, read and not read.

5. Spec, code, tests. Each of ownership-029 to 053 has a test, and its WHEN is made and its THEN/AND are asserted (collectively across the tagged tests). I checked the literals: ownership-020 (unit advice and gate regex), 031 (gate test lists the one ERROR line), 036 (268435456), 039, 046, 047, 052 (error.message equal to the 031 text), 044 (Trace line), 045 (Phase measure: 2 s), 048 (env and runs[1].args). No tag hides a gap. No rule 14 fault found: the literals come from the spec, not from the code constants. Weak spots, not findings:
- ownership-053: the init half cannot reach gates.mjs:576, because init returns at gates.mjs:568 (the ledger exists, so initLedger throws). That half only kills a fault at gates.mjs:514; the ci half kills both.
- ownership-042 asserts /Trace:/ for "the test run starts"; the spy call count would be stronger.
- ownership-038 second test: status 1 and no "Owned gaps:" only (the minor finding on gates.mjs:537).
Scenario overlap: ownership-039, 046, 047 repeat gap-ledger-090; 045 and 048 repeat old gates behaviour (coverage-gate spec line 59). Future edits to one need edits to the other. The scenario text "PASS4_TOKEN" (ownership-048) is a pass name, not a domain word.

Exception clauses: "A file uses its last adopt source ... or the last source in the change if it has none" is bounded by content equality. The QA exception is not bounded (the major finding). The gap-ledger-095 AND line "the gate shows no error" is now false for non-string `file` or `from` of this change; the new requirement "Adopt record boundary" states that it takes priority, which is enough. gap-ledger-096's AND "adopted count excludes the line" can no longer be seen at gate level (the run stops first); ledger.test.mjs:1067 still tests it at unit level.

6. COVERAGE-OWNED and COVERAGE-DIFF. Semantics match AGENTS.md rule 5 and config.yaml item 4: unchanged owned file with a ledger entry passes and is listed (ownership-026); changed or ledger-less owned file needs full coverage or waivers; line check = A minus (lines equal to the source) for every inventory file. Snapshot data: lineCoverage is in the snapshot and in document mode. Documents are consistent with the code (design.md pass 4, proposal.md Known limits), apart from the notes below.

7. Numbers. Tests: ownership 47, qaRegister 47, v8Merge 11, ownershipGate 30 test( lines with one loop of 3 = 32. Mutation: 306 + 283 + 165 = 754, 698/44/12, 44 equivalent entries in the JSON (39 rows in evidence.md). Scenario IDs 029-053: 25 entries in ids.json, none in retired-ids.json. history.jsonl line 2042 names this change (kind measurement, commit f81380b4, no dirty field); the ledger is unchanged. I did not check 227, 231, 28/29 owned, 2 owned gaps, 1871.3 s (image logs).

Extra minors, not in the first message (add as known limits if you prefer):
- Cost: isAdoptSource runs git rev-list for each record, at gates.mjs:535, in syncChangedLines and in checkAdopts: 3 times per record. The old code ran it once. A sync with many adopt lines will be slow; cache mergeParents per run.
- proposal.md:91 "Pass 4 reads commit bf174f99" is the pass base; the code commit is 799372f0 and the ratchet commit f81380b4 (history line 2042).
- AGENTS.md:11 and config.yaml:20 say report "lists owned gaps in files that the change does not edit"; it lists all ledger gaps of both classes.
- AGENTS.md:35 and :41 are unnumbered lines placed after rules 21 and 24 (the same style as the base).
- No real upstream-class or sync change has run through the new gates (this change has 28/29 owned paths only); the first sync is the first real use.

Read: report-round2.md, round2.diff (all), full.diff 1-500, round-1 spec report, proposal.md, tasks.md 1-70, evidence.md 616-726 and 1122-1381, mutation-results-pass4.json (survivor, crash and equivalent records), ownership.mjs, qa-register.mjs, git.mjs, ledger.mjs (adoptsOf, historyLinesOf, checkAdopts, adoptLedger), gates.mjs 205-770, ownership.test.mjs 1-240, ownershipGate.test.mjs 1-350, qaRegister.test.mjs 1-150 and the diffs of the rest, AGENTS.md, config.yaml, ci.yml, spec-lint.mjs, gap-ledger spec 387-475, qa-scripts spec (002, 003, 023), ids.json, history.jsonl 2041-2042, the two probe files equivalent-probe.mjs and equivalent-gate-probe.mjs.
Not read: design.md outside the diff, evidence.md 1-615 and 726-1121, gates.test.mjs outside the diff, ledger.mjs compareWithBase, measurement.mjs, ci.mjs, equivalent-catch-probe.mjs, gaps.json and links.json contents, the image logs, the manifest against upstream/main (I cannot run git), STE wording. I cannot run code; the critical finding assumes the pull_request default checkout (merge ref) in ci.yml.
