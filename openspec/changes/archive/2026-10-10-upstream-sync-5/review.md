# Review: upstream-sync-5

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-10
Gates: make gates CHANGE=upstream-sync-5 passed
Rounds: 2
Scope: diff 0fb0248b86418d9c126df9f47c4822886c63c6bf
Reviewed-Tree: 13adab9f9f2b15645661a54b4b9b40c546ad98aed69906c15c6c16192bde66a2

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.

Verdicts (spec adversary / STE adversary): round 1 FAIL / FAIL; round 2 PASS / PASS.
The agents of the session kept the old severity instructions during these rounds. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

### Round 1 (scope full) - FAIL / FAIL

- [x] FINDING major (spec-adversary) The design said "as sync 3 had none" for the missing spec delta. Sync 3 had three deltas and sync 2 had none. Corrected: "as sync 2 had none".
- [x] FINDING major (spec-adversary and ste-adversary) `evidence.md` said that no analyst found a blocker or a major problem, and `evidence/workflow.md` said that a skeptic agent checked one such finding. Corrected: both files now say that one analyst rated the untagged upstream tests in the two recentImagery test files as a blocker, and that the skeptic found the fact true and the severity too high. The adopt command records both files.
- [x] FINDING minor (spec-adversary and ste-adversary) The count of the extra untraced tests came from the analyst and did not fit the ratchet (29 against 28). Corrected: `evidence/untraced-diff.txt` has the command and the numbers of each file (28 = 18 + 2 + 8).
- [x] FINDING minor (spec-adversary and ste-adversary) Task 2.3 said "under `src`", but two test files are under `server/providers/`. Task 1.4 was unclear. The proposal had mixed tenses and an unclear reference. `evidence.md` used the unit "s" for seconds. Corrected in `tasks.md`, `proposal.md`, `design.md` and `evidence.md`.
- [x] FINDING minor (spec-adversary) The records had no command output for three claims: the five pull requests, the equality of the tested files with the files of this branch, and the figures of the analysts. Corrected: `evidence/upstream-check.txt` lists the pull requests, `evidence/host-run.txt` and `evidence/checks.log` name the empty `git diff --stat`, and `evidence/workflow-result.txt` holds the full reports of the analysts.
- [x] FINDING minor (spec-adversary) The Known limits lacked the conflict of the two edited layer counts at the next sync. Corrected: the limit `catalog-count`.

### Round 2 (scope diff 0fb0248b) - PASS / PASS

- [x] FINDING minor (spec-adversary and ste-adversary) A comma splice in `proposal.md` hid a seventh sentence from the lint. Corrected: a period and a new paragraph. The lead made this fault in the correction of round 1.
- [x] FINDING minor (spec-adversary) The limit `share-options` left out the section about adding a provider, and the limit about the size of a link was missing. Corrected: the limit `share-options` names the lines 3142 to 3144, and the new limit `link-size` names the two size limits.
- [x] FINDING minor (spec-adversary) The limit `catalog-count` left out the number 31 in a third line of `src/app/constructCatalog.test.mjs` (line 43, an older fork edit). Corrected.
- [x] FINDING minor (spec-adversary and ste-adversary) The 8 other untraced tests had no name, and `evidence/workflow-result.txt` called `0b51002b` the merged commit. Corrected: `evidence/untraced-diff.txt` names the seven old test files, and a note at the top of `evidence/workflow-result.txt` names the merge commit of the earlier build and the merged commit `591f299d`. The note also says that the figures of the analyst for the test count differ by 18 from `evidence/host-run.txt`. The lead did not reconcile them.
- [x] FINDING minor (ste-adversary) A sentence of `evidence/workflow.md` read as if the tests had no ledger entry, and the inline code span of the note in `evidence/host-run.txt` and `evidence/checks.log` had 8 words. Corrected.

## Own mistakes of the lead in this change

- [x] FINDING minor (lead) The design said "as sync 3 had none". The lead wrote this from memory and did not check the archive of sync 3. The lead now checks such a claim with a command before it goes into a document.
- [x] FINDING minor (lead) Two corrections of the lead added a fault: a comma splice, and two paragraphs with 7 and 8 sentences (found by `make lint` before round 2).

## Record of the image ratchet

The lead ran the adopt command and the image ratchet in the Docker image `gods-eye-view:local`. The adopt command ran with `--from 591f299d11f38a612629a274463196d57ae3862e`, the merged commit, and wrote 39 history lines. The ratchet ran on commit `ac3bdb98e5d64aff11d738e42fc8ebf2b2b6bf55`, which holds the code files and the test files of the final tree. Its log starts with `docker run` and has the line `Command: ratchet`. The only error is the missing `review.md`. The verdict lines are:

```text
Command: ratchet
Trace: 919 scenarios, 919 verified, 0 open. 9632 tests, 3709 traced, 5923 untraced.
Coverage: 1071 files, 304 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 765 code files, 46572 lines, 504 test files, 5923 tests.
COVERAGE-DIFF: 454 changed lines, 454 brought by the merged upstream commit, 0 need coverage.
Ratchet: 1 history lines for upstream-sync-5.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 934 warnings.
ERROR REVIEW-MISSING openspec/changes/upstream-sync-5/review.md Change upstream-sync-5 has no review.md
```

The ratchet added one `measurement` line to `history.jsonl` and changed one line of `gaps.json`.

The command `make gates-docs CHANGE=upstream-sync-5` on the archived tree gave these lines. The mode runs no test. It trusts the snapshot of commit `ac3bdb98`.

```text
NO TEST RUN: the mode trusts the snapshot of commit ac3bdb98e5d64aff11d738e42fc8ebf2b2b6bf55
Trace: 919 scenarios, 919 verified, 0 open. 9632 tests, 3709 traced, 5923 untraced.
Coverage: 1071 files, 304 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 765 code files, 46572 lines, 504 test files, 5923 tests.
COVERAGE-DIFF: 454 changed lines, 454 brought by the merged upstream commit, 0 need coverage.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 934 warnings.
ERROR REVIEW-MISSING openspec/changes/archive/2026-10-10-upstream-sync-5/review.md Change upstream-sync-5 has no review.md
```

The command `git diff --stat 13d71551 HEAD -- openspec/trace` gives these lines. The files `ids.json` and `links.json` have no change.

```text
 openspec/trace/gaps.json     | 271 +++++++++++++++++++++++++++++++++----------
 openspec/trace/history.jsonl |  40 +++++++
 2 files changed, 248 insertions(+), 63 deletions(-)
```

After the ratchet, the lead changed only documents and evidence under `openspec/changes/`. The final `make gates` ran on the final tree.

## Rule 21 and rule 24

- [x] The upstream remote has the second parent of the merge commit. The command `git ls-remote upstream main` returned `591f299d11f38a612629a274463196d57ae3862e` on 2026-10-10.
- [x] The merge commit `1ac580d5fa523ad096ca86d07165243e1b4ad113` has the parents `09bfb5e5344769e685809e0dcd5093c86b006ec0` (the plan commit) and `591f299d11f38a612629a274463196d57ae3862e` (the merged upstream commit). The plan commit has the base commit `13d715511b4c1aabf943de9c2ba25cb174d3db45` as its parent.
- [x] The command `adopt` ran with `--from 591f299d11f38a612629a274463196d57ae3862e`. It recorded 39 files: 21 code files and 18 test files.
- [x] Resolved files: `CHANGELOG.md`, `docs/CURRENT-STATE.md`, `src/app/constructCatalog.js`, `src/data/layerState.test.mjs`, `src/layers/recentImagery/rendering.test.mjs` and `src/layers/recentImagery/thumbnails.test.mjs`. The commit `c394af4a` also edited the layer count of `src/app/constructCatalog.test.mjs` and `src/app/sourceComposition.test.mjs` by hand. Round 1 had the scope `full`, so both agents read these files.
- [x] None of the 50 files that the merge changes is in `openspec/ownership.json`. The merge changes nothing under `openspec`, `.claude`, `AGENTS.md`, `Makefile`, `scripts/spec` or `server`, so no gate became weaker (rule 18).

## Known limits for the owner to confirm

The proposal has the full list of Known limits (`host-node`, `host-skip`, `osh-source`, `credit`, `empty-vessels`, `share-options`, `catalog-count`, `link-size`, `token-collision`, `manifest-path`). The owner has not yet answered for these entries. The pull request asks for confirmation.

- [x] FINDING minor (lead) The OSH layer is outside the new catalog source contracts of upstream. With no sources set, the OSH layer stays available, while the upstream layers with a contract report unavailable. The fork does not change this.
- [x] FINDING minor (lead) The next new upstream layer can take the layer token `3`, which the OSH layer owns. The conflict then shows in `src/data/layerStateTokenReservations.json` at the next sync.
- [x] FINDING minor (lead) Tasks 3.4 to 3.6 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review, this file and the final gate run.
