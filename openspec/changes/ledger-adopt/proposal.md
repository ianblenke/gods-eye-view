## Why

The fork is 61 pull requests behind the upstream project. The merge of the upstream branch brings 1002 changed files, and 650 of them are code files. Upstream has no scenario IDs and no ledger. A run of the gates on the merged tree stops with 823 errors. The errors name 301 code files with a new gap and 158 code files with a larger gap. They also name 184 test files with untraced tests and 170 new untraced test names.

The gates are correct for these files, and they give no way to admit them. The command `waive` names one file, one metric and one count, and it refuses a file that no test loads. No waiver exists for an untraced test name, because a test without a scenario ID is a gap that cannot open. Hundreds of waivers by hand would hide the gaps under reasons that nobody reads. A weaker gate would be worse.

The project needs one exact way to say that a gap came with merged code. A person did not write that code in this project. Later backfill changes close these gaps with specs and tests.

## What Changes

- Add the ledger command `adopt` with the options `--change` and `--from`. The option `--from` names a commit that a merge commit brought into the tree.
- Make the command write a ledger entry for each file with a gap that the merged commit changed. The command adds one history line of the kind `adopt` for each such file.
- Make the gates allow a ledger entry above the base entry, up to the counts of the valid adopt lines of the checked change. This covers an entry that the base does not have, a rise of a count, more untraced tests and untrue coverage.
- Add the gate errors `LEDGER-ADOPT-FROM` and `LEDGER-ADOPT-FILE`. They stop the build for an adopt line with a wrong commit or a wrong file.
- Add the target `adopt` to `Makefile`, with the options `CHANGE`, `BASE` and `FROM`.
- Change the scenarios `gap-ledger-021`, `gap-ledger-022`, `gap-ledger-032` and `gap-ledger-040` for the adopted count.
- Add the requirement "Adoption of merged code" with the scenarios `gap-ledger-089` to `gap-ledger-099`.
- Keep the rules for a file that upstream did not change. Its gaps cannot open, and the command adopts none of them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `gap-ledger`: the requirement "Comparison with the base commit" gets the adopted count in four scenarios. The new requirement "Adoption of merged code" gets `gap-ledger-089` to `gap-ledger-099`.

## Impact

- Changed files: `scripts/spec/lib/ledger.mjs`, `scripts/spec/lib/git.mjs`, `scripts/spec/gates.mjs`, `Makefile`, `src/tooling/spec/ledger.test.mjs`, `src/tooling/spec/gates.test.mjs`, `src/tooling/spec/git.test.mjs`, `src/tooling/spec/ciFiles.test.mjs` and `openspec/specs/gap-ledger/spec.md`.
- The ratchet run also changes `openspec/trace/ids.json`, `openspec/trace/links.json` and `openspec/trace/history.jsonl`.
- Gaps that this change opens: none. The change must keep `scripts/spec/lib/ledger.mjs`, `scripts/spec/lib/git.mjs` and `scripts/spec/gates.mjs` at the counts that the ledger has now.
- Gaps that this change closes: none.
- The ledger file keeps the version 4. An adopt line is a history line, so `openspec/trace/gaps.json` gets no new field.
- This change does not run `adopt`. The change `upstream-sync` runs it on the merge. That change is the first user of the command.

## Known limits and later changes

- `adopt-hand-merged-files`: A file that upstream changed and that a person merged by hand takes its whole measured gap. A gap that the merge resolution added is inside that count. The reviewer of the merge reads the Git diff between the merged commit and HEAD for these files.
- `adopt-by-hand`: A person can write an adopt line by hand. The gate checks the commit and the file of the line. It does not compare the counts with a measurement. The reviewer of a change reads each adopt line.
- `adopt-merge-commit-only`: The gate finds the merged commit through a merge commit. A squash merge or a cherry-pick has no merged parent, so the command stops for it.
- `adopt-no-decay`: An adopted gap stays in the ledger until a backfill change closes it. The origin of the entry is the name of the change that adopted it.
- `adopt-count-not-per-name`: The adopted count of untraced tests is one number for a file. The gate does not compare the names of the tests, because the line would have thousands of names.
- `adopt-later-edit`: A later edit to an adopted file in the same change cannot raise a count above the adopted count. Such an edit can also lower the entry, and then the adopted count has no more effect.
- `adopt-untrue`: An adopted file with untrue coverage stays not loaded in the ledger. A later change makes the test load the file with its true source.
