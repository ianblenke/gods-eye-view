## Context

GEV uses node:test. `npm test` runs `scripts/run-unit-tests.mjs`, which finds the test files in `src/` only. All 200 test files are in `src/`. The tests for scripts are also in `src/`, for example `src/setupDoctor.test.mjs`. Node 24 is the calibrated runtime for two allocation tests.

The baseline run on 2026-09-13 gave these results for the 306 tracked JS files:

| Item | Result |
|---|---|
| Effective line coverage | 54.0% |
| Files at 100% | 44 |
| Files that no test loads | 70 (44,341 lines) |
| Tests with a scenario ID | 0 of 2,920 |

An adversarial review of the first version of this design found 29 problems. The review of the second version found 62 more problems. This version corrects these problems. The section "Known limits and later changes" in the proposal lists the problems that stay open.

## Goals / Non-Goals

**Goals:**
- Make gaps visible and stop new gaps, from the first commit of this change.
- Stop the known ways to hide a gap: changed ledger files, untrue coverage, tags on tests that test nothing and old reviews.
- Record the change that closes each gap.
- Add only one package to the gates: the OpenSpec CLI at the pinned version `1.3.1`. The other gate code uses Node built-in modules and Git only.

**Non-Goals:**
- Close the old gaps. Backfill changes do this later, one capability at a time.
- Measure the coverage of code that runs only in a browser.
- Supply the ASD-STE100 dictionary. The dictionary has its own terms of use. The STE adversary does the dictionary check.

## Decisions

### Pinned runtime

The file `.node-version` contains `24.21.0`. The Docker image uses `node:24.21.0-bookworm-slim` and installs Git. The gates stop on each other Node version, because V8 versions give different coverage counts. `make gates` runs the gates in the image.

### Test runs

`scripts/spec/gates.mjs` runs node:test one time for all test files except the allocation test files. The run uses three reporters: `dot`, `lcov` and the trace reporter. Each allocation test file runs in its own process with `--expose-gc` and the trace reporter. `scripts/spec/lib/run-parallel.mjs` starts all runs at the same time. One allocation test runs for 8 minutes, so a full gate run also runs for about 8 minutes.

The gate starts each run with a new environment. It removes `NODE_OPTIONS`, `NODE_V8_COVERAGE` and `NODE_TEST_CONTEXT`. It then sets `NODE_OPTIONS` to `--require` with the test guard, and `GEV_SPEC_INVENTORY` to the hash of `inventory.json`.

The reporters write to a new folder in the temporary folder of the system. The gate reads only the result files that it named, and it stops for each other file in that folder.

A test process can find this folder and write to a named result file. Thus the trace gate also stops for an entry with tags or a full name that do not agree with its name. It also stops for two tests with a tag and the same full name in one file. When a run stops with a status that is not 0, its result file must contain a failed test.

A file that the tests load under two URLs, for example with a query string, has two entries in the lcov report. For each metric, the gate uses the entry with the most not-covered items. Thus the file must reach 100% under each URL, and an entry that a test adds cannot hide a gap.

### Test guard

`scripts/spec/lib/test-guard.mjs` loads into each test process as the first `--require` preload of `NODE_OPTIONS`. Node runs `--require` preloads before `--import` preloads, in order. Experiments on Node 24.21.0 showed five facts:
- `new Function` with a `sourceURL` comment gives 100% coverage to a file that no test imports.
- A `node:inspector` session in the same process gets each `Debugger.scriptParsed` event, and `Debugger.getScriptSource` returns immediately.
- A wrapper on the methods of `node:assert` and `node:assert/strict`, with `syncBuiltinESMExports`, also wraps the methods that a module imports by name.
- In a worker thread, the guard does not check the sources, and an inspector session does not start.
- The node:test runner process has no inspector. With process isolation, it runs no test code.

Before the runs, the gate writes the content hash of each file in the inventory to `.gev-cache/spec/inventory.json`. The guard stops its process when the hash of that file is not the hash in `GEV_SPEC_INVENTORY`. The guard does these tasks:
- It compares the hash of each script that has the URL of a file in the inventory with the hash in `inventory.json`. A difference is an error. The hashes are from the start of the run. Thus a code file that changes during the run cannot hide this.
- It records each file in the inventory that it checked.
- It counts the assertions for each test. It uses `getTestContext()` for the file and the full name of the test.
- It adds itself as the first preload to the `NODE_OPTIONS` of a child process that collects coverage.
- It gives the gate values of `GEV_SPEC_OUT`, `GEV_SPEC_ROOT` and `GEV_SPEC_INVENTORY` to a child process that writes coverage to the coverage folder of the test process. A child process with its own coverage folder keeps the values from the test.

At the end of the process, the guard writes its results to `.gev-cache/spec/guard-<pid>.jsonl`. After the runs, the gate calculates the content hash of each file in the inventory again, and it stops for each file that changed. It also stops when `inventory.json` changed.

A process that collects coverage without an inspector writes an error, and the gate stops for it. The gate does not stop for a node:test runner that runs its tests in child processes. Such a runner gets the `spawn` function before the preloads load, so it does not use the function that the guard wraps. Thus the guard keeps the gate values in the `process.env` of the runner.

A worker thread gets no source check. When the worker thread has the environment of its process, the guard gives the gate values to its child processes. A worker thread with its own `env` or `execArgv` options, and a child process without `NODE_V8_COVERAGE`, get no gate values. The proposal records this as the limit `guard-processes`. The gate gives 0% coverage to a file with coverage that no guard checked. This includes code that only a worker thread loads.

The source check also finds a module hook that loads other source for a code file. A run of the guard on the old tests found one test file that does this. `src/data/trafficTiming.test.mjs` uses the Vite SSR loader, which runs transformed copies of 10 files under their real paths. The gate gives 0% coverage to each file with untrue coverage. The first ledger records these files with `untrue: true` and the origin `pre-spec`.

### Test names contain the scenario IDs

The trace reporter reads `test:pass` and `test:fail` events. node:test sends the result of a subtest before the result of its parent, in the order of definition for each file. The reporter keeps the results of each level until the parent result arrives. Thus it can find each leaf test and the full name of each test.

A test does not get the tags of its parent. Thus a person cannot put old tests under one parent test with a tag. A tag on a parent test or on a suite is an error. A tag can have at most three IDs.

A skipped test or a todo test does not test a scenario. A skipped test with a tag is an error.

### IDs, registry and links

The ID is at the end of the scenario heading, in backticks. The OpenSpec validation does not stop for this, and the archive command keeps the ID.

`openspec/trace/ids.json` records the SHA-256 hash of the text of each scenario. The hash also contains the name and the text of the requirement of the scenario. Thus a change to a requirement is also a change to each of its scenarios.

The hash also contains the spaces at the start of each line, because they can change the meaning of a list or a code block. It does not contain the spaces at the end of a line. The hash contains the requirement, the scenario name and the scenario lines as separate parts. Thus a line that moves from one part to another part changes the hash.

For a new scenario ID, the ratchet command writes the hash with no condition. When the hash of a scenario that is in the registry changes, a changed test must have a tag with the ID of that scenario. If no changed test has that tag, the ratchet command stops and does not change the registry. The check command compares the registry with the base registry in the same way, so a person cannot change the hash.

`openspec/trace/links.json` records the tests of each scenario. The ratchet command writes the two files, and the check command compares them with the test run.

The text of a test starts at its first line and stops at the line that closes the test call. When the gate cannot find that line, the text stops before the next test. The gate does not compare the spaces at the end of each line. The gate uses the test as a changed test when no test file of the base contains this text. Thus a test that moves to another file does not change.

The gates also check an archived change that `--change` names. `openspec/specs` must contain each added or modified requirement of the change with the same name, the same text and the same scenario IDs. It must also contain each added or modified scenario with the same hash. It must not contain a removed requirement or a removed scenario, and `retired-ids.json` must contain the removed ID. It must contain each renamed requirement with its new name and not with its old name.

The gates read the names of the removed and renamed requirements with the rules of OpenSpec. These rules also accept a name in a list item. The spec lint checks the requirements and the `tasks.md` file of the archived change. Thus an author cannot archive a change without the spec updates and the tasks.

### OpenSpec check

The gates run the OpenSpec CLI from the `@fission-ai/openspec` development dependency. The version must be `1.3.1`. The CLI must accept each main spec with `validate --specs --strict`. For each main spec and each active change, the command `show` must read the same number of requirements and scenarios as the gate parser. Thus a heading that the two parsers read in different ways stops the build. The gates set `OPENSPEC_TELEMETRY=0`, so that the CLI does not send usage data and writes only JSON.

### Counts and hashes in the ledger

The ledger stores the not-covered counts, the total branch and function counts and the SHA-256 hash of each file with a gap. The experiments showed that V8 does not count the branches of a function that no test calls. Thus a new test can make the not-covered branch count larger. A removed test can also make the total branch count smaller.

The gate uses the content hash and the covered count to find the cause. The covered count is the total minus the not-covered count:
- For an unchanged file, the gate compares the not-covered lines. It also stops when the covered branch count or the covered function count becomes smaller.
- For a changed file, the gate compares the not-covered lines, branches and functions. For an entry with a range, it uses the low counts.

A file that no test loaded has no branch count. If the author changes the file in the same change that first loads it, the gate stops. The author must load the file in one change and change it in a later change.

For tests, the ledger stores the name of each untraced test. A new untraced name is a new gap.

### Unstable coverage

Some old tests read the clock, so two runs on the same tree can give different counts. Runs on 2026-09-13 and 2026-09-14 found this for six files. In two of these files, only the total branch count changes.

Each gate run keeps the counts and the content hash of each code file in `.gev-cache/spec-samples.jsonl`.

The command `stability --change <name>` runs the tests two times, with the allocation tests, because the other test runs at the same time change the result. The samples are the kept samples, the two runs and the ledger entry of each file with the same content hash. The command compares the not-covered counts and the total counts. For each file below 100% with different counts, the command writes a high count and a low count to the ledger entry. The history line records the low count and the high count of each metric.

The gate does not stop for a count in that range. A count below the range makes the ledger not current. The ratchet command then moves the range of that metric down and keeps its width. It does not change the range of a metric with a count in its range.

The kept samples are local files. Thus the base comparison uses these rules for a new range, and for a range that is wider than the range of the base entry:
- The history after the base must have an `unstable` line for the file with the name of the checked change.
- The file content must be equal to the base.
- The diff must change only files in `openspec/`. Thus an author cannot change a test or a caller and use a new or wider range to hide the lost coverage.
- Each high count can be at most the base count plus 5, or plus 2% of the base count when that is more.

Each range can be at most 5 wide, or 2% of its low count when that is more. Thus a range cannot become wider in each new change. For a file with the base content, a range that is not wider than the base range also cannot move above the base range. Thus a new test cannot show new branches in an unstable file.

The gate stops for a range with a low count that is not an integer from 0 to its high count. When the content of an unstable file changes, the ratchet command removes the range, because the range comes from the samples of the old content. The base comparison stops for a range in a changed file. It compares the counts of a changed file with the low counts of the base entry.

The total counts of an unstable file can also change between runs. While each not-covered count is in its range, the gate does not compare the total counts or the covered counts of the entry. The ratchet command then keeps the old total counts. The proposal records this as the limit `range-totals`.

### A ledger that is not current stops the build

The gate stops when a gap is smaller than its entry or a hash changed. The author runs the ratchet command in the same change, so `history.jsonl` records the change name for each closed gap. Each history line also records the commit that the ratchet command ran on. This is the parent of the commit that contains the line.

### Comparison with the base

The gate finds the merge base of `HEAD` and `--base`, with the default `origin/main`. It reads the base ledger files with `git show`. It stops for these problems:
- A ledger entry that the base does not have.
- A ledger entry with more not-covered lines than the base.
- A ledger entry with more not-covered branches or functions than the base, when the file changed or the covered count became smaller.
- A ledger hash that is not the base hash for a file with the base content.
- A removed ledger, a removed retired ID or a changed history.

`init` stops when the base has a ledger, and it stops for a gap in a file that the base does not have.

### Inventory

The inventory has each tracked file with the extension `.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`, `.jsx`, `.tsx`, `.html` or `.sh`. The gate stops for an untracked code file that Git does not ignore. The gate measures an HTML file by the lines of its inline scripts, its event handler attributes and its `javascript:` URLs. The gate stops for a code file that imports a test file, because the gates do not measure test files. These checks use text patterns, so the proposal records the limit `pattern-checks`. The gate measures a shell file as not loaded, because node:test cannot run it.

### STE lint rules

The lint uses the ASD-STE100 rules that a script can check:

| Rule | Limit | Level |
|---|---|---|
| `STE-SENTENCE` | 25 words | error |
| `STE-INSTRUCTION` | 20 words in a task line | error |
| `STE-PARAGRAPH` | 6 sentences | error |
| `STE-CONTRACTION` | none allowed | error |
| `STE-WORD` | words in `openspec/ste/words.json` | error |
| `STE-CODE-SPAN` | 4 words in inline code | error |
| `STE-PASSIVE` | a form of `be` before a word that ends in `-ed` or `-en` | warning |
| `STE-ING` | a word that ends in `-ing` and is not in the allowed list | warning |

Inline code and URLs count as one word. Each list item, heading and table cell is one paragraph. The lint does not check `review.md` or the `review/` folder of a change folder, because they contain copies of the agent output. The STE adversary reviews each warning.

### Review file and agents

`review.md` has one `Verdict:` line and the lines `Reviewers:`, `Date:`, `Gates:` and `Reviewed-Tree:`. The findings are Markdown check boxes in a list with any list marker. The folder `review/` has the output of each agent. Each output has one verdict line, and that line is `Verdict: PASS`. The output of earlier review rounds is in `review/round-<n>/`.

Each agent gives each finding a severity. An agent gives the verdict FAIL for a critical or a major finding, and PASS when all its findings are minor. After a PASS, the author records each minor finding of the spec adversary as a known limit in the proposal. The author keeps each minor finding of the STE adversary, or corrects it in the proposal or the design. `review.md` records the decision for each minor finding. Each other correction needs a new review round.

The two agents have only the tools Read, Grep and Glob, so they cannot change the work that they review. The front matter of each agent has only the keys name, description, tools, model and color. Thus an agent file cannot add hooks, MCP servers or skills. The command `/opsx:review` runs the gates, runs the two agents, saves their output and writes `review.md`.

The tree hash is the SHA-256 hash of the change files and of each diff file outside `openspec/changes/`. It does not include `review.md` or the folder `review/`. The agents do the review after the archive command, so the hash stays correct until a file changes. After a PASS, the author can change the proposal and the design for minor findings. The tree hash then includes these changes, which no agent read. A change name can be in only one change folder, so the gate always finds the correct `review.md`.

### CI

The command `gates.mjs ci` reads the diff against the base. A diff that changes code, tests, `openspec/` or a process file must add one folder in `openspec/changes/archive`. The process files are `AGENTS.md`, the files in `.claude/` and `.github/`, `Makefile`, `Dockerfile`, `.node-version`, `package.json` and `package-lock.json`. The command then runs the check with that change name. An active change on the branch stops the build.

### Files

| File | Purpose |
|---|---|
| `scripts/spec/gates.mjs` | Command line: `check`, `ci`, `init`, `ratchet`, `stability`, `lint`, `tree` |
| `scripts/spec/lib/run-parallel.mjs` | Start the test runs at the same time and wait for them |
| `scripts/spec/lib/specs.mjs` | Read the scenarios, the IDs and the hashes from the specs, and check the specs of an archived change |
| `scripts/spec/lib/spec-lint.mjs` | Check the scenario, requirement and task format |
| `scripts/spec/lib/openspec.mjs` | Run the pinned OpenSpec CLI and compare its result with the result of the gate parser |
| `scripts/spec/lib/trace-reporter.mjs` | The node:test reporter for the test names, the lines and the results |
| `scripts/spec/lib/test-guard.mjs` | The assertion counts, the source checks, the module hook checks and the gate values of child processes |
| `scripts/spec/lib/trace.mjs` | Link the tests to the scenarios and find the trace errors |
| `scripts/spec/lib/registry.mjs` | The ID registry, the links file and the changed tests |
| `scripts/spec/lib/inventory.mjs` | List the tracked code files, the untracked code files and the test files |
| `scripts/spec/lib/coverage.mjs` | Read the lcov report and make the coverage data |
| `scripts/spec/lib/git.mjs` | The merge base, the base files and the diff |
| `scripts/spec/lib/ledger.mjs` | Compare and make the gap ledger, run the ratchet command and keep the coverage samples |
| `scripts/spec/lib/ste.mjs` | The STE lint rules |
| `scripts/spec/lib/review.mjs` | Read and check `review.md`, the agent files and the tree hash |
| `scripts/spec/lib/ci.mjs` | Find the change of a CI diff |
| `src/tooling/spec/*.test.mjs` | The tests for the files above |
| `openspec/trace/*` | The ledger, the history, the retired IDs, the ID registry and the links |
| `openspec/ste/words.json` | The project word list and the allowed `-ing` words |
| `.claude/agents/*.md` | The two review agents |
| `.claude/commands/opsx/review.md` | The command that runs the review |
| `AGENTS.md` | The process rules for people and agents |

## Risks / Trade-offs

- [The guard makes each test process slower.] → The guard reads the source only for the files in the inventory.
- [An author can write the agent output.] → The tree hash stops old reviews. A person checks the review in the pull request.
- [The first ledger is large.] → Backfill changes make it smaller, one capability at a time. `history.jsonl` shows the progress.
- [Browser code cannot reach 100% with node:test.] → The ledger records this code until the `browser-coverage` change.
- [The project word list is not the ASD-STE100 dictionary.] → The STE adversary checks words against STE.

## Migration Plan

1. Merge this change with the first ledger. All old gaps have the origin `pre-spec`.
2. Start backfill changes. Each one adds specs, adds tags to tests, adds tests and runs `ratchet --change <name>`.
3. Remove the part of the old test runner that finds the test files, after all tests are in the gate run.

To remove this process, remove the CI job and the `gates` target. The app does not use these files.
