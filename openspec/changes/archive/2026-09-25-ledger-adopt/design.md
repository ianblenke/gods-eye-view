## Context

The change `upstream-sync` merges the upstream branch into the fork. The change makes one Git merge commit. Its first parent is the newest commit of the fork, and its second parent is the newest commit of the upstream branch. The text calls the second parent the merged commit.

The gates run on the merged tree with the base `origin/main`. They stop the build with 823 errors. 813 of these errors have four types:

- 301 code files have no ledger entry (`LEDGER-NEW-COVERAGE-GAP`).
- 121 code files have a larger not-covered count than their entry (`LEDGER-LARGER-GAP`). This gives 158 errors, one for each metric.
- 184 test files have no entry (`LEDGER-NEW-UNTRACED`).
- 170 test names are new in a test file that has an entry (`LEDGER-NEW-UNTRACED-NAME`).

The other 10 errors have other codes: four `COVERAGE-FAKE`, two `TRACE-FAILED-TEST` for one test, and one each of `GATES-TEST-LEAK`, `LEDGER-NO-BASELINE`, `LEDGER-STALE` and `TRACE-LINKS-STALE`. The four types and `LEDGER-NO-BASELINE` name 656 files. 16 of these files differ from the same file in the merged commit, because a person merged them by hand. The other 640 files have the content of the merged commit.

## Goals and non-goals

- Allow the gaps of merged code with an exception that has an exact limit and that a person can see.
- Keep the rule for each other file. A gap in code that a person wrote in this project cannot open.
- Do not change the ratchet, the tolerance or the waiver.
- Do not close any gap in this change. The backfill changes close them.

## D1 A new command, and not many waivers

The command `waive` needs one call for each file and each metric. The errors name 423 code files with a gap that the ledger does not allow. So the command needs at least 423 calls, and each call needs a reason. A reason that repeats 423 times tells the reviewer nothing. The command also refuses a file that no test loads, and it has no metric for untraced tests.

The command `adopt` makes one decision for all the files that the merged commit changed. It records that decision as one history line for each file. The lines give the person who merges the change a list of files, with the counts, and one merged commit. That person can compare the list with the Git diff between the merge base and the merged commit.

## D2 Which files the command adopts

The command adopts a file when three things are true. The file has a gap: it is a code file with a not-covered count above 0, or a test file with untraced tests. The content of the file is not equal to its content in the base commit. The merged commit changed the file since its merge base with the base commit.

The third condition uses the Git diff between that merge base and the merged commit. A file that only the fork changed is not in that diff, so the command never adopts it. A gap in code that a person wrote in this project stays a gap that cannot open.

A file that both sides changed is in the diff. A person can add a gap to such a file when that person resolves the conflicts, and the command adopts it with the rest. The known limit `adopt-hand-merged-files` names this. The rejected option R1 gives the reason.

## D3 What the gate checks in an adopt line

An adopt line has the kind `adopt`. It has the date, the change name, the head commit, the file and the full hash of the merged commit. It also has the three not-covered counts, the number of untraced tests and the mark for untrue coverage.

The gate reads the lines of the checked change after the base history, as it does for a waiver. A line is valid when its fields `file` and `from` are strings, and its not-covered counts are whole numbers of 0 or more or `null`. Its number of untraced tests must be a whole number of 0 or more. It must also pass these two checks:

- If the commit is not a merged commit, the gate stops with `LEDGER-ADOPT-FROM`.
- If the commit is a merged commit, and the merged commit did not change the file, the gate stops with `LEDGER-ADOPT-FILE`.

Some lines give no error and no adopted count:

- A line with the wrong kind or the wrong change name.
- A line with a wrong count.
- A line with a field `file` or `from` that is not a string.

For such a line, the gate shows the same errors as it shows with no such line. The gate does not check the head commit and the date of a line.

The gate checks the commit that the line names and its file with Git. It does not compare the counts of the line with a measurement. A person can also merge a local branch and adopt from it. The known limits `adopt-by-hand` and `adopt-own-merge-commit` name this. The person who merges the change reads the lines, and records the check of the merged commit in `review.md`.

## D4 The adopted count and how the gate uses it

The adopted count of a metric for a file is the largest count of that metric in its valid lines. `compareWithBase` allows the count of an entry up to the larger of two values. One value is the base count plus the waived count. The other value is the adopted count.

`compareLedger` does not change. The command writes the entry from the same measurement as the gate, so the entry equals the current gap.

The adopted count stays a limit for the whole change. Later in the same change, a person can edit the ledger and raise a count up to the adopted count with no waiver. This is also true after the person made the entry smaller. The known limit `adopt-later-edit` names this.

A file that has no entry in the base ledger has a base count of 0. The gate allows its entry when each count is at or below the adopted count. The gate applies these rules only to a file whose content is not equal to its content in the base commit.

## D5 Untraced tests

The ledger keeps a count for each test name. An adopt line does not keep the names, because the names of about 1800 untraced tests are too many for a person to read. The line has one number for the file: the number of untraced tests of its entry.

`compareWithBase` adds the counts of all names of the entry, and this gives the number of untraced tests of the entry. The gate allows the entry when this number is at or below the adopted count. If this number is above the adopted count, the gate keeps the old error. That error is for each name that is new or that has a higher count than in the base entry.

## D6 Untrue coverage

A file has untrue coverage when a test runs its code with a source that is not the file. The four merged files `src/app/layers/traffic.js`, `src/data/cameraSensitivity.js`, `src/sources/overpassRoads.js` and `src/sources/sourceSlot.js` are in this case. The ledger already has 25 such entries, all pre-spec.

The gate stops for an entry with untrue coverage that the base does not record (`gap-ledger-032`), and for a new entry with untrue coverage (`gap-ledger-092`). A valid adopt line has the mark for untrue coverage. Then the gate does not stop the build for the untrue coverage of its file. This applies only to a file whose content is not equal to its content in the base commit (`gap-ledger-098`). The file stays not loaded in the ledger, so no count can improve until a later change loads it with its true source.

## D7 The order of the steps

The steps of `upstream-sync` are:
1. Merge the upstream branch and resolve the conflicts.
2. Run `make adopt` with `CHANGE=upstream-sync` and `FROM` set to the merged commit.
3. Run the `waive` command for each file that the adopt command did not adopt, if any.
4. Run `make ratchet CHANGE=upstream-sync`.
5. Run `make gates CHANGE=upstream-sync`.

The command `adopt` runs the tests one time. The ratchet command runs them again and writes the registry and the links. Each of these commands takes about 15 minutes. The change `upstream-sync` runs each command one time.

For each ledger entry, the gate reads the file in the base commit. It does this to find whether the content of the file is equal to its content in the base commit. `compareWithBase` now does this one more time for each entry. This costs one Git call for each entry, and it changes no result.

## Options that this change rejects

- R1 Adopt a file only when its content is equal to its content in the merged commit. This is stricter. It leaves 16 files that a person merged by hand. For 8 of these files the gate needs untraced names, which no waiver can give. The stricter rule does not help, so the change takes the wider rule and names the limit.
- R2 Give each adopt line the names of the untraced tests. The history file then holds about 1800 tests with their names, and a person cannot read them. A number is enough, because the gate still stops for an entry whose number of untraced tests is above the adopted count.
- R3 Change `init` so that it runs again for a merge commit. The command `init` stops when the base has a ledger, and that rule protects the ledger from a rewrite. A rewrite has no limit at all.
- R4 Add the adopt lines to the base ledger in memory, and leave `compareWithBase` as it is. This is less code. It cannot hold the number of untraced tests without the names, and it hides the rule in a place that the scenarios do not name.
- R5 Add a waiver metric for untraced tests. The rule "a test without a scenario ID is a gap that cannot open" then has a general exception. The exception of the command `adopt` has a commit and a file list, so it is narrower.

## How the gates measure the requirement

The trace gate needs a changed test for each of the four scenario bodies that change: `gap-ledger-021`, `gap-ledger-022`, `gap-ledger-032` and `gap-ledger-040`. The requirement text of "Comparison with the base commit" stays the same, so the other ten carried scenarios keep their tests and their text.

Each new scenario has a test with the tag of its ID. `scripts/spec/lib/ledger.mjs` and `scripts/spec/lib/git.mjs` stay at 100% lines, branches and functions. `scripts/spec/gates.mjs` keeps its one phantom branch that the ledger records. The new fault check of the command uses one array and one `find` call, so that it adds no phantom branch.

## Files that the change adds or changes

- `scripts/spec/lib/ledger.mjs`: `adoptsOf`, `checkAdopts`, `adoptedCounts`, `adoptLedger` and the adopted count in `compareWithBase`.
- `scripts/spec/lib/git.mjs`: `resolveCommit`, `mergeParents` and `changedByCommit`.
- `scripts/spec/gates.mjs`: the command `adopt`, the option `--from` and the check of the adopt lines.
- `Makefile`: the target `adopt`.
- `AGENTS.md`: rule 21.
- `src/tooling/spec/ledger.test.mjs`, `src/tooling/spec/gates.test.mjs`, `src/tooling/spec/git.test.mjs` and `src/tooling/spec/ciFiles.test.mjs`: the tests.
- `src/tooling/spec/testGuard.test.mjs`: the list of the tests that need the guard gets the three new tests of `gates.test.mjs`.
