# Review: upstream-sync-10

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-28
Gates: make gates CHANGE=upstream-sync-10 passed
Rounds: 3
Scope: diff bb0077ce
Reviewed-Tree: b1af1390906b6ea722ecc03593a1f128131dff255f51ede079e4ca509a8c9b53

## Rule 21 check

The first merge commit `73d24eb4` has the parents `5fb4368d` (the plan commit) and `e608fee7935b21251ca8f601003d7d47c813797d`. The second merge commit `711df7e3` has the parents `356b7397` and `2bcdca1c9a2bc0a34074577cc5f4de01d4759233`. On 2026-10-28, `git ls-remote upstream main` gave `2bcdca1c9a2bc0a34074577cc5f4de01d4759233`, and `e608fee7` is in the first-parent history of that commit. So the upstream remote has the second parent of each merge commit. `evidence/upstream-check.txt` gives the commands and their output. The adopt commands used `--from e608fee7935b21251ca8f601003d7d47c813797d` and then `--from 2bcdca1c9a2bc0a34074577cc5f4de01d4759233`.

Resolved files: `CHANGELOG.md`, `package.json`, `src/director/clock.test.mjs`, `src/director/playback.test.mjs`, `src/i18n/locales/zh-CN.json`, `src/layers/perimeters/ownership.test.mjs` and `src/layers/perimeters/source.test.mjs`. The fork also edited `src/i18n/locales/zh-Hant.json`, `scripts/package-boundaries.json` and `src/tools/tool-schema-codepoints.test.mjs` (`evidence/adapted-files.txt`).

## Findings

Round 1 had the scope full, at the commit 6d35c612. Both reviewers gave FAIL. The corrections changed only files under `openspec/`, so the lead ran no new ratchet. Round 2 had the scope diff 6d35c612, at the commit 9f867124. Both reviewers gave PASS. After round 2 the lead fixed the seven minor findings in `proposal.md`, `tasks.md` and `evidence/upstream-check.txt`. These edits are wording and evidence only.

The final `make gates` then failed in two of three runs on a wall-time limit of the upstream test `src/tools/tool-schema-codepoints.test.mjs` (decision D5, `evidence/gates-timing.txt`). The lead changed that test to CPU time at the commit 6a8e3e17. Round 3 had the scope diff bb0077ce, at that commit. The reports of round 3 are in `review/round-3/`.

The reports of round 1 are in `review/round-1/`. The reports of round 2 are in `review/round-2/`. The reports of round 3 are in `review/round-3/` and in `review/`. Each file holds a copy that the lead shortened. Each finding keeps its meaning.

One ratchet run came before the review. It gave only `REVIEW-MISSING`. The edit of the test in round 3 needs the final `make gates` on the final tree, and the lead records its result in the line `Gates` above.

### Round 1 (commit 6d35c612)

- [x] FINDING major (spec adversary) The Rule 25 text said that the merge breaks no test with a scenario ID. Fixed: the text names the broken run of `[i18n-catalogs-001]` for zh-Hant.
- [x] FINDING major (STE adversary) Task 1.4 gave two instructions. Fixed: tasks 1.4 and 1.5.
- [x] FINDING minor (spec adversary) The file counts had no command output. Fixed: `evidence/diff-count.txt`.
- [x] FINDING minor (spec adversary) No fault put back the stale text. Fixed: the second fault in `evidence/faults.txt`.
- [x] FINDING minor (spec adversary) `evidence/upstream-check.txt` gave no note about the commits after the second merge. Fixed.
- [x] FINDING minor (STE adversary) Four wording findings in `proposal.md` and `design.md`. Fixed.

### Round 2 (commit 9f867124)

- [x] FINDING minor (spec adversary) The count in `proposal.md` was of upstream, not of the merge. Fixed.
- [x] FINDING minor (spec adversary) The note about later commits had no command output. Fixed.
- [x] FINDING minor (spec adversary) Task 3.2 named one adopt command for two steps. Fixed.
- [x] FINDING minor (STE adversary) Tasks 3.1 and 1.7 said "the merge commit" and "the merge". Fixed.
- [x] FINDING minor (STE adversary) "the newer upstream head" had two meanings. Fixed.

### Round 3 (commit 6a8e3e17)

- [x] FINDING major (spec adversary) The text said that the edits after round 2 are wording and evidence only. Fixed: the text names the edit of the test.
- [x] FINDING major (spec adversary) The header said `Rounds: 2` and the old scope. Fixed.
- [x] FINDING major (spec adversary) The list of the files that the fork edited had two files. Fixed: it has three files.
- [x] FINDING minor (spec adversary) The comment "roughly 0.7 s" in the test is an upstream line and the fault took 5827 ms on the host. Kept: the lead accepts this minor finding under the owner rule, because the comment is not part of the check.
- [x] FINDING minor (STE adversary) Five wording findings in `proposal.md`, `design.md`, `tasks.md` and `evidence/gates-timing.txt`. Fixed.
