## Context

The gates measured `credential-boundary` on 2026-09-20. The base entry of `src/voice/gevActions.js` records 798 branches with 221 not covered. The branch measures 846 branches with 221 not covered, with two offset tests. Without the two tests, the count is 223. The change added 48 branches, and the report counts 47 of them as covered. The branch at line 2974 executes, and the report counts it as not covered.

`toleranceOf(846)` is 8. `hasTolerance` needs `sameAsBase(file)`, and the change edits the file, so the file gets 0. `compareCoverageEntry` then compares 223 with 221 and gives `LEDGER-LARGER-GAP`. The ratchet command stops on that error. With the two offset tests, `compareWithBase` gives `LEDGER-NOT-IN-BASE` for the two untraced names. Neither rule has a condition that a changed file can meet.

## Changed files

- `scripts/spec/lib/ledger.mjs`: the waived count in `compareCoverageEntry`, `compareLedger`, `compareWithBase` and `ratchetLedger`, and the function `waiversOf`. Also the waived count for a file with no entry, in `compareLedger`, `ratchetLedger` and `compareWithBase`.
- `scripts/spec/gates.mjs`: the command `waive`, its options, and the waivers that the `check` and `ratchet` commands read. The seven fault conditions of the command become one array and one `find` call.
- `src/tooling/spec/ledger.test.mjs`: the tests of `gap-ledger-081` to `gap-ledger-087` and the changed tests of the eight changed scenarios.
- `src/tooling/spec/gates.test.mjs`: the tests of `gap-ledger-079` and `gap-ledger-080`.
- `src/tooling/spec/testGuard.test.mjs`: the names of the two new guarded tests in the list of the tests that need the guard.
- `openspec/specs/gap-ledger/spec.md`: the eight changed scenarios, and the requirement "Coverage waiver" with its nine scenarios.

## Goals / Non-Goals

**Goals:**
- Give a person one recorded, exact and visible way to allow a not-covered count that the coverage report gets wrong.
- Keep each automatic rule as strict as it is now. A changed file gets no tolerance.
- Keep the ledger closed to a new untraced name.
- A file the change edits stays at 100%, so it needs no new entry. Where that is not possible for the change's own new code, a waiver adds one entry, not a silent gap. See D10.

**Non-Goals:**
- Do not give the tolerance to a changed file.
- Do not change `parseLcov`, `toleranceOf`, the loss rule or the rules for untraced names.
- Do not change product code so that the report counts a branch. The project records that rule.
- Do not write the waiver of `credential-boundary` in this change.

## Decisions

### D1. No automatic rule can separate a wrong count from a lost branch

The gate has one instrument, the lcov report. That report says that the branch at line 2974 is not covered. Each automatic rule reads the same report. So no rule in the gate can find that the report is wrong.

The only evidence is outside the gate: a marker that a person adds, runs and removes. So the honest answer is a decision that a person records. The gate makes that decision exact, bound and visible, and it does not make the decision.

### D2. Rejected: the tolerance for a changed file

`hasTolerance` needs the base content because the tolerance is for a count that moves with no change of the file. A changed file with a tolerance of 8 can lose 8 covered branches, and the gate says nothing. The scenario `gap-ledger-074` exists to stop that. This option is the one that the facts of the deadlock reject first, and the design agrees.

### D3. Rejected: compare the not-covered line sets and allow the lines outside the diff

This option has three faults.

The first fault is that it does not remove the stop. The wrong count is at line 2974, inside the diff. A set rule reports that line as a new not-covered branch, because that is what the report says. The rule cannot tell a wrong count from a not-covered branch, so `credential-boundary` still stops.

The second fault is the cost. The ledger records counts, and `parseLcov` keeps only counts. A set rule needs the line of each not-covered item in the ledger, for each file. `src/voice/gevActions.js` alone has 1228 not-covered lines and 221 not-covered branches. V8 numbers the branch arms in a different way in each run, which the known limit `banked-branch-count` records. A diff moves each line number, so the rule must map the base lines through the diff hunks.

The third point is not a fault. A set rule is a good later change for another reason: it closes the known limit `count-offset`. It makes the gate stricter, and it is not this fix.

### D4. Rejected: evidence in the gate that the line executes

The gate cannot see the marker that showed the execution. The design found three ways to give the gate such evidence, and each fails.

A marker that stays in the product code is a change of the code for the instrument. The project forbids that. A second coverage instrument, such as an Istanbul build, can disagree with V8 and show the wrong count. That is a second pipeline with its own wrong counts, and no test can pin it with synthetic ledgers against `compareLedger`. The hit count of the line in the report is above 0 for each untaken arm on an executed line, so it separates nothing.

So the evidence stays with the person. The reason of the waiver is the place for it.

### D5. The waiver and its four bounds

A waiver is one line in `openspec/trace/history.jsonl`:

```json
{"date":"2026-09-21","change":"credential-boundary","commit":"<sha>","kind":"waiver","file":"src/voice/gevActions.js","metric":"branches","sha":"<content hash>","lines":[2974],"count":2,"reason":"The catch at line 2974 executes. A marker printed two times from two throw sites. lcov reports 0 hits."}
```

Four bounds keep a waiver from a silent loss:

1. The count is exact. It is not a tolerance. A not-covered count of the entry plus the waived count plus one stops the build.
2. The content hash binds the waiver to one content. A waiver for content X gives nothing to content Y. When the author edits the file after the waiver, the waived count is 0 again. The author measures again and writes a new waiver.
3. The change name binds the waiver to one change. `compareWithBase` reads only the history lines after the base from the checked change. This is the rule of the `totals` lines in `gap-ledger-056`. After the merge, the line is in the base history, and it gives nothing to a later change.
4. A waiver is for a changed file only. A file with the base content gets a waived count of 0 in the two comparisons, and the waive command refuses such a file.

The waiver is visible. The waiver line and the `waived` history line are in the diff of the change. Each error message names the waived count when it is above 0.

What stays open is inside the count. A wrong waiver can hide a real loss of at most its count. That is an error of the person, in a record that the reviewer reads, and it is not a silent loss. The known limit `waiver-lines-not-checked` records the check that a later change can add.

### D6. The waiver is a history line, not a ledger field

The history file is append-only, and `gap-ledger-025` stops the build when it does not start with the base content. `compareWithBase` already reads the lines of the checked change for the `totals` rule. A waiver is an event, and a ledger entry is a state. After the ratchet command, the entry records the measured count, and the history records the reason for the rise. So `openspec/trace/gaps.json` gets no new field, and the version stays 4.

`ledger.mjs` exports `waiversOf(history, baseHistory, change)`. It returns the lines after the base with the kind `waiver` and the change name. `compareLedger` and `ratchetLedger` get a `waivers` input. `compareWithBase` reads the waivers from its own history inputs. `gates.mjs` calls `waiversOf` one time and passes the result to the check and to the ratchet command. A check without a change name has no waivers, and that is the rule of the `totals` lines too.

### D7. The command `waive`

The command line is:

```
node scripts/spec/gates.mjs waive --change <name> --file <path> --metric <lines|branches|functions> --lines <n,n> --count <n> --reason <text>
```

`parseArgs` reads pairs of an option and a value, so the five new options fit its loop. The command runs after the base resolves and before the Node version check, next to the `tree` command, because it runs no test. It reads the content hash of the file with `contentHash`, the commit with `headCommit` and the date from `now`.

The command stops with the error `GATES-WAIVE` for each fault of `gap-ledger-080`. When the options are good, it appends the line with `appendHistory` and logs one line. The command gets no make target in this change, because `ci-gates-007` names the make targets. The known limit `no-make-target` records that.

### D8. Defect 2: the untraced loop is correct without an `unchanged` exception

The facts of the deadlock note that the coverage loop of `compareWithBase` has an `unchanged` exception and the untraced loop has none. The design read both loops, and the omission is correct.

`unchanged` is the condition of `LEDGER-MORE-THAN-BASE`, not of `LEDGER-NOT-IN-BASE`. It lets the not-covered count of an unchanged file rise when the covered count does not fall, because V8 moves the total. Before this change, the `LEDGER-NOT-IN-BASE` error for a coverage entry had no `unchanged` exception either. D10 lets a waiver allow a coverage entry that the base does not have (`gap-ledger-087`), but never for a file with the base content. The rule for untraced names has no condition.

For a test file, `unchanged` means that the file has the base content. Its untraced names are then the base names. A name in the ledger and not in the base ledger, for such a file, is a hand edit of the ledger.

The gate test of `gap-ledger-021` has this shape. It adds the name "a hidden test" to the ledger, on a branch with the base test file. An `unchanged` exception can let only that case pass. So the omission is correct, and this change keeps it.

The ratchet command cannot add a name. `ratchetLedger` adds no name, and the ledger gets names only from the init command. `AGENTS.md` says that a test without a scenario ID is a gap, and that a gap cannot open. A new untraced name is a gap that opens.

The author writes the tag, and no instrument can make the tag wrong. An untraced name has no trace because the name has no scenario ID. There is no wrong count to waive, so a waiver for a name has no reason to exist. This change adds no such waiver.

`credential-boundary` has two exits after this change merges:

1. Delete the two offset tests and the two names that the commit `8b89c92` recorded. Run the gates to measure the not-covered branch count of the file. Run `waive` for the file with the metric `branches`, the line 2974, the measured rise and the reason with the marker evidence. Run the ratchet command, then the gates.
2. Keep the two tests. Write a capability for the voice layer visibility, with scenarios that the two tests trace. That is a backfill of old code, and it can be its own change.

The first exit is smaller. The design recommends it.

### D9. One change

Defect 2 needs no code. The waiver is one new requirement and eight changed scenario bodies. A split would give one change with no code, so this is one change.

### D10. A waiver for a file with no ledger entry

The gates of this change have the exact defect they fix, in their own new code. `scripts/spec/gates.mjs`'s `waive` command first had seven fault conditions, each with an early return. Each return executed. A marker before each return proved it, and `gap-ledger-080` causes each of the seven faults and checks its exact message.

lcov reported 0 hits for each. The team put the seven `if` blocks into one array and one `find` call. That closed six of the seven. The last one is the same defect, one line, in `gates.mjs`, a file the change edits.

`compareCoverageEntry`'s waiver applies only inside a ledger entry the file already has. This file had none: it was at 100% before this change edited it. So `LEDGER-NEW-COVERAGE-GAP` stops the build first, and no waiver reaches that path. More tests cannot close a defect in how the gate counts. So the choice is a waiver here too, or a change with a real gap in its own coverage.

The function `waiversCover` gives the rule for a file with no entry to compare with. It is true only when four conditions are true. A test loads the file, and the file does not have the base content. One or more waivers name the file and its content hash. The not-covered count of each metric is at or below the sum of the waivers for that metric. A file with the base content gets no waived count here, the same as on the path of an entry.

`compareLedger` uses `waiversCover` for a file in `current.coverage` with no entry. When it is true, the gate does not stop the build with `LEDGER-NEW-COVERAGE-GAP`. But the gate marks the file as not current, so `LEDGER-STALE` stops the build until the ratchet command adds the entry. Without that mark, a change can pass the gates with no ratchet run. The `check` command on `main` has no waivers, so it then stops each later change.

`ratchetLedger` gets a second loop, after the loop over the entries of the ledger. The `compareLedger` call at its start stops each file with no entry that `waiversCover` does not allow. So the second loop adds an entry for each other file with no entry. It writes the measured counts, the content hash, and the change name as the origin. It adds one history line for each not-covered metric, with the reason `waived`.

The scenario `gap-ledger-086` covers this. The second loop first had two guards, `if (!gapped) continue` and a condition for a loaded code file. `currentGaps` already drops a file with no not-covered count, and `compareLedger` already stops an unloaded file with no entry. So both guards were dead code, not phantom branches, and the fix removes them. `ledger.mjs` needs no waiver of its own.

A first version of this design stopped here. A real `make gates` run on the new entry for `gates.mjs` found a rule that this version did not examine. `compareWithBase` has its own rule for a ledger entry the base does not have. It stopped the build with `LEDGER-NOT-IN-BASE`, with no condition, because until now the ledger got no new entry outside the init command. The entry that `gap-ledger-086` adds is such an entry.

`compareWithBase` now uses `waiversCover` for an entry that the base ledger does not have, with the waivers of the checked change. The scenario `gap-ledger-087` covers this. The rule for untraced names has no condition (`gap-ledger-021`).

## What `fix-covered-count` fixed, and how this change differs

`fix-covered-count` shipped on 2026-09-17. It is for a file that no change edits. V8 measured the branch total of `src/search/placeSearch.js` as 23 in one run and 22 in another, with the same 3 branches not covered. The covered count fell with the total, and the gate read the fall as a lost branch.

The fix compares the loss, which is the smaller of the not-covered rise and the covered fall, with the tolerance. It added `gap-ledger-078` and changed the loss rule in `gap-ledger-054`, `gap-ledger-070` and `gap-ledger-072`. All of that is on the unchanged path of `compareCoverageEntry`.

This change is for a file that the change edits. That file takes the changed path, where the loss rule does not run and the tolerance is 0 by design. The report gives a wrong not-covered count, not a moved total. No arithmetic on the two counts can find it, because both counts agree with the report. So this change adds a recorded decision and its bounds. It does not touch `lossOf`, the tolerance, or any scenario that `fix-covered-count` changed.

## How the gates measure the requirement

The requirement texts of "Ratchet rule", "Comparison with the base commit" and "Ratchet command" stay the same as the live spec. Only eight scenario bodies change, so the trace gate needs a changed test for each of the eight and for no other carried scenario.

`compareCoverageEntry` gets a `waived` function next to `tolerance`. For a changed file, `waived(metric)` sums the counts of the waivers for that file, that metric and the current hash. For other files it is 0. The comparisons become:

```js
// The line comparison, for each file.
gap.lines > entry.lines + tolerance('lines') + waived('lines')
// The branch and function comparison, for a changed file.
gap[metric] > entry[metric] + waived(metric)
```

The message of `LEDGER-LARGER-GAP` keeps its text and gets one more sentence when the waived count N is above 0: "A waiver allows N more."

`compareWithBase` gets `waived(metric)` for each entry. It is 0 for an unchanged file. For a changed file it sums the counts of the waivers of the checked change for that file, that metric and the entry hash. The comparisons become:

```js
// The line comparison, for each file.
entry.lines > base.lines + waived('lines')
// The branch and function comparison, for a changed file.
entry[metric] > base[metric] + waived(metric)
```

The two messages get the same sentence about the waiver when N is above 0.

`ratchetLedger` passes its `waivers` to `compareLedger`. The reason of a history line for a rise becomes `waived` when the file has another hash than its entry. It stays `shown by test` for an unchanged file.

Each rule has a mutation that must make a test fail. `review.md` records the run of each one.

- The line rule of `compareCoverageEntry`: remove `+ waivedLines`. The test of `gap-ledger-085` fails.
- The branch rule of `compareCoverageEntry`: remove `+ waivedMetric`. The tests of `gap-ledger-081` and `gap-ledger-085` fail.
- The waived count of `compareLedger`: make it a constant 8. The tests of `gap-ledger-004`, `gap-ledger-013`, `gap-ledger-017` and `gap-ledger-082` fail, with others.
- `gap-ledger-082`: remove the `sha` condition, then the `changed` condition, from the waived count of `compareLedger`. The test fails for each.
- The waived count of `compareWithBase`: make it 0. The tests of `gap-ledger-022`, `gap-ledger-040`, `gap-ledger-048` and `gap-ledger-083` fail. Make it a constant 8. The tests of `gap-ledger-022`, `gap-ledger-040` and `gap-ledger-084` fail.
- `gap-ledger-083`: remove `+ waivedLines` from the line rule of `compareWithBase`. The test fails.
- `gap-ledger-084`: remove the `entry.sha` condition, the change name filter of `waiversOf`, the `slice(baseHistory.length)` of `waiversOf`, or the `unchanged` condition. The test fails for each.
- `gap-ledger-084`: remove `Number.isInteger(line.count)`, `line.count > 0`, the `!change` guard or the base prefix guard of `waiversOf`. The test fails for each.
- `gap-ledger-084`: remove the loaded condition of `compareWithBase`. The test fails.
- `gap-ledger-082`: remove `!entry.loaded`, then `!gap.loaded`, from the waived count of `compareLedger`. The test fails for each.
- `gap-ledger-085`: do not pass the waivers to `compareLedger` in `ratchetLedger`, or write the reason `shown by test` for a changed file or for a line rise. The test fails for each.
- `gap-ledger-086`: do not mark a file with no entry as not current, or add a history line only for the branches. The test fails for each.
- `waiversCover`: remove the condition for the base content. The tests of `gap-ledger-003`, `gap-ledger-086` and `gap-ledger-087` fail. Remove the loaded condition, the file filter, the hash filter, or the metric filter. The tests of `gap-ledger-086` and `gap-ledger-087` fail for each. Remove the condition for one or more waivers. The test of `gap-ledger-087` fails.
- `gap-ledger-087` and `gap-ledger-021`: replace the call of `waiversCover` in `compareWithBase` with `false`. The two tests fail.
- `gap-ledger-079`: remove the `reason` field from the waiver line, or append the line two times. The gate test fails for each.
- `gap-ledger-079`: write the base commit in place of the head commit. The gate test fails.
- `gap-ledger-080`: remove one entry from the `faults` array. The gate test fails, for each of the seven entries.

The tests of `gap-ledger-081` to `gap-ledger-085` call `compareLedger`, `compareWithBase` and `ratchetLedger` with synthetic ledgers and synthetic waiver lines. The tests of `gap-ledger-079` and `gap-ledger-080` run `runGates` on the fixture of `gates.test.mjs`. Its base commit has a ledger entry for `src/math.js` with one not-covered branch. The work branch adds a second not-covered branch to that file. The ratchet command stops without a waiver, and it passes after the `waive` command with a count of 1. A check with the change name then passes.

## Risks / Trade-offs

A waiver can be wrong. Its bounds keep the loss inside the count, for one content and one change, in a record that the reviewer reads. The known limit `waiver-lines-not-checked` names the check that a later change can add.

The check without a change name gets no waived count. That is the rule of the `totals` lines too, and the CI command finds the change name from the diff.
