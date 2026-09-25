## Why

The fork is 61 pull requests behind the upstream project. The merge commit of the upstream branch brings 1002 changed files, and 650 of them are code files. The upstream project has no scenario IDs and no ledger. The gates give 823 errors for the merged tree and stop the build. 813 of them have one of four kinds:

- 301 code files have no ledger entry.
- 121 code files have a larger not-covered count than their entry. This gives 158 errors, one for each metric.
- 184 test files have untraced tests and no ledger entry.
- 170 untraced test names are new in a test file that has an entry.

The other 10 errors have other codes. The four kinds and the error `LEDGER-NO-BASELINE` name 656 files.

The gates are correct for these files, and they give no way to allow the gaps of these files. The command `waive` names one file, one metric and one count, and it refuses a file that no test loads. No waiver exists for an untraced test name, because a test without a scenario ID is a gap that cannot open. Hundreds of waivers by hand hide the gaps under reasons that nobody reads. A weaker gate does not solve the problem.

The project needs one exact way to say that a gap came with merged code. That is code that a person did not write in this project. Later backfill changes close these gaps with specs and tests.

## What Changes

- Add the ledger command `adopt` with the options `--change` and `--from`. The option `--from` names a merged commit. A merged commit is a parent, other than the first parent, of a merge commit between the base commit and HEAD.
- Make the command write a ledger entry for each file with a gap that the merged commit changed. The command adds one history line of the kind `adopt` for each such file.
- Make the gates allow a ledger entry above the base entry, up to the adopted count of the valid adopt lines of the checked change. This applies to an entry that the base does not have, a rise of a count, more untraced tests and untrue coverage.
- Add the gate errors `LEDGER-ADOPT-FROM` and `LEDGER-ADOPT-FILE`. They stop the build for an adopt line with a wrong commit or a wrong file.
- Add the target `adopt` to `Makefile`, with the options `CHANGE`, `BASE` and `FROM`.
- Add rule 21 to `AGENTS.md`. It says that an agent uses `adopt` only for code that a merge commit brought from the upstream project.
- Change the scenarios `gap-ledger-021`, `gap-ledger-022`, `gap-ledger-032` and `gap-ledger-040` for the adopted count.
- Add the requirement "Adoption of merged code" with the scenarios `gap-ledger-089` to `gap-ledger-099`.
- Keep the rules for a file that upstream did not change. Its gaps cannot open, and the command adopts none of them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `gap-ledger`: the requirement "Comparison with the base commit" gets the adopted count in four scenarios. The new requirement "Adoption of merged code" gets `gap-ledger-089` to `gap-ledger-099`.

## Impact

- Changed files: `scripts/spec/lib/ledger.mjs`, `scripts/spec/lib/git.mjs`, `scripts/spec/gates.mjs`, `Makefile`, `AGENTS.md`, `src/tooling/spec/ledger.test.mjs`, `src/tooling/spec/gates.test.mjs`, `src/tooling/spec/git.test.mjs`, `src/tooling/spec/ciFiles.test.mjs`, `src/tooling/spec/testGuard.test.mjs` and `openspec/specs/gap-ledger/spec.md`.
- When you run the ratchet command, it also changes `openspec/trace/gaps.json`, `openspec/trace/ids.json`, `openspec/trace/links.json` and `openspec/trace/history.jsonl`.
- Gaps that this change opens: none. The change must keep `scripts/spec/lib/ledger.mjs`, `scripts/spec/lib/git.mjs` and `scripts/spec/gates.mjs` at the counts that the ledger has now.
- Gaps that this change closes: none. V8 counts the branches of `src/data/labelArbiter.js` in a different way each time that the tests run, and the ratchet command records the new count. The known limit `banked-branch-count`, in the archived change `2026-09-17-harden-gate-ledger`, names this.
- The ledger file keeps the version 4. An adopt line is a history line, so `openspec/trace/gaps.json` gets no new field.
- This change does not run `adopt`. The change `upstream-sync` runs it on the merge commit. That change is the first user of the command.

## Known limits and later changes

- `adopt-hand-merged-files`: The command adopts the whole measured gap of a file that upstream changed and that a person merged by hand. A gap that a person added when that person resolved the conflicts is inside that count. The reviewer of the merge commit reads the Git diff between the merged commit and HEAD for these files.
- `adopt-by-hand`: A person can write an adopt line by hand. The gate checks the commit and the file of the line with Git. It does not compare the counts of the line with a measurement. The reviewer of a change reads each adopt line.
- `adopt-own-merge-commit`: The gate cannot find the difference between a merge commit of the upstream branch and a merge commit of a local branch. A person can merge a local branch and adopt from the merge commit of that branch. Then the command writes valid adopt lines for the gaps of that branch. Rule 21 of `AGENTS.md` says that a person does not do this. The person who merges a change that uses `adopt` compares the second parent of the merge commit with the upstream remote. That person records the result in `review.md`.
- `adopt-merge-commit-only`: The gate finds the merged commit through a merge commit. A squash merge or a cherry-pick has no merged commit, so the command stops for it.
- `adopt-no-decay`: An adopted gap stays in the ledger until a backfill change closes it. The origin of a new entry is the name of the change that adopted it. An entry that the ledger already had keeps its origin.
- `adopt-untraced-total`: The adopted count of untraced tests is one number for a file: the number of untraced tests of its entry. An adopt line does not keep the names. The history file then holds about 1800 tests with their names, and a reviewer cannot read them.
- `adopt-later-edit`: Later in the same change, a person can edit the ledger and raise a count up to the adopted count with no waiver. This is also true after the person made the entry smaller. The adopted count stays a limit for the whole change.
- `adopt-untrue`: An adopted file with untrue coverage stays not loaded in the ledger. A later change makes the test load the file with its true source.
- `adopt-sameasbase-reads`: For each ledger entry, the gate reads the file in the base commit. It does this to find whether the content of the file is equal to its content in the base commit. This costs one Git call for each entry. It changes no result.
