Verdict: FAIL

# Spec review, round 1, scope full: ownership-scoped-gates (complete report)

Tree read: clone /home/ianblenke/docker/gev-work/ownership-gates, branch ownership-gates, commit 21572b509961d2c3880d0c4fea00fa5bc78df8cf. I took this hash from .git/logs/HEAD, because I cannot run git. The ratchet history line names commit 1ee5e66ab6c60d4d065a2bbcecf7bb7f419ff57e. The reflog shows only the ratchet-output commit (87e974c5) and the archive commit (21572b50) after it. I could not diff the code between 1ee5e66 and HEAD. I cannot run code or mutations.

## Findings

- [ ] FINDING critical scripts/spec/lib/ownership.mjs:70-75 A one-line hand-written history entry turns off COVERAGE-DIFF for every code file. `syncChangedLines` accepts any line after the base history prefix with `kind: "adopt"`, the change name and a non-empty string `from`. It checks only `git merge-base --is-ancestor <from> HEAD`.
  - **Trace of `{"kind":"adopt","change":"<name>","from":"<HEAD hash>"}`:**
    1. `HEAD` is an ancestor of itself, so the check at lines 72-75 passes.
    2. The line has no `file`, so line 80 gives every file `adopts.at(-1).from`.
    3. Line 81 diffs the working tree against `from`. The code is committed before the ratchet (AGENTS.md step 2), so that diff is empty, and line 82 empties every file.
    4. The log prints `COVERAGE-DIFF: N changed lines, N brought by the merged upstream commit, 0 need coverage.`
  - **Why nothing else rejects it:** `adoptsOf` (`ledger.mjs:269-279`) drops the line because it has no `file` and no `untraced`. `checkAdopts` (`gates.mjs:671-676`) therefore never sees it, and LEDGER-ADOPT-FROM never fires. `compareWithBase` (`ledger.mjs:564`) checks only the history prefix. No other code validates history lines.
  - **Effect:** COVERAGE-OWNED still protects owned files that the change edits. Upstream-class code, which is most of `src/`, loses the new line gate completely.
  - **The tests pin the defect.** `ownershipGate.test.mjs:316` uses `{kind:'adopt',change:'add-demo',from:'0'}` with no `file`, and the gate treats it as a source. The `ownership-024` tests in `ownership.test.mjs` never try a malformed line with a valid ancestor.
  - **Where the defect is stated:** `spec.md:174` ("Each source must be an ancestor of HEAD") and `design.md:97,101` ("a nonempty from hash"). The ancestor bound is the defect.
  - **Fix:**
    - Select sources with the same filter as `adoptsOf`, and require `mergeParents(root, base).has(resolveCommit(root, from))` inside the function. This is the predicate `adopt` already uses at `gates.mjs:485`. Alternatively, pass only `checkAdopts().valid` lines.
    - Stop on a malformed adopt line for the change instead of ignoring it.
    - Add these tests, each of which must fail against the current code: a line with no `file` and `from` = HEAD; a well-formed line with `from` = a work-branch commit that is not a merge second parent; a valid ancestor that no merge brought.
    - Change the spec line "Each source must be an ancestor of HEAD" to name the merged-commit bound.
  - **Residual:** a real merge of an own branch followed by `adopt --from` is still accepted. Only rule 21's manual check covers it. Name this in Known limits. Consider requiring `from` to be an ancestor of the upstream ref when that ref exists.

- [ ] FINDING major scripts/spec/lib/qa-register.mjs:39-41 The QA synthetic header is open by default, and the Known limits do not name this case.
  - **Cause:** the manifest has no `scripts/qa-` entry. Every QA script is therefore upstream-class, including a new script that the fork writes and an existing script whose header someone deletes.
  - **Effect:** a header-less script passes with one advisory line. The synthetic header puts it in `validQaScripts`, so it leaves the code inventory. It then gets no whole-file coverage, no COVERAGE-DIFF and no ledger gap. Before this change, a valid header was the price of that exemption.
  - **Evidence:** the `qa-scripts-024` (`gates.test.mjs:1204`) and `qa-scripts-014` (`gates.test.mjs:1244`) fixtures had to add the script to the manifest to keep the old failure.
  - **Known limits:** they name upstream scripts and "new code outside the manifest" in general. They do not say that rule 22 ("Add a header to each new QA script that the fork writes") is unenforced for any unlisted path.
  - **Fix:** give the synthetic header only to a script that exists at the base without a QA tag, or that a valid adopt source brought. A new script, or one whose base version had a header, keeps QA-HEADER. Alternatively, list the fork-written scripts in the manifest. Add a test with a new header-less script at an unlisted path that expects QA-HEADER.

- [ ] FINDING major openspec/changes/archive/2026-10-08-ownership-scoped-gates/specs/ownership/spec.md:106-109 Scenario ownership-012 is unmet, and its test does not check the missing part.
  - **The THEN line:** it says the text "needs full coverage for changed owned code and code without a ledger entry".
  - **The text:** grep for "ledger entry" over AGENTS.md and openspec/config.yaml finds nothing. Rule 5 and config item 4 name only code that a change "adds or edits".
  - **The test:** `ownership.test.mjs:118-132` asserts nothing about a ledger entry.
  - **Fix:** put the "no ledger entry" clause in AGENTS.md rule 5 and config item 4 and assert it in the test, or remove it from the THEN line. The gate does enforce it, through the `Object.hasOwn(ledger.coverage, ...)` clause in `coverageFaults`.

- [ ] FINDING major scripts/spec/lib/ownership.mjs:20-24 The manifest is read only from the working tree. Nothing compares it with the base manifest, and no test checks the real openspec/ownership.json.
  - **Example:** remove `scripts/spec/` from the manifest and edit `test-guard.mjs`, keeping its recorded branch gap. COVERAGE-OWNED no longer applies to the file. The ledger sees no larger gap. The QA header exception applies to its scripts.
  - **How the tests show this:** `ownershipGate.test.mjs` changes the manifest and the code in the same change, and the new `gates.test.mjs` fixtures use `owned: []`.
  - **Known limits:** they cover only "new code outside the manifest", not removing or shrinking an owned path.
  - **Fix:** stop (a new OWNERSHIP-MANIFEST condition) when a path that is owned in the base manifest is not owned now, or classify with the union of the base and current manifests. Add a test that asserts the real manifest owns named sentinel files: scripts/spec/gates.mjs, src/layers/osh/index.js, server/providers/osh.js.

- [ ] FINDING minor scripts/spec/lib/ownership.mjs:55 `changedLines` uses the default `spawnSync` maxBuffer of 1 MiB. `git.mjs:4` and `measurement.mjs:56` use 256 MiB. A diff over 1 MiB gives `status: null`, and the gate stops with "Git cannot read the diff of ..." and an empty reason. This hits a sync that brings a large generated JS file. For new files the diff output is not even used, because the code reads the file text itself. Fix: set maxBuffer as the other two files do, or run `git diff` only for files that exist in the base.

- [ ] FINDING minor scripts/spec/lib/ownership.mjs:121 HTML and shell files have no escape from COVERAGE-DIFF. Line waivers need `item.loaded && !item.untrue`. A markup-only template has `complete: true, loaded: false` (`coverage.mjs:150-153`), and `.sh` files are never loaded. Any non-sync edit to index.html, src/ui/templates/*.html or scripts/*.sh cannot pass. The Known limits name the failure but not the absence of a remedy. Per rule 18, tell the lead, and either treat zero-script HTML as having no code lines or add a waiver path.

- [ ] FINDING minor src/tooling/spec/ownershipGate.test.mjs:183,203,328 Three tags do not match what the tests assert. Line 183 (ownership-004 ownership-026) asserts that `adopt` does not report an owned gap; it does not assert COVERAGE-OWNED. Line 203 (ownership-007 ownership-026) asserts that a failed `git diff` stops the gate with COVERAGE-DIFF; no scenario describes that behaviour, and it is neither the uncovered-lines result of 007 nor the gap-listing result of 026. Line 328 (ownership-026) pins an uncaught SyntaxError as the behaviour for bad history. Other tests cover 004, 007 and 026 properly, so no gap is hidden. Add scenarios or AND lines for the diff-failure stop and the order rules, and drop the tags that do not match.

- [ ] FINDING minor openspec/changes/archive/2026-10-08-ownership-scoped-gates/specs/ownership/spec.md:177-180 The AND line of ownership-020 ("5 upstream source lines") does not name the literal log text `COVERAGE-DIFF: 5 changed lines, 5 brought by the merged upstream commit, 0 need coverage.` The test compares against a literal that the spec does not name (rule 14).

- [ ] FINDING minor openspec/changes/archive/2026-10-08-ownership-scoped-gates/proposal.md:78 Survivor class L4 (evidence.md:152) is not in Known limits. The requirement says the owned gap advice "applies only to check and ratchet". The tests provoke only `adopt` for that advice. No test provokes `ci` or `init`, and no test checks the class lines for other commands. Add L4 to the proposal list, or add the cases.

- [ ] FINDING minor AGENTS.md:35 "Each sync change uses `adopt` for every file the merge brings." cannot be done as written. `adoptLedger` (`ledger.mjs:676-689`) writes lines only for eligible files with a gap or untraced tests. Say "every file with a gap". An agent that follows the sentence literally may hand-write adopt lines, which is the path in the critical finding.

- [ ] FINDING minor scripts/spec/lib/ownership.mjs:9-17 The manifest check accepts entries that match no file. A typo, or a directory written without its final `/` (for example `scripts/spec`), silently becomes an exact-file entry. Known limits do not name it. Either check that each entry matches a tracked path, or name it.

## Answers to the owner's questions

**Rule 18, inputs that failed before and pass now.** The base had no COVERAGE-OWNED and no COVERAGE-DIFF, so both checks only add failures. The pass-3 narrowing (an unchanged owned file with a ledger entry passes) is not weaker than the base. The real fail-to-pass cases are: (1) a header-less upstream-class QA script (finding 2); (2) everything under the forged adopt line (finding 1); (3) anything reclassified by a manifest edit (finding 4).

**`ledger` and `changedFiles`.** `ledger` is the current on-disk ledger (gates.mjs:560, read before the ratchet writes). `changedFiles` is `diffFiles.filter(f => !sameAsBase(f))` (gates.mjs:577). It holds added, edited and deleted files and excludes files with the base content.

**Hiding an owned gap.**
- Hand-added ledger entry for an unchanged owned file: blocked. COVERAGE-OWNED skips it, but `compareWithBase` gives LEDGER-NOT-IN-BASE (ledger.mjs:501). A waiver needs a changed file, and an adopt allowance needs a changed file or the `reached` conditions.
- Hand-added ledger entry for a new owned file: blocked. A new file is always in `changedFiles`.
- Rename or move: blocked. The new path is absent from the base, so it counts as changed.
- Mode-only change: intentionally unchanged. A test pins it.
- Manifest reclassification: not blocked (finding 4).

**Sync exemption.** For a well-formed source from a real merge, the rule is sound. A line is exempt only if it equals the base or equals the source at the diff-aligned position. Fork-written lines differ from both. A file the merge did not touch uses the last source, but then the base diff and the source diff match, so nothing is lost. The exemption fails only through the source selection (finding 1).

## Checked, no finding

- **Gate output.** Log /tmp/claude-1000/gcr/own2-ratchet.log line 2 reads `Command: ratchet`. Its only error is `ERROR REVIEW-MISSING` (line 1896), followed by `Gates failed with 1 errors.` It has no synthetic-header QA lines, only `QA: no script covers the capabilities of this change.` It shows `Ownership: 22 owned, 0 upstream`, `Owned gaps: 2 code files`, `COVERAGE-DIFF: 189 changed lines, 0 brought..., 189 need coverage.` and `Ledger: 0 entries do not match`. own1-ratchet.log has the 8 errors you described: 4 SPEC-LINT-NO-TASK, 2 TRACE, 2 COVERAGE-OWNED.
- **Ledger and history.** gaps.json has branches 1 for scripts/spec/lib/test-guard.mjs (line 409) and src/layers/osh/index.js (line 5494). history.jsonl:2041 holds exactly one line for this change, of kind `measurement`. This agrees with "no gap opened or closed".
- **Test counts.** I counted `test(` calls: ownership.test.mjs has 35, qaRegister.test.mjs has 39, and ownershipGate.test.mjs has 16 declarations, one of which is a loop that makes 3 tests, so 18.
- **Evidence arithmetic.** Mutation totals add up: 123 + 1 + 5 = 129, 306 + 3 + 6 + 2 = 317, 44 + 31 = 75. 22 owned files matches the 22 changed files in the log. The 189 changed lines match my count of the diff.
- **Tasks and requirements.** Tests come before code in every task group. All 20 requirements have `Origin: spec-first`.
- **Trace.** links.json links all 28 scenarios to tests.
- **Test hygiene.** The new tests use only node:child_process, temporary roots and fixed git environment values. No test writes to the real result, lcov or guard folders.

## Read

AGENTS.md, openspec/config.yaml, report-round1.md, full.diff (whole file), proposal.md, design.md, tasks.md, evidence.md, specs/ownership/spec.md (archived change); scripts/spec/gates.mjs (lines 170-760), lib/ownership.mjs, lib/qa-register.mjs, lib/v8-merge.mjs, lib/measurement.mjs, lib/inventory.mjs, lib/git.mjs, lib/coverage.mjs (lines 1-195), lib/ledger.mjs (lines 180-710); the three new or changed test files through the diff; openspec/trace/gaps.json, links.json, history.jsonl (this change's line), ids.json (this change's entries); openspec/specs/qa-scripts/spec.md and coverage-gate/spec.md (selected scenarios); .git/logs/HEAD; the two ratchet logs; headers of two QA scripts.

## Not read or not verified

- The manifest against upstream/main, and the claim "all 1025 fork-only files". I cannot run git. I also could not tell whether the fork wrote any QA script. The two I read, qa-director-timing.mjs and qa-recent-imagery.mjs, look upstream-authored.
- The three mutation-results*.json files, review.mjs, retired-ids.json, and the parts of gates.test.mjs outside the diff.
- Whether the code at HEAD equals the code at ratchet commit 1ee5e66.
- `make gates-docs` and the final `make gates`. You report these.
