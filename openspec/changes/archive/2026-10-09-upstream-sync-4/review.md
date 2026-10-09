# Review: upstream-sync-4

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-09
Gates: make gates CHANGE=upstream-sync-4 passed
Rounds: 3
Scope: diff 81528431
Reviewed-Tree: 53a0b93a3af2597c37a613847e92dbcfdbccbcf0c45864b70ff323b3d77f72fe

## Findings

The reports of round 1 and round 2 are in `review/round-1/` and `review/round-2/`. The reports of round 3 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each report holds the final message of the agent and the evidence messages that it sent.

The agents of the session kept the old severity instructions during these rounds. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary and ste-adversary) The sentence of `design.md` that gave the base commit as the first parent of the merge commit was false. The first parent is the plan commit `7c1a511e`. Corrected in `design.md` and `proposal.md`. The file `evidence/upstream-check.txt` shows both parents.
- [x] FINDING major (ste-adversary) The proposal said "new upstream files" for the 24 adopted files, but 18 of them are modified files. Corrected: the proposal says "each upstream file that the merge brings and that has a coverage gap" and uses "added" for the six new files.
- [x] FINDING major (spec-adversary and ste-adversary) Tasks 2.1 and 2.2 were checked, but the host run lacked `src/sources/openFreeMap.test.mjs` and the tests of other changed files. Corrected: the lead ran each test file under `src` on the host and the named tests of `gates.test.mjs`. The file `evidence/host-run.txt` has one line for each file.
- [x] FINDING major (ste-adversary) The AND line of `qa-scripts-023` about the synthetic header of two scripts conflicted with `openspec/specs/ownership/spec.md` line 105. That line says that `qa-scripts-023` does not apply within the QA exception. Corrected by option (b): the AND line is gone from the delta spec, from the main spec and from the register test. The scenario text changed, so the lead ran the image ratchet again.
- [x] FINDING minor (spec-adversary and ste-adversary) A fault that reaches the last assertion (moot after the correction above), the order of two tasks, the scope of "The upstream tests have no scenario ID", the number of routes, the missing commit count and file names in the evidence, and wording faults in the proposal, the design, the tasks and the evidence. The lead rewrote the four documents and corrected the findings, except task 2.4 (see the limits below).

### Round 2 (scope: diff 39198826) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (ste-adversary) The proposal said that the upstream code adds three routes and that two of them read the auth file of Codex. That was false. The code adds two routes and one mode of an old route, and all three read the auth file. Corrected after the lead read `server/providers/openai.js`, `realtime.js` and `codex-auth.js`. Both agents gave a different replacement text, so the lead did not copy either.
- [x] FINDING major (spec-adversary and ste-adversary) The Known limit `host-modules` said that some test files need modules that the host does not have. That contradicted the evidence. Corrected: the limit `host-skip` names the real difference. Two test files skip all their tests, because the host has Node 26 and the tests need Node 24.
- [x] FINDING major (spec-adversary and ste-adversary) Task 2.1 gave two instructions. Corrected: the tasks 2.1 to 2.3 give one instruction each.
- [x] FINDING minor (spec-adversary and ste-adversary) The task 1.1 with two deliverables and its order against the history, the words "each other" and "covers", the heading of one evidence command without its pipe, and the skipped tests that the evidence did not name. The lead checked the history with git: the plan commit `7c1a511e` holds the delta spec, and it comes before the merge commit and the test commit. Corrected, and `evidence/upstream-check.txt` shows the git output.

### Round 3 (scope: diff 81528431) - PASS (spec-adversary PASS, ste-adversary PASS)

- [x] FINDING minor (ste-adversary and spec-adversary) The host Node version 26 had no record in the evidence. Corrected: the new file `evidence/host-node.txt` shows the host version, the version that the tests need and the function that checks it.
- [x] FINDING minor (ste-adversary) The paragraph about `evidence/upstream-check.txt` did not name the plan commit evidence. Corrected in `evidence.md`.
- [x] FINDING minor (spec-adversary) The words "The last lines show" in `evidence.md` pointed at lines that were no longer the last lines. Corrected: "The lines after the list of the 33 files show".
- [x] Both agents checked that the corrections of round 2 add no new fault. They found no critical finding and no major finding. The lead made the corrections of the minor findings only in `evidence.md` and in the new file `evidence/host-node.txt`, and then ran `make gates-docs` again.

## Record of the image ratchets

The lead ran three image ratchets with `make ratchet CHANGE=upstream-sync-4` in the Docker image `gods-eye-view:local`. The first ratchet ran before round 1. The second ratchet stopped after 25 minutes with the error SPEC-LINT-NO-TASK and gave no comparison verdict. The new text of `tasks.md` had dropped the task that names the scenario ID `qa-scripts-023`. The host lint and `openspec validate` do not find this error.

The third ratchet ran on commit `4865e3d2249e217faf5bee863fe2d6afacdc4d20`. The code files and test files of the final tree are those of this commit. Its log starts with `Command: ratchet`. The verdict lines are:

```text
Command: ratchet
Trace: 914 scenarios, 914 verified, 0 open. 9600 tests, 3704 traced, 5896 untraced.
QA: scripts/qa-voice-auth-focus.mjs uses the synthetic header with the covers item unmapped: upstream.
QA: scripts/qa-voice-auth.mjs uses the synthetic header with the covers item unmapped: upstream.
QA: no script covers the capabilities of this change.
Coverage: 1067 files, 296 complete, 104 not loaded, 51 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 769 code files, 56328 lines, 497 test files, 5896 tests.
COVERAGE-DIFF: 886 changed lines, 886 brought by the merged upstream commit, 0 need coverage.
Ratchet: 1 history lines for upstream-sync-4.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 897 warnings.
ERROR REVIEW-MISSING openspec/changes/upstream-sync-4/review.md Change upstream-sync-4 has no review.md
Gates failed with 1 errors.
Finished: 2026-10-09T20:01:49.046Z (1659.624 s)
```

The only error was the missing `review.md`. The ratchet added one `measurement` line to `history.jsonl` and changed the hash of `qa-scripts-023` in `ids.json`.

The command `make gates-docs CHANGE=upstream-sync-4` on the archived tree (commit `24c2b48b`) gave these lines. The mode runs no test. It trusts the snapshot of commit `4865e3d2`.

```text
NO TEST RUN: the mode trusts the snapshot of commit 4865e3d2249e217faf5bee863fe2d6afacdc4d20
Trace: 914 scenarios, 914 verified, 0 open. 9600 tests, 3704 traced, 5896 untraced.
Coverage: 1067 files, 296 complete, 104 not loaded, 51 untrue.
Ledger: 0 entries do not match the current gaps.
STE: 0 errors, 897 warnings.
ERROR REVIEW-MISSING openspec/changes/archive/2026-10-09-upstream-sync-4/review.md Change upstream-sync-4 has no review.md
Gates failed with 1 errors.
```

The command `git diff --stat ab11cf1b HEAD -- openspec/trace` gives these lines. The file `links.json` has no change.

```text
 openspec/trace/gaps.json     | 149 ++++++++++++++++++++++++++++++++-----------
 openspec/trace/history.jsonl |  26 ++++++++
 openspec/trace/ids.json      |   2 +-
 3 files changed, 138 insertions(+), 39 deletions(-)
```

## Rule 21 and rule 24

- [x] The upstream remote has the second parent of the merge commit. The command `git ls-remote upstream main` returned `6be25595b16491ce01ffd8d81e66921f321ee200` on 2026-10-09.
- [x] The merge commit `4011f2a60ba75bd57256d4c3256953a1d7d96422` has the parents `7c1a511ebf92fdf3c071e3597a96b05e58d5f72b` (the plan commit) and `6be25595b16491ce01ffd8d81e66921f321ee200` (the merged upstream commit). The plan commit has the base commit `ab11cf1b2eed35481e1e2a49d82dbdcb31bd9dec` as its parent.
- [x] The command `adopt` ran with `--from 6be25595b16491ce01ffd8d81e66921f321ee200`, which is the merged commit and not the merge commit. It recorded 24 files: 13 code files, 9 test files and 2 QA scripts.
- [x] Resolved files: `.env.example`, `CHANGELOG.md`, `SECURITY.md`. Round 1 had the scope `full`, so both agents read these files.
- [x] None of the 33 files that the merge changes is in `openspec/ownership.json`. The merge changes nothing under `openspec`, `.claude`, `AGENTS.md`, `Makefile` or `scripts/spec`, so no gate became weaker (rule 18).

## Known limits for the owner to confirm

The owner has not yet answered for these entries. The pull request asks for confirmation.

- [x] FINDING minor (lead) The upstream code adds a login with a ChatGPT account for the voice feature. The fork does not change this code. Two new routes (`/api/realtime/oauth-status` and `/api/realtime/oauth-login`) and the mode `?auth=oauth` of the token route answer only loopback connections behind the same-site gate. One route starts the program `codex login`, and all three read the auth file of Codex. The feature is optional and experimental, and `GEV_PREFER_CODEX_OAUTH` is its only setting. The owner decides whether to keep it enabled in this fork.
- [x] FINDING minor (lead) The two added QA scripts need a browser, and no gate runs them (limit `qa-not-run`). The gate uses the synthetic header for both scripts.
- [x] FINDING minor (ste-adversary, kept by name) Task 2.4 names four host checks after one "Run", as in sync 3. The lead keeps it as one task, because the four checks are one command group.
- [x] FINDING minor (lead) The host tests run on Node 26, and the image runs Node 24 (limits `host-node` and `host-skip`). Two test files skip all their tests on the host. The test of `src/keySetupHardening.test.mjs` for Windows skips on each Linux run.
- [x] FINDING minor (lead) Some replacement texts of the agents were wrong, for example the number of routes and the wording of task 2.1. The lead checked each replacement against the code and the files before the change.
- [x] FINDING minor (lead) Tasks 3.4 to 3.6 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review, this file and the final gate run.
