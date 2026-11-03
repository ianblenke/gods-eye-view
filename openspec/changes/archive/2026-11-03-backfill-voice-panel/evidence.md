# Host evidence

Source commit: `89fe216472d408b6ac9a0d9b53f65ef20434d917`.
Branch: `backfill-voice-panel`.
Runtime: `v26.13.0`.

This report records the host snapshot before the lead runs the ratchet and formal reviews.
The host checks do not give a calibrated gate verdict.

## Scenarios and tests

The [scenario map](test-links.json) records each ID, title and test.
The [test audit](test-audit.json) records every runtime title and assertion check.

The scope tests pass: 398 passed, 0 failed and 0 skipped.
The delta adds 70 scenarios.
The source ledger records 76 old tests.
This change tags 54 old tests and adds 322 tests.
The 22 old tests below keep their original titles without tags.
The runtime title check finds no duplicate name, banned word, excess tag or absent assertion method in traced tests.

The measurement and title commands supply these counts.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit --test-reporter=/home/ianblenke/docker/gev-tools/voicepanel/reporter.mjs src/voice/panel/*.test.mjs > /home/ianblenke/docker/gev-tools/voicepanel/tests.jsonl 2> /home/ianblenke/docker/gev-tools/voicepanel/test-stderr.txt
cd /home/ianblenke/docker/gev-work/voicepanel && node /home/ianblenke/docker/gev-tools/voicepanel/test-audit.mjs
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/measure.py
```

The command output in `tests.jsonl` supplies the runtime records.
The title audit uses that output.
The test links point to the source lines at this snapshot.

## Host coverage

The command list in [coverage commands](coverage-commands.txt) gives each exact invocation.
The [coverage output](coverage.txt) contains each command and its completed report.
Each invocation includes one source file and excludes test files from the coverage table.

| File                              |   Lines | Branches | Functions |
| --------------------------------- | ------: | -------: | --------: |
| src/voice/panel/actionObserver.js | 100.00% |  100.00% |   100.00% |
| src/voice/panel/host.js           | 100.00% |  100.00% |   100.00% |
| src/voice/panel/inactivity.js     | 100.00% |  100.00% |   100.00% |
| src/voice/panel/manualPanel.js    | 100.00% |  100.00% |   100.00% |
| src/voice/panel/nativeActivity.js | 100.00% |  100.00% |   100.00% |
| src/voice/panel/preferences.js    | 100.00% |  100.00% |   100.00% |
| src/voice/panel/testDom.mjs       | 100.00% |  100.00% |   100.00% |

Every scope file reaches full host coverage.
No line, branch or function needs an unreachable exception.
The helper keeps its source bytes.
The tests exercise its elements, listeners, parser, class lists and clock.
The raw V8 reports contain no zero-count range for the scope modules.
The calibrated runtime can give different coverage totals.

The measurement command supplies the table.

## Old titles without tags

The word list rejects these titles.
The owner forbids a title change.
The [old test data](old-untagged.json) records their source lines.

src/voice/panel/actionObserver.test.mjs

```text
native Promise identity, fulfillment object and rejection object are preserved
omitted and explicit undefined options keep original arity and values
progress preserves public-before-original-before-private order, receiver and option references
reentrant start retirement retains only fresh ownership and never skips execution
```

src/voice/panel/host.test.mjs

```text
explicit successful mic Stop closes; failed Stop idle and startup error do not
native connecting phases retain output observation; idle starts before first speech and waits for drain
voice timeout change preserves a pending voice reveal
```

src/voice/panel/inactivity.test.mjs

```text
None cancels; invalid values cannot replace setting; explicit retry rearms
```

src/voice/panel/manualPanel.test.mjs

```text
tab keyboard navigation and Escape preserve focus and accessibility state
```

src/voice/panel/nativeActivity.test.mjs

```text
actual Gemini startup phases keep playback observation and permit quiet open-mic expiry
actual OpenAI failed-response error/listening recovery preserves only proven no-audio knowledge
explicit silent OpenAI completion rearms expiry, including cancelled and failed responses
native typed input observation preserves receiver/result, refuses failed submissions and retires old wrapper
options-method callback receiver maps to original options, explicit receiver is preserved
reentrant Stop in original callback suppresses stale post-callback observation; teardown preserves newer replacement
verified clean native mount can arm initial idle, eventless response invalidates it
```

src/voice/panel/preferences.test.mjs

```text
fractional, malformed, coercible and out-of-range inputs never write or notify
storage mismatch preserves live value and exposes unsaved state across A → B
storage missing preserves live value and exposes unsaved state across A → B
storage noop preserves live value and exposes unsaved state across A → B
storage readthrow preserves live value and exposes unsaved state across A → B
storage throw preserves live value and exposes unsaved state across A → B
```

## Mutation checks

The [mutation data](mutation-results.json) records each ID, exact edit and failed test.
The [mutation specification](mutations.json) holds the tool input.
The [audit](audit.md) gives the decision table and the equivalent proofs.

The tool checks 528 unique mutations.
Tests kill 516 mutations.
The other 12 mutations keep the same result through the public API.
Each equivalent proof names the source check and custom fake that establish that result.
The audit records 227 rows: 226 tested, 1 equivalent, 0 default-value and 0 open.

The measurement and document commands supply these counts.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && NODE_OPTIONS=--test-isolation=none PYTHONUNBUFFERED=1 python3 /home/ianblenke/docker/gev-tools/mut-host.py /home/ianblenke/docker/gev-work/voicepanel /home/ianblenke/docker/gev-tools/voicepanel/muts.json
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/measure.py
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/write-docs.py
```

The [completed output](mutation-run.txt) records the full pass and the later selected checks.
The [command data](mutation-commands.json) records each exact selection.
The full pass used an earlier mutation set.
Later checks complete the final set.

The final data uses the last completed result for each ID.
The early broad passes stopped before completion and give no complete result.
One probe rejected a timeout option before it started tests.
The final data excludes those attempts.
The completed checks contain no timeout result.

The key checks remove each input method, audio callback, audio method, control listener, work field and inactivity blocker separately.
Each such check selects its own case by title.
The callback tests use distinct arguments and return values.

The input owner tests use different held flags.
The state tests use visible cards outside the panel to distinguish parent visibility from each direct guard.
Custom source getters distinguish the zero branch from cached text.
Custom audio factories distinguish dead observers, retired versions and reused audio objects.

The mutations also test the control markup, card timer and action dependencies that the old host tests call.
The tool restores those files after each check.

## Purpose and imports

The baseline ledger matches the source commit.
The measurement command scans all repository tests for direct and dynamic relative imports of each scope module.
It finds caller tests outside the panel directory.
This change keeps their names and bytes unchanged.

The literal path search returns no match because those callers use relative imports.
The resolved import data in [measurements](measurement.json) records the actual callers.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && grep -rln 'voice/panel' --include='*.test.mjs' .
cd /home/ianblenke/docker/gev-work/voicepanel && python3 /home/ianblenke/docker/gev-tools/voicepanel/measure.py
cd /home/ianblenke/docker/gev-work/voicepanel && git log --oneline -- src/voice/panel
```

The purpose follows the voice panel text in `docs/CURRENT-STATE.md`.
The [QA headers](qa-headers.json) record the separate checks for auth, microphone input, tool choice and action choice.
This change tests local panel state and native activity evidence.
It does not test browser geometry, live audio, credentials or auth focus.
We did not run the QA scripts or read QA lines from a full gate.

## Decisions for the lead

The [design](design.md) names each neutral known limit.
The [probe output](known-limits.txt) records the host teardown, custom source, untracked delta, symbol accessor and method origin results.
No scenario states that those behaviors are mandatory.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && NODE_OPTIONS=--test-isolation=none node --test --test-force-exit /home/ianblenke/docker/gev-tools/voicepanel/known-limits.test.mjs
```

## Format and STE

The first broad format write stops at `spawnSync git EPERM`.
Automatic approval review rejects the later broad writes because they can change production files.
The narrow formatter changes only the scope tests.
The broad read-only check passes for 1673 source files.
The scoped format and STE logs record the final checks.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && node scripts/format.mjs --write
cd /home/ianblenke/docker/gev-work/voicepanel && node ../node_modules/prettier/bin/prettier.cjs --write src/voice/panel/*.test.mjs openspec/changes/backfill-voice-panel/*.md openspec/changes/backfill-voice-panel/specs/voice-panel/spec.md
cd /home/ianblenke/docker/gev-work/voicepanel && node scripts/format.mjs --check
cd /home/ianblenke/docker/gev-work/voicepanel && node ../node_modules/prettier/bin/prettier.cjs --check src/voice/panel/*.test.mjs openspec/changes/backfill-voice-panel/*.md openspec/changes/backfill-voice-panel/specs/voice-panel/spec.md
cd /home/ianblenke/docker/gev-work/voicepanel && node scripts/spec/gates.mjs lint --change backfill-voice-panel 2>&1 | grep -E '^(ERROR|STE)'
```

## Scope snapshot

At this host snapshot, production files, the helper, QA scripts and trace files match the source commit.
Only panel tests and files under this change folder differ.
The [status output](status.txt) records the file list.
No command made a commit, pushed a branch or ran Docker, make, ratchet or full gates.
The final tasks for those gates and reviews remain unchecked.

```bash
cd /home/ianblenke/docker/gev-work/voicepanel && git diff --name-only HEAD
cd /home/ianblenke/docker/gev-work/voicepanel && git diff --name-only HEAD -- src/voice/panel/*.js src/voice/panel/testDom.mjs src/voice/control.js src/voice/gevActions.js scripts/qa-*.mjs openspec/trace/
cd /home/ianblenke/docker/gev-work/voicepanel && git status --short
```
