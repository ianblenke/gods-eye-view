Verdict: PASS

I read commit d10db81f86744a3bcd72e30d692af721ea40dc6d from `.git/refs/heads/ownership-gates` in `/home/ianblenke/docker/gev-work/ownership-gates`. I ran no code and no git. E = `openspec/changes/archive/2026-10-09-ownership-scoped-gates/evidence.md`.

I found no critical and no major fault.
- **Banned words:** none in the Pass 17 and Pass 18 blocks of E, in `tasks.md` or in the Purpose. "verified" and TRACE-UNVERIFIED appear only in fences, as literal gate output.
- **Limits:** the longest new sentence has 24 words (E:3713). The paragraphs at E:3736 and E:3765 have 6 sentences each, which meets the limit. The lint log shows 0 errors.
- **Purpose:** `openspec/specs/ownership/spec.md:10-14` equals `design.md:294-298` word for word.
- **Pre-review 17 corrections:** all four majors have the corrected text in place. The counts for pre-reviews 14 to 17 agree with the reports. The Pass 18 fences equal their `pass18/` files.
- **"wrote no file in `openspec/trace/`" (E:3723):** true. `scripts/spec/gates.mjs` writes only to `.gev-cache/spec` and the temp folder before the return at line 653. `writeRegistry` (690), `writeLinks` (691) and `compareLedger` (698) come after it.
- **Tasks 19 and 20:** each task starts with an imperative verb and gives one instruction, or actions at the same time. Task 20.3 agrees with the 21 files in `spec-files-run.txt` (the 22 test files minus `gates.test.mjs`).

Two new minors, both caused by the pre-review 17 corrections:

- [ ] FINDING minor E:3786 "The lead ran the format check, the import direction check, the package boundary check and the layer token check on the host." The sentence does not name the commit of the tree. `pass18/host-checks.log` starts with HEAD 2284f19d, but the block header says "Tree read … 768370eb". Pass 17 names its commit (E:3717). -> After E:3786 add a sentence: "The checks ran on the working tree over commit 2284f19d, after the corrections of pre-review 17." (16 words). Also move this paragraph after the paragraph at E:3788, because the checks ran after that review.
- [ ] FINDING minor E:3788 "The lead corrected the text of Pass 18 and the tasks of section 20." The same corrections also added the pre-review 16 sentence to Pass 17 (E:3711) and renumbered task 19.2. The sentence is not false, but it is incomplete. -> "The lead corrected the text of Pass 17 and Pass 18, and the tasks of sections 19 and 20."

Minors not listed.

I sent the detail of the checks that found no fault to team-lead in one message, part 1 of 1. It includes two points for you: old reports in `review/pre-review-15/` cite "task 19.2" with its old meaning, and `evidence.md` has no block for the passing ratchet at f596ba38.


---- Part 1 of 1 (sent to the lead by SendMessage) ----

Part 1 of 1 (STE adversary, ownership-scoped-gates confirming round, commit d10db81f86744a3bcd72e30d692af721ea40dc6d; I ran no code and no git). The final message holds the verdict and 2 minors. This part holds the checks that found no fault.

1. Purpose: openspec/specs/ownership/spec.md lines 10-14 equal design.md lines 294-298 word for word. Spec and delta spec both have 90 requirement and scenario headings; the 7-line difference in non-empty lines is the Purpose block (8 lines) minus "## ADDED Requirements" (1). I did not diff the other lines of the two spec files one by one: the brief puts that check 1 on the spec adversary.
2. Banned words: none in the evidence.md Pass 17 and Pass 18 blocks, in tasks.md (whole file) or in the Purpose. The only hits are "verified" and TRACE-UNVERIFIED inside the fences (literal gate output), "alone" at evidence.md:3615 (old prose, not in this diff) and --expose-gc in the old spec body.
3. Limits: the longest new sentence is 24 words (evidence.md:3713). No new paragraph has more than 6 sentences (E:3736 and E:3765 have exactly 6). The lint log shows 0 errors.
4. Pass 18 fences equal pass18/ratchet-stop.txt, spec-files-run.txt, runs-head.txt, fault-no-guarded-run.txt and guard-run-summary.txt. spec-files-run.txt has 21 files; src/tooling/spec has 22 test files; the one missing is gates.test.mjs, as tasks 20.3 says.
5. "wrote no file in openspec/trace/" (E:3723) is true: scripts/spec/gates.mjs writes only to .gev-cache/spec and to tmpdir before the return at line 653; writeRegistry (690), writeLinks (691), the ledger and history writes and compareLedger (698) come after it.
6. Counts of pre-reviews 14 to 17 in Pass 17 and Pass 18 agree with the reports in review/pre-review-14 to -17. All pre-review 17 majors have their corrected text in place (E:3723, E:3736, tasks 20.1 and 20.3).
7. Task 19.2 is now "Correct the major fault that pre-review 15 found". The old reports in review/pre-review-15/ cite "task 19.2" for the old meaning (the format check). That is an old record; do not rewrite it. If you want, add one line to review.md.
8. Not an STE point, for the spec adversary: evidence.md has no block for the passing image ratchet at f596ba38 (only the openspec/trace/history.jsonl line and ratchet2-verdict.txt outside the repo). Task 3.8 is checked on that record.
