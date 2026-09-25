## Context

The change `upstream-sync` merges the upstream branch into the fork. The merge is one Git merge commit. Its first parent is the fork, and its second parent is the last upstream commit. The text calls the second parent the merged commit.

The gates run on the merged tree with the base `origin/main`. They stop the build with 823 errors, and the errors have four shapes. 301 code files have no ledger entry (`LEDGER-NEW-COVERAGE-GAP`). 158 code files have a larger gap than their entry (`LEDGER-LARGER-GAP`). 184 test files have no entry (`LEDGER-NEW-UNTRACED`), and 170 test names are new in a file that has an entry (`LEDGER-NEW-UNTRACED-NAME`).

Of the 656 files that these errors name, 16 have other content than the merged commit. Those are the files that the merge resolved by hand. The other 640 files are the same as in the merged commit.

## Goals and non-goals

- Admit the gaps of merged code with an exact, bounded and visible exception.
- Keep the rule for each other file. A gap in code that the project wrote cannot open.
- Do not change the ratchet, the tolerance or the waiver.
- Do not close any gap in this change. The backfill changes close them.

## D1 A new command, and not many waivers

The command `waive` needs one call for each file and each metric. For 656 files that is more than 1000 calls, and each call needs a reason. A reason that repeats 1000 times tells the reviewer nothing. The command also refuses a file that no test loads, and it has no metric for untraced tests.

The command `adopt` makes one decision for the whole merge, and it records that decision as one history line for each file. The lines give the reviewer a list of files, with the counts, and one commit. The reviewer can compare the list with the Git diff of the merge.

## D2 Which files the command adopts

The command adopts a file when three things are true. The file has a gap, which is a code file with a not-covered count or a test file with untraced tests. The file has other content than the base commit. The merged commit changed the file since its merge base with the base commit.

The third condition uses `git diff` between that merge base and the merged commit. A file that only the fork changed is not in that diff, so the command never adopts it. A gap in the code of the fork stays a gap that cannot open.

A file that both sides changed is in the diff. The merge resolution can add a gap to such a file, and the command adopts it with the rest. The known limit `adopt-hand-merged-files` names this. The rejected option R1 gives the reason.

## D3 What the gate checks in an adopt line

An adopt line has the kind `adopt`. It has the date, the change name, the head commit, the file and the commit `from`. It also has the three not-covered counts, the count of untraced tests and the mark for untrue coverage.

The gate reads the lines of the checked change after the base history, as it does for a waiver. A line is valid when its counts are whole numbers of 0 or more, or `null` for a metric that the entry does not have. It must also have a commit and a file that the merge brought.

- The commit must be a parent, other than the first parent, of a merge commit between the base and HEAD. The gate finds these merge commits with Git. If not, the gate stops with `LEDGER-ADOPT-FROM`.
- The file must differ between the commit and the merge base of the commit and the base. If not, the gate stops with `LEDGER-ADOPT-FILE`.
- A line with the wrong kind, the wrong change name or a wrong count gives no error. It gives no adopted count, and the old errors then show the gap.

The checks of the commit and the file are the only checks that a person cannot pass by a text edit. A person can still make a merge commit of their own and adopt from it. The known limit `adopt-by-hand` names this, and the reviewer reads the lines.

## D4 The adopted count and how the gate uses it

The adopted count of a metric for a file is the largest count of that metric in its valid lines. It is a ceiling. `compareWithBase` allows the count of an entry up to the larger of two values. One value is the base count plus the waived count. The other value is the adopted count.

`compareLedger` does not change. The command writes the entry from the same measurement as the gate, so the entry equals the current gap. The ceiling protects the entry against a later edit of the ledger by hand.

A file that has no entry in the base ledger has a base count of 0. The gate allows its entry when each count is at or below the adopted count. The gate applies these rules only to a file with other content than the base commit.

## D5 Untraced tests

The ledger keeps a count for each test name. An adopt line cannot keep them, because the merge brings about 5000 untraced tests. The line has one number for the file: the number of untraced tests in its entry.

`compareWithBase` sums the tests of the entry that the base entry does not have. It counts a name with a higher count than in the base entry for the difference. It allows the sum when it is at or below the adopted count. If the sum is above it, the gate keeps the old error for each of these names.

## D6 Untrue coverage

A file has untrue coverage when a test runs its code with a source that is not the file. The four merged files `src/app/layers/traffic.js`, `src/data/cameraSensitivity.js`, `src/sources/overpassRoads.js` and `src/sources/sourceSlot.js` are in this case. The ledger already has 25 such entries, all pre-spec.

The gate stops for a new entry with untrue coverage (`gap-ledger-032`). The adopt line records the mark, and a valid line with the mark makes that stop go away for its file. The file stays not loaded in the ledger, so no count can improve until a later change loads it with its true source.

## D7 The order of the steps

The steps of `upstream-sync` are:
1. Merge the upstream branch and resolve the conflicts.
2. Run `make adopt` with `CHANGE=upstream-sync` and `FROM` set to the merged commit.
3. Run the `waive` command for each file that the adopt command did not cover, if any.
4. Run `make ratchet CHANGE=upstream-sync`.
5. Run `make gates CHANGE=upstream-sync`.

The command `adopt` runs the tests once. The ratchet command runs them again and writes the registry and the links. The two runs together take about 30 minutes, and the merge needs them only once.

## Options that this change rejects

- R1 Adopt a file only when its content is equal to the merged commit. This is stricter. It leaves 16 files that the merge resolved by hand. For 8 of these files the gate needs untraced names, which no waiver can give. The stricter rule does not help, so the change takes the wider rule and names the limit.
- R2 Give each adopt line the names of the untraced tests. The history file grows by about 300 kilobytes for the merge, and a reviewer cannot read it. A count is enough, because the gate then still stops for a count above it.
- R3 Change `init` so that it runs again for a merge. The command `init` stops when the base has a ledger, and that rule protects the ledger from a rewrite. A rewrite has no bound at all.
- R4 Add the adopted lines to the base ledger in memory, and leave `compareWithBase` as it is. This is less code. It cannot hold a count of untraced tests without the names, and it hides the rule in a place that the scenarios do not name.
- R5 Add a waiver metric for untraced tests. The rule "a test without a scenario ID is a gap that cannot open" then has a general exception. The adopted exception has a commit and a file list, so it is narrower.

## How the gates measure the requirement

The trace gate needs a changed test for each of the four scenario bodies that change: `gap-ledger-021`, `gap-ledger-022`, `gap-ledger-032` and `gap-ledger-040`. The requirement text of "Comparison with the base commit" stays the same, so the other ten carried scenarios keep their tests and their text.

Each new scenario has a test with the tag of its ID. `scripts/spec/lib/ledger.mjs` and `scripts/spec/lib/git.mjs` stay at 100% lines, branches and functions. `scripts/spec/gates.mjs` keeps its one phantom branch that the ledger records. The new fault check of the command uses one array and one `find` call, so that it adds no phantom branch.

## Files that the change adds or changes

- `scripts/spec/lib/ledger.mjs`: `adoptsOf`, `checkAdopts`, `adoptedCounts`, `adoptLedger` and the adopted count in `compareWithBase`.
- `scripts/spec/lib/git.mjs`: `resolveCommit`, `mergeParents` and `changedByCommit`.
- `scripts/spec/gates.mjs`: the command `adopt`, the option `--from` and the check of the adopt lines.
- `Makefile`: the target `adopt`.
- `src/tooling/spec/ledger.test.mjs`, `src/tooling/spec/gates.test.mjs`, `src/tooling/spec/git.test.mjs` and `src/tooling/spec/ciFiles.test.mjs`: the tests.
