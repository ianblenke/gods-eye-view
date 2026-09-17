## Why

GEV has 3,535 unit tests, but only the tests of this change refer to a written requirement. Only 120 of the 580 code files have 100% coverage, and no gate stops coverage loss. This change adds the gates and the review process for a spec-first project. It records each current gap so that later backfill changes can close the gaps.

## What Changes

- Add a trace gate. The gate reads the scenario IDs from the specs and from the test names. It stops the build for a test with a bad tag, a test without an assertion and a scenario without a test that passes.
- Add a coverage gate. The gate measures line, branch and function coverage for each tracked code file, which includes HTML and shell files. A file that no test loads has 0% coverage. The target is 100% for each file.
- Add a test guard. The guard loads into each test process. It counts assertions and stops untrue coverage from code that runs under the name of a code file.
- Add a gap ledger in `openspec/trace/gaps.json`. The gates stop the build when a gap opens, becomes larger, or closes and the ledger does not change. The gates compare the ledger files with the base branch, so a person cannot change them to hide a gap.
- Add a ratchet command. The command records the closed gaps in `openspec/trace/history.jsonl` with the change name and the commit that the command ran on.
- Add a stability command. The command records a range for each file with coverage that changes between runs.
- Add a spec lint and an STE lint. The spec lint checks the scenario and requirement format. It also compares the specs with the result of the pinned OpenSpec CLI. The STE lint checks the new prose and the names of traced tests.
- Add a review gate. Each change must have a `review.md` file with a PASS verdict, the output of two review agents and the hash of the reviewed files.
- Add a CI command, a CI job and `make gates`. The CI command finds the archived change of the diff and runs all gates for it on the pinned Node version.

## Capabilities

### New Capabilities
- `spec-trace`: The scenario IDs, the test tags, the assertion checks, the ID registry and the links from scenarios to tests.
- `coverage-gate`: The code inventory, the coverage run, the test guard and the rule against coverage ignore comments and coverage filter options.
- `gap-ledger`: The ledger of open gaps, the ratchet rule, unstable coverage, the comparison with the base branch and the ratchet command.
- `spec-lint`: The format checks for scenarios, requirements and tasks.
- `ste-lint`: The automatic checks for Simplified Technical English in new prose.
- `change-review`: The review agents, the `review.md` file and the review gate.
- `ci-gates`: The CI command, the command line, the CI job, the Makefile target and the pinned Node version.

### Modified Capabilities
None. `openspec/specs/` is empty before this change.

## Impact

- The branch starts from the commit `27e251e`, which adds the Docker files to the base `3ca81fb`. The commit `27e251e` is not in `origin/main`. Thus the diff also adds `Dockerfile`, `compose.yaml`, `.dockerignore` and `Makefile`.
- New files for the gates: `scripts/spec/`, `src/tooling/spec/`, `openspec/config.yaml`, `openspec/trace/`, `openspec/ste/`, `.node-version` and `AGENTS.md`.
- New files for the agents: `.claude/agents/`, `.claude/commands/opsx/`, which has the four OpenSpec commands and the review command, and `.claude/skills/`, which has the four OpenSpec skills.
- Changed files: `package.json`, `package-lock.json` and `.github/workflows/ci.yml`. This change adds the development dependency `@fission-ai/openspec` at the version `1.3.1` to `package.json`. This change also changes the Docker files above to pin the Node version and to add Git.
- This change does not change the code of the app.
- New process: each pull request that changes code, tests, specs or process files must contain one archived change with a passed review.
- Gaps that this change opens: none. The first ledger records the gaps in the base commit, with the origin `pre-spec`.
- Unstable coverage: seven old files have coverage that changes between runs. The kept samples come from the CI run of the pull request and from the local runs on the current tree. For five files, the table gives the lowest count and the highest count that the runs gave. For the other two files, the author wrote the high count of the not-covered lines by hand. The next bullet gives more counts of the runs. The ledger records a range for the not-covered counts:

| File | Counts |
|---|---|
| `server/providers/vessels/ais-store.js` | not-covered lines 40 to 44 |
| `src/data/labelArbiter.js` | not-covered branches 50 to 52 |
| `src/data/localGeojsonCore.js` | not-covered branches 38 to 39 |
| `src/data/manager.js` | not-covered lines 134 to 139, not-covered branches 105 to 107 |
| `src/data/spriteOrder.js` | not-covered branches 3 to 4 |
| `src/layers/flights/enrichment.js` | not-covered lines 83 to 88, not-covered branches 20 to 21, not-covered functions 3 to 4 |
| `src/voice/gevActions.js` | not-covered lines 1302 to 1304, not-covered branches 219 to 221 |

- The CI run gave 141 not-covered lines for `src/data/manager.js`. The local runs gave 91 not-covered lines for `src/layers/flights/enrichment.js`, and the CI run gave 83. These counts make a range of 7 and a range of 8, and each range is above the width limit of 5. After this change, the base of each gate run has this ledger, and the gate stops for such a range. Thus the author wrote the high counts 139 and 88 in the ledger by hand, and corrected the two history lines. The count band of 5 allows the count 141 and the count 91, which are above these high counts.

- Gaps that this change closes: none in old code. All new code starts at 100% coverage, and all new tests have scenario IDs.

## Known limits and later changes

These limits were open after this change. Each one has a later change. Each closed limit names the change that closed it.

- `browser-coverage`: node:test cannot load code that needs a browser, such as `src/standalone/ui.js`. The ledger records this code until the later change measures browser coverage.
- `script-coverage`: node:test cannot measure shell files or inline scripts in HTML files. The ledger records the four shell files in `scripts/` and the inline scripts of `tools/cesium-render.html` as gaps. The gate stops for a new or longer `.sh` file. The later change moves this code into JS modules or measures it in another way.
- `capability-coverage`: The coverage gate measures all tests together. It does not show that the tests of one capability cover the code of that capability.
- `sample-identity`: The change `simplify-ledger` closed this limit. It removed the kept samples. The stability command selected the kept samples of a file only by the content hash of the file. The samples did not record the test files of their run. Thus samples from runs with other test files could make a range too wide.
- `ci-samples`: The change `simplify-ledger` closed this limit. It removed the kept samples. The CI job did not keep samples, and no tool made them from a CI run. For this ledger, the author made the samples of one CI run by hand.
- `deterministic-tests`: The change `simplify-ledger` made this limit smaller. Its own known limit `deterministic-tests` records the part that stays. Some old tests read the clock, so the coverage of the file that they load changes between runs. A backfill change must change these tests.
- `review-attestation`: The agent that does the work can write the output of the review agents. The tree hash stops an old review, but it does not show that a review agent wrote the output. After a PASS, the author can change the proposal and the design for minor findings, and the tree hash includes these changes. The gate does not compare the severities in an agent output with its verdict. It also does not check that `review.md` names each finding of the agent outputs. A person must check the review and the agent outputs in the pull request.
- `guard-results`: A test runs as the same user as the gate, and in the same process as the test guard. Thus a test can write its own guard results, hide an error from the guard or write files to the coverage folder. A test can also find the result folder, for example from `/proc/<ppid>/cmdline`. It can write an entry that agrees with the rules for entries, or change the entries of other tests. A process that continues after the run can also change the lcov file. The spec adversary tries to find tests that do this.
- `guard-processes`: The guard gives the gate values only to a child process that `node:child_process` starts. That child process must also write coverage to the coverage folder of the test process. A worker thread with the environment of its process also has the gate values. A shell, another program or a process that a test starts without `node:child_process` can start Node without the gate values. A child process without `NODE_V8_COVERAGE`, or a worker thread with its own `env` or `execArgv` options, can do the same. The spec adversary tries to find tests that do this.
- `worker-coverage`: The test guard does not check the sources in a worker thread. The gate gives 0% coverage to a file that only a worker thread loads. A worker thread can still add coverage to a file that a test also imports.
- `scenario-text-change`: The ratchet command writes a new hash for a changed scenario when the text of a test with the scenario ID changes. The only new text in that test can be a comment. The spec adversary checks each ID with a new hash.
- `range-slack`: The change `simplify-ledger` closed this limit. Its known limit `tolerance-slack` takes the place of it. In a file with a range, a change could remove the coverage of some lines, branches or functions. The number that it removed could be at most the width of the range.
- `unchanged-band`: The change `simplify-ledger` closed this limit. Its known limit `tolerance-slack` takes the place of it. The gate allowed a band of 5, or 2% of the count when that was more, for the counts of a band file. Thus a change could remove this much coverage from a band file.
- `range-band-ratchet`: The change `simplify-ledger` closed this limit. It removed the ranges and the band. For a band file with a range, the ratchet command kept the high count and wrote the current total counts. Thus a new test that showed more branches could stop the next check.
- `range-totals`: The change `simplify-ledger` closed this limit. Its one tolerance compares the covered counts and does not stop that comparison. The total counts of a file with unstable coverage could change between runs. Thus, while each not-covered count was in its range, the gate did not compare the total counts or the covered counts of the entry.
- `branch-identity`: The ledger stores the not-covered counts, not the location of each line, branch or function. A change can remove the coverage of some lines, branches or functions, or add new code that no test covers. It can then cover or delete the same number of other lines, branches or functions. The counts do not become larger, so the gate does not stop. The spec adversary checks each removed or changed test and each changed code file that has a ledger entry.
- `uncalled-code`: V8 does not count the branches or inner functions of a function that no test calls. The gate records each physical line of a file that no test loads as not covered. It records one not-covered line for each event handler attribute. Thus a change can add code on the current lines of such a function, file or attribute, and no count changes. The spec adversary checks each changed code file that has a ledger entry.
- `pattern-checks`: The gate uses text patterns to find HTML code and the code that loads a test file. It does not use an HTML parser or the module loader. The gate counts no lines for HTML code with a syntax that the patterns do not find. Examples are an unquoted attribute value, a character reference in a URL and a `srcdoc` attribute. A code file can also load a test file with a syntax that the patterns do not find. The spec adversary checks each changed HTML file and each new line that loads a file.
- `inventory-extensions`: The inventory selects code files by their extension. The gates do not measure code in a file with another extension or with no extension. Examples are a shell script without `.sh`, an SVG file with a script and a file that `require` loads. A diff that changes only such files needs no archived change. The spec adversary checks each new or changed file that has no code extension.
- `guard-self-coverage`: Each test process loads the test guard as a preload. Thus the guard file gets coverage also when no test imports it and checks it. The spec adversary checks each change to `scripts/spec/lib/test-guard.mjs`.
- `gate-code`: The CI job runs the gate code of the pull request. A pull request can change `scripts/spec/` so that a gate does not stop the build. A person must check each change to `scripts/spec/`, `.github/workflows/`, `.claude/` and `openspec/trace/` in the pull request. The agent files and the review command in `.claude/` contain the review checks. A change to these files can make a review weaker. A later change can add a code owner rule for these folders.
- `assertion-count`: The guard counts the methods of `node:assert`. It does not count a direct `assert()` call or `t.assert`. It cannot find the difference between a real check and an assertion on a constant. It also counts an assertion that the code under test makes while a test runs. The spec adversary finds weak assertions.
- `untraced-names`: The ledger records each untraced test by its file and its name. A change can remove an old untraced test and add a new untraced test with the same name in the same file. The gate does not stop for this. The spec adversary checks each changed test without a tag.
