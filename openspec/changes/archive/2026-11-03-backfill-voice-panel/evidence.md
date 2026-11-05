# The host evidence

Source commit: `74ec10e054a88935c7fcfce96300ea660f7c7747`.
Branch: `backfill-voice-panel`.
This report includes the review corrections in the worktree.
Runtime: `v26.13.0`.
The baseline data names the earlier source commit.

## The tests and scenarios

The scope suite passes: 405 tests, 0 failures and 0 skipped tests.
The [scenario map](test-links.json) records 72 scenarios.
The [test audit](test-audit.json) records 383 tagged tests.
The change tags 54 of 76 old tests and adds 329 tests.
The 22 old tests in [the title data](old-untagged.json) keep their names without tags.
The title audit finds no duplicate name, invalid tag, banned word or absent assertion method.

These commands supply the test and title results.
The [test events](tests.jsonl) contain the final runtime titles and summary.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit src/voice/panel/*.test.mjs
cd /home/ianblenke/docker/gev-work/voicepanel && node /home/ianblenke/docker/gev-tools/voicepanel/test-audit.mjs
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/review-recount.py
```

The recount command reads the runtime events, spec headings, mutation events and coverage output.
It counts old tests from the six old test files.
The baseline names those files.

## The host coverage

The [command list](coverage-commands.txt) gives each exact invocation.
The [coverage output](coverage.txt) gives each completed report.
The host reaches 100% of lines, branches and functions in all seven files.
No line, branch or function needs an unreachable exception.
The host result gives no calibrated gate verdict.

| File | Lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| src/voice/panel/actionObserver.js | 100.00% | 100.00% | 100.00% |
| src/voice/panel/host.js | 100.00% | 100.00% | 100.00% |
| src/voice/panel/inactivity.js | 100.00% | 100.00% | 100.00% |
| src/voice/panel/manualPanel.js | 100.00% | 100.00% | 100.00% |
| src/voice/panel/nativeActivity.js | 100.00% | 100.00% | 100.00% |
| src/voice/panel/preferences.js | 100.00% | 100.00% | 100.00% |
| src/voice/panel/testDom.mjs | 100.00% | 100.00% | 100.00% |

The coverage command script checks one source file at a time.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/review-coverage.py
```

## The mutation evidence

The [mutation specification](mutations.json) defines 566 unique cases.
The tests kill 554 cases.
The other 12 cases keep their public API result.
The [audit](audit.md) gives their reasons and source checks.
The audit contains 227 rows: 226 tested, 1 equivalent, 0 default-value and 0 open.

The case sources are 426 decision cases, 76 key cases, 26 scenario cases and 38 review cases.
The recount command supplies all these totals.
The [failure events](mutation-events.jsonl) supply complete test names.
The [result records](mutation-results.json) use those events directly.
The [commands](mutation-commands.json) give each test command and name filter.
The result check finds 0 invalid failure links and 0 failure-event mismatches.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/rebuild-review-records.py
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/review-recount.py
```

The initial single-case probe stops at a summary field error.
It gives no stored verdict.
The later complete case replaces that attempt.

The first segment stops after 463 completed cases because the scratch reporter cannot serialize a circular DOM value.
That interrupted case gives no verdict.
The corrected reporter uses reference markers for object cycles.
The next segment repeats affected cases and continues from the interrupted case.
The final selected checks complete the evidence.
No final case needs a timeout verdict.

The [command output](mutation-run.txt) records the segments and final checks.

## The review corrections

The [correction report](review-corrections.md) lists each finding, source line and test witness.
It also lists each scenario sentence, test name and tag that changes.
The [shape sweep](weak-shape-sweep.json) records the static assertion scan.
The scan finds no test that checks only counts or key names.
It finds no assertion with identical operands.
Manual checks also cover defaults, property sources, guards, absence checks, item loops and start states.

## The known limits

The [design](design.md) names each known limit.
The [probe output](known-limits.txt) includes both card callbacks that select a view during panel teardown.
Those callbacks leave the panel and selected pane visible, although the disposed snapshot reports false presentation flags.
Scenario `voice-panel-017` excludes that case.
No scenario states that this behavior is mandatory.
Production code keeps that behavior.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit /home/ianblenke/docker/gev-tools/voicepanel/known-limits.test.mjs
```

## The format and STE checks

The scoped formatter checks the panel tests.
The broad read-only formatter checks the repository format scope.
The [format and STE output](format-and-ste.txt) records the final commands and results.
The STE lint command reports no ERROR line.
The title audit checks tagged titles against the project word list.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && node ../node_modules/prettier/bin/prettier.cjs --write src/voice/panel/*.test.mjs
cd /home/ianblenke/docker/gev-work/voicepanel && node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/voicepanel && node scripts/spec/gates.mjs lint 2>&1 | grep -E "^ERROR"
```

## The scope

Production files, the DOM helper, QA scripts and trace files match commit `74ec10e054a88935c7fcfce96300ea660f7c7747`.
The live spec and archive copy contain identical bytes.
The live Purpose text keeps its bytes from that commit.
The [scope data](scope-check.json) records the final path check.
No command makes a commit, pushes a branch or uses make or Docker.
The lead must run a new ratchet because the scenarios and test names change.

The lead also owns the calibrated gates and both review verdicts.
