## Why

The fork is 61 pull requests behind the upstream project. The merge commit of the upstream branch brings 1002 changed files, and 650 of them are code files. Upstream has no scenario IDs and no ledger. The gates stop the merged tree with 823 errors. 813 of them have one of four shapes:

- 301 code files have no ledger entry.
- 121 code files have a larger not-covered count than their entry. This gives 158 errors, one for each metric.
- 184 test files have untraced tests and no ledger entry.
- 170 untraced test names are new in a test file that has an entry.

The other 10 errors have other codes. The four shapes and the error `LEDGER-NO-BASELINE` name 656 files.

The gates are correct for these files, and they give no way to allow them. The command `waive` names one file, one metric and one count, and it refuses a file that no test loads. No waiver exists for an untraced test name, because a test without a scenario ID is a gap that cannot open. Hundreds of waivers by hand hide the gaps under reasons that nobody reads. A weaker gate does not solve the problem.

The project needs one exact way to say that a gap came with merged code. A person did not write that code in this project. Later backfill changes close these gaps with specs and tests.

## What Changes

- Add the ledger command `adopt` with the options `--change` and `--from`. The option `--from` names a merged commit. A merged commit is a parent, other than the first parent, of a merge commit after the base commit.
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
- Gaps that this change closes: none. V8 moves the branch count of `src/data/labelArbiter.js` between runs, and the ratchet command records that move. The known limit `banked-branch-count` names it.
- The ledger file keeps the version 4. An adopt line is a history line, so `openspec/trace/gaps.json` gets no new field.
- This change does not run `adopt`. The change `upstream-sync` runs it on the merge commit. That change is the first user of the command.

## Known limits and later changes

- `adopt-hand-merged-files`: A file that upstream changed and that a person merged by hand gets its whole measured gap adopted. A gap that the merge resolution added is inside that count. The reviewer of the merge reads the Git diff between the merged commit and HEAD for these files.
- `adopt-by-hand`: A person can write an adopt line by hand. The gate checks the commit and the file of the line with Git. It does not compare the counts of the line with a measurement. The reviewer of a change reads each adopt line.
- `adopt-own-merge-commit`: The gate cannot find the difference between a merge of the upstream branch and a merge of a local branch. A person who merges a local branch can adopt from it. Then the gaps of that branch get valid lines. Rule 21 of `AGENTS.md` forbids this, and the reviewer of `upstream-sync` compares the merged commit with the upstream remote.
- `adopt-merge-commit-only`: The gate finds the merged commit through a merge commit. A squash merge or a cherry-pick has no merged commit, so the command stops for it.
- `adopt-no-decay`: An adopted gap stays in the ledger until a backfill change closes it. The origin of a new entry is the name of the change that adopted it. An entry that the ledger already had keeps its origin.
- `adopt-untraced-total`: The adopted count of untraced tests is one number for a file: the number of untraced tests of its entry. The gate does not compare the names of the tests, because a line with the names of all tests is too long to read.
- `adopt-later-edit`: A later edit in the same change can raise a count up to the adopted count with no waiver. The adopted count stays a limit for the whole change, also after an edit makes the entry smaller.
- `adopt-untrue`: An adopted file with untrue coverage stays not loaded in the ledger. A later change makes the test load the file with its true source.
- `adopt-sameasbase-reads`: To find if a file has the base content, the gate reads the file in the base commit once more for each ledger entry. This costs one Git call for each entry. It changes no result.
