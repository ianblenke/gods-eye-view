Verdict: FAIL
Tree read: clone vendored-tolerance, branch vendored-tolerance, commit 975a62305917a83080c0433ec6ec0a67dfb65367 (from .git/refs/heads/vendored-tolerance), working tree. I ran no code. The rest of the review is in 3 SendMessage parts to team-lead.

- [ ] FINDING major openspec/changes/vendored-coverage-tolerance/specs/gap-ledger/spec.md:10 The exception names only the base content condition and gap-ledger-074, so "the tolerance conditions" now has two meanings.
  - Reading A (ledger.mjs:398 says an adopted file has them): base gap-ledger-073 (base spec.md:293-297) calls a smaller covered count worse and keeps the entry. That contradicts spec.md:19 and ledger.test.mjs:1650-1652 (entry 10/400, gap 9/398, covered 390 to 389, test asserts 9/398 is written).
  - Base gap-ledger-028 (base spec.md:248-251) has the same WHEN as gap-ledger-154: more not-covered branches, covered count not smaller. The fixture at gates.test.mjs:2816 goes 1/100 to 2/101 with covered 99 both times. 028 says write the larger count; the 154 test asserts keep 1/100.
  - Reading B (evidence.md:613, base scenarios keep the base meaning): base 004, 008 and the "Ratchet rule" sentence (base spec.md:33) still require tolerance 0 and stale for the same file. spec.md:10 names none of them.
  - Fix: name 073 and 028 in a bounded exception for a file that equals its adopted source without base content. Give "the tolerance conditions" one meaning at spec.md:12.
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:240 neverWorseCounts reads `entry.totals[metric]` with no guard; toleranceCounts has one at line 225.
  - LEDGER-NO-TOTALS is a ratchet fix (line 615). An adopted entry with no totals and a rising count therefore reaches line 240, throws a TypeError, and gates.mjs:638 reports GATES-RATCHET. gap-ledger-075 says to run the ratchet.
  - A partial totals object writes `undefined` and the error stays.
  - No test covers it, and 100% coverage hides it because there is no branch.
  - All 675 entries in the real ledger have totals, so only a hand edit or an old file reaches it. It fails closed.
  - Fix: add the guard and a test like ledger.test.mjs:691-693 and 722-726.
- [ ] FINDING minor src/tooling/spec/gates.test.mjs:2836 The expected [1, 100] equals the ledger before the ratchet (adoptedNoise writes branches 1, total 100). Line 2837 is only a negative regex.
  - A ratchet that stops, or an lcov replace at line 2830 that no longer matches, passes both assertions.
  - Fix: add `/Ratchet: \d+ history lines for sync\./` and `/Ledger: 0 entries do not match the current gaps\./`, and assert the replace changed the text.
- [ ] FINDING minor scripts/spec/lib/ledger.mjs:235 neverWorseCounts writes a smaller total whenever the not-covered count is equal or smaller, with no covered-count check. The covered baseline can fall by up to the tolerance at each ratchet run; toleranceCounts keeps the entry in that case (line 222).
  - Known limits (proposal.md:38-41) name the lag only for the total-only exception.
  - Fix: name it or guard it.
- [ ] FINDING minor openspec/changes/vendored-coverage-tolerance/proposal.md:43 The limit names a closed gap only. A tolerant file is never stale for a smaller gap of any size (ledger.mjs:447). ledger.test.mjs:1508 asserts 0 against 10, which is above the tolerance of 8. A part improvement therefore leaves slack that hides a later fall back to the old count. Name it.
- [ ] FINDING minor src/tooling/spec/ledger.test.mjs:716 The typo "givess" was added in this pass, in the comment of the gap-ledger-074 test; main has "gives". Restore it.

---- Part 1 of 3 (sent to the lead by SendMessage) ----

Part 1 of 3 (spec adversary, vendored-coverage-tolerance pre-review 2; tree: clone vendored-tolerance, commit 975a62305917a83080c0433ec6ec0a67dfb65367 read from .git/refs/heads/vendored-tolerance, working tree). The verdict and findings are in my final message.

ATTACK 1, neverWorseCounts (ledger.mjs:235-243)
- Never writes a larger not-covered count: line 238 skips only when gap[metric] <= entry[metric]; otherwise the entry count AND the entry total are kept as a pair, so the pair always belongs together. Per metric, so a mixed result is right (ledger.test.mjs:1638-1640: [10,10,9], totals 400/399/399).
- A null gap count compares as 0 and writes null, as toleranceCounts does. Not new.
- entry.totals undefined or partial: TypeError or undefined written. Reachable for a file that equals its source only with a hand-edited or old entry (675 of 675 entries in openspec/trace/gaps.json have totals). Filed as a minor finding.
- Smaller count with larger total: the covered baseline rises, no loss. Smaller or equal count with smaller total: the gate blocks a fall above the tolerance (lossOf, ledger.mjs:67, the fall alone when the count falls), but a fall inside the tolerance is written, so the covered baseline can drop at each ratchet run (toleranceCounts keeps the entry then, line 222). Filed as minor.
- sameGap and stale: a tolerant file never reaches the stale push (ledger.mjs:447), so a kept pair 1/100 against a gap 2/101 is not stale, and the post-ratchet compareLedger gives no error (tolerance comes from the gap totals, line 208).
- totalsOnly against tolerant: for a file that equals its source with a valid adopt line, tolerant is true and totalsOnly is redundant; they agree for an untrue entry (both false, stale). For an edited file tolerant is false, totalsOnly decides, and the ratchet writes `gap` (line 638), the current totals (tests 1564-1566 and gates 2780).
- Base-content precedence (line 638) is right: sameAsBase selects toleranceCounts, tests 1655-1663 use literals (10/11/11 with totals 401; totals 399/400/400).
- Copy of gap.totals (line 236): asserted by ledger.test.mjs:1629 (the current gap keeps 401 after the ratchet); a shared-object mutation fails there.
- The two EQUIVALENT claims (gap.loaded, !gap.untrue in totalsOnly, ledger.mjs:445-446): I agree. With !entry.untrue required, an unloaded or untrue gap always gives LEDGER-UNLOADED or COVERAGE-FAKE (ledger.mjs:363-368), so entryErrors is not empty and the stale push is never reached.

ATTACK 2, exception clauses
- Requirement 2's clause names 078 and the Ratchet rule sentence and is bounded ("a valid adopt line of the checked change and equal not-covered counts"). Fine.
- Requirement 1's clause is the open one: finding F1 (major). Base scenarios that use "the tolerance conditions": 004, 008, 013, 054, 057, 069-074, 078, and the Ratchet rule sentence. 028 does not use the phrase but its WHEN is met by the 154 fixture.
- Minor wording, not filed: Requirement 2 says the Ratchet rule sentence "names the tolerance conditions as the only exception"; the base sentence (base spec.md:33) has no "only".

---- Part 2 of 3 (sent to the lead by SendMessage) ----

Part 2 of 3 (spec adversary, commit 975a62305917a83080c0433ec6ec0a67dfb65367).

ATTACK 3, tests per scenario
136/140: ledger.test.mjs:1499, gates.test.mjs:2663. 137: 1511, 2680. 138: gates 2689 (asserts LEDGER-ADOPT-FROM and the stale line). 139: gates 2700. 141: 1518 (uses includes('LEDGER-LARGER-GAP') in 4 cases; it still discriminates, since +1 inside the tolerance 8 gives no such error with tolerance). 142: 1532 (exact codes, tolerance 0 below 25). 143: 1540, 1655. 144: gates 2663 (check, ci, ratchet). 145: gates 2710 (removing the existsSync guard at gates.mjs:604 makes readFileSync throw). 146: 2719. 147: 1552, gates 2768. 148: 1569 (exact codes; equal totals asserted at 1576). 149: 1588, 2785. 150: 2795. 151: 2805. 152: 1597. 153: 1606 (exact codes and stale list for 4 cases). 154: 1620, 1643, gates 2816.
- Rule 13, by reading (I cannot run mutations): "<" for "<=" fails 1620 (equal count expects total 401); always-entry or always-gap fails 1620; toleranceCounts for an adopted file without base content fails 1620 (total 401 against 400); neverWorse for base content fails 1655; shared gap totals fail 1629; entry totals for an edited file fail 1564-1566; dropping !entry.untrue in totalsOnly fails 1606 (stale [] against ['LEDGER-STALE']).
- Rule 14: literals 398 to 401 and 10/9/11 are used. Rule 15: origin and since come from entry (ledger.mjs:639) and ledger.test.mjs:1544 asserts them; sha, loaded and untrue come from the gap spread and are equal in the tolerant case, so a mutation that takes them from the entry is equivalent.
- Weak spots: gates 2768 and 2663 ratchet iteration assert `Ledger: 0 entries` after the ratchet rewrote the ledger (check and ci iterations discriminate); gates 2816 anchors (filed minor).

ATTACK 4, rule 18 on the final code
- Edited after merge: adoptedAsIs compares readFileAt(from) with the working text (gates.mjs:603-605); test 2680.
- Other change: adoptsOf filters line.change (ledger.mjs:288); test 2700. No CHANGE: historyLinesOf returns [] (ledger.mjs:250).
- Short hash, branch name, HEAD^2, upper case: isMergedCommit is a Set of full hashes from `git rev-list --parents` (git.mjs:49-51), so they give LEDGER-ADOPT-FROM and are not in adoption.valid. No test uses a short hash (2689 and 2805 use the full hash of HEAD); code unchanged by this change.
- File the merge did not change: LEDGER-ADOPT-FILE (ledger.mjs:320), not valid. Untrue or unloaded: hasTolerance (188). No ledger entry: LEDGER-NEW-COVERAGE-GAP (424-431) before any tolerance. Absent file: existsSync. Symlink: `git show` gives the link text, so no match (safe).
- Not stopped by a gate, named in Known limits: a merge commit that the fork makes as `from` (rule 21, proposal.md:36).

ATTACK 5, numbers
- ledger.test.mjs has 103 test( calls: matches. gates.test.mjs has 179 static test( calls plus loop tests: 240 NOT verified.
- Automatic mutation arithmetic 61+0+2 = 63 killed, 1 equivalent, 64 candidates: consistent (evidence.md:811-820). Named table: 9 named plus 1 automatic row, 2 equivalent guards: consistent with evidence.md:790 and 808.
- "Opens no gap and closes no gap": gaps.json has no entry for ledger.mjs, gates.mjs or the two test files, and the new tests carry tags. Coverage figures not checked.
- tasks.md: tests before code hold for both ADDED requirements (154 tests at 61-67, neverWorseCounts at 68).
- design.md:103-116: blank lines inside the glossary table split it (format only).

ATTACK 6, ownership-scoped-gates (clone gev-work/ownership-gates)
- Textual conflict expected in scripts/spec/gates.mjs: this change moves the checkAdopts block above compareStart (595-605) and edits the compareLedger call (657); ownership keeps the block after compareLedger (686-692) and edits its isMergedCommit line (689) and the import line (2). ledger.mjs merges clean (ownership leaves line 617 as main).
- Semantic: ownership's validAdoptSources throws LEDGER-ADOPT-FROM for a bad `from` (ownership.mjs:84-95); tests 138 and 151 match `ERROR LEDGER-ADOPT-FROM src/merged.js`, so re-check them after the merge.

---- Part 3 of 3 (sent to the lead by SendMessage) ----

Part 3 of 3 (spec adversary, commit 975a62305917a83080c0433ec6ec0a67dfb65367, working tree).

READ
- report-pre2.md; proposal.md, design.md, tasks.md and specs/gap-ledger/spec.md of the change in full; evidence.md headings, lines 474-623 and 740-860.
- scripts/spec/lib/ledger.mjs in full; scripts/spec/gates.mjs 505-740 plus the grep of adoptedAsIs/adoptedFile; scripts/spec/lib/git.mjs 22-60; registry.mjs 66-117.
- src/tooling/spec/ledger.test.mjs 680-730 and 1440-1664; src/tooling/spec/gates.test.mjs 2560-2840; pre2.diff lines 5880-6283 (tasks tail, ledger.mjs, both test files).
- Base openspec/specs/gap-ledger/spec.md 28-127, 205-345, 385-556.
- ownership-gates clone: gates.mjs 678-710, lib/ownership.mjs 60-110, grep of isAdoptSource/toleranceCounts.
- gaps.json grep (675 totals, 675 loaded entries; no entry for the changed code or test files).

NOT READ
- proof.json, proof-pass2.json, proof-pass3.json; evidence.md 1-473 and 618-740; the two pre-review-1 reports; the rest of pre2.diff (documents).
- No gate output was given and the change is not ratcheted, so I read no history.jsonl lines, links.json or ids.json for this change (check 6 and 7 not applicable yet). No retired IDs are added or used.
- QA scripts: a grep found no qa-*.mjs about the ledger or the adopt lines (the 8 hits are visual "tolerance"), so check 11 gives nothing.
- I ran no code. The 240 gates test count, all coverage figures and all mutation results are the worker's claims; I only read the tests for what they would catch.

CHECKED CLEAN
- check 1 (scenario and test): each of 136-154 has a tagged test that makes the WHEN condition and asserts the THEN; the weak spots are filed or listed in part 2.
- check 4/5 (true coverage, gate values): the new fake-spawn helper TOLERANCE_OPTIONS (gates.test.mjs:2620-2635) and the lcov rewrite in test 154 write only inside the fixture root, the same pattern as the guard-999 writers already on main (gates.test.mjs:999 onward). No /proc read, no process without node:child_process.
- check 9 (origin): both ADDED requirements are spec-first with spec in the change and test tasks before code tasks.
- check 10 (known limits): gaps not named are filed as minor findings (covered baseline lowered by neverWorseCounts; large partial improvement keeps slack).
