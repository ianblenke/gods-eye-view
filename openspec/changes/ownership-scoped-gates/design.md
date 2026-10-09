## Context

Tree read: e2437f945215860c42b5d8bba6834c85f93a90ce.

The owner needs whole-file coverage for changed owned code and owned code without a ledger entry. Each changed line needs coverage.

## TERMS

- owned: With a base, a path is owned when the base manifest or the current manifest lists it. Without a base, the gate uses only the current manifest.

- upstream: A path that is not owned.

- manifest: openspec/ownership.json, with version 1 and an owned path array.

- changed line: A line in an added range of git diff -U0 against the gate base.

- class: The value owned or upstream for a path.

## Decisions

Use exact paths and prefixes with a final slash. Reject empty paths, absolute paths, dot segments and backslashes.

Reject duplicate paths, unknown keys and any version other than 1.

An absent or invalid manifest stops the gate with OWNERSHIP-MANIFEST.

Use paths that origin/main has and upstream/main lacks. Add the prefixes that the gate needs and OSH paths.

Print the class of each path in the diff against the base and Ownership: N owned, M upstream in check and ratchet.

Apply both coverage checks after the measurement and before the ratchet command writes the files.

Apply them in check and ci too. Keep adopt available to record upstream gaps before a check.

Use COVERAGE-OWNED for a changed owned file gap or an owned file without a ledger entry. Use COVERAGE-DIFF for uncovered changed lines.

Read DA records from the merged LCOV report. Keep only the lines that every LCOV record covers.

Store those lines in the trusted measurement snapshot for document mode.

Treat absent line data and untrue or absent file measurements as uncovered.

Use git diff --text --no-renames with one path per command. Count all lines of a new file as changed.

Disable external diff tools and text conversion. Use the `--` argument before the path.

Count only current inventory files. Deleted files have no new lines.

A waiver uses the same file hash, metric and count rules as the ledger.

A line waiver also names the uncovered changed line. A waiver cannot waive a gap in an untrue file.

The QA register accepts an upstream script with no current or base QA tag.
For a new script, a valid adopt record must name the script. The QA register prints QA-HEADER for an invalid QA block.

A first comment block with no QA tags has no QA header. Within the QA exception, the gate uses the synthetic header for that script.

Print a QA advisory for each synthetic header, even without a change name.

The scenarios qa-scripts-002, qa-scripts-003 and qa-scripts-023 do not apply within the QA exception.

The old header checks apply to owned scripts and to the QA register when it has no manifest argument.

The scenario qa-scripts-019 does not apply to a synthetic header. The gate prints the QA advisory when the caller gives no change name.

The report command reads the ledger without a test run and lists code and test gaps by class.

Keep the ledger format at version 4.

## Sync review rule

AGENTS.md says that review.md lists the files that a person resolved by hand under Resolved files:, or states none.

For a sync, Scope: full covers those files and the change documents. Scope: diff with a commit hash stays valid after round one.

Use a documented rule because Git cannot find every line that a person resolved by hand from a merge commit.

The lead runs the two review agents. This work creates no review.md.

## Files and checks

Add scripts/spec/lib/ownership.mjs and openspec/ownership.json.

Change gates.mjs, qa-register.mjs and measurement.mjs. Add tests under src/tooling/spec/.

Write each scenario test before its code. Use node:assert methods and literal expected values.

Run each test file in its own process. Measure each changed script separately on the host.

Use the automatic mutation tool and record each survivor with a test, an equivalent probe or a known limit.

The lead runs ratchet, final image gates and review.

## Sync line scope

Tree read for pass 2: a70c24e2a5836544b7490899e9d352cbb343d053.

Use only records that adoptsOf accepts for this change after the unchanged base history prefix.

Each file uses its last adopt record. A file without a record uses the last adopt source in the change.

Use isAdoptSource for the adopt command, checkAdopts and syncChangedLines. The function isAdoptSource checks the full lowercase hash and mergeParents(root, base).has(from).

The gate prints LEDGER-ADOPT-FROM and stops for a record with no string `file` value or an invalid adopt source.
Other records that adoptsOf does not accept give no source.

A is the set of new-side line numbers in the base diff. B is the set of those in the diff against the file in the adopt source.

Only the intersection of A and B needs coverage. A file absent from the adopt source uses all its current lines for B.

The gate compares the current tree so that checks before a commit also check author edits.

For a committed tree, these sets come from git diff -U0 base HEAD and git diff -U0 from HEAD -- file.

The merge commit itself follows the sync line rule. Later author edits to upstream code differ from the file in the adopt source and need coverage.

Use the current code inventory. Deleted paths have no new lines. The check does not read non-code paths.

Use no rename detection. A new path absent from the file in the adopt source needs coverage for each base diff line.

Binary code files use the text diff rule. Binary non-code files are not in the code inventory.

A fully covered upstream file can lack an adopt record. The file uses the last adopt source of the change.

Without adopt records, keep the base diff rule. The owned coverage scope and ledger comparisons still apply.

Print COVERAGE-DIFF: N changed lines, M brought by the merged upstream commit, K need coverage.

## Pass 3 owned gaps

Tree read: 88894512ef934f160fbeebea551d6cd2607c9c43.

Check whole-file coverage for owned code that differs from its base content, or has no ledger entry.

An unchanged owned file with a recorded gap passes this check. The ledger comparison still rejects larger gaps.

The report command and the owned gap lines list all owned gaps. The target is zero.

Use base content, not the sync line set, to select changed files for whole-file coverage.

Tests use temporary Git repositories with fixed identity, main branch, locale and config paths.

Pass 3 code commit: 3a72f0f21b160c6c2a9cdabede2df2dda7ec2c23.

Print the owned gap lines after valid history and before the changed line check.

Check sync sources before the base ledger JSON.


## Pass 4

Tree read: bf174f99d5eb799c0f3fd17648b5b6042dab1402.

For a run with a base, the owned class is the union of paths from the base manifest and the current manifest.
The report command has no base and reads only the current manifest.
An absent base manifest is empty. An invalid base manifest gives OWNERSHIP-MANIFEST.

The QA register uses a synthetic header for a base script only when the base script has no QA tag in its first comment block.
For a new script, the QA register needs a valid adopt record.
A new script that no valid adopt record names prints QA-HEADER.
A script whose base script had a QA tag in its first comment block also prints QA-HEADER.

Git diff uses a 256 MiB output buffer.


The host mutation copy has no Git index. Its QA run omits qa-scripts-023, the project inventory test.
That test runs in the clone of the project. The host adapter uses file output to avoid the host pipe error.
The host adapter reads that output during each test and stops on the first failed test, as the automatic mutation tool does.

The ci command selects the change before the gate reads the adopt records of that change.
The gate checks history JSON before the owned gap lines even when it has no change name.

The measurement and the snapshot check use the selected change for the scenario checks.
The measurement uses the caller environment and the allocation file list. The phase time line names the phase measure.
The history check reads each record after the base history prefix, not only the first record.

The source check returns false for a full hash when Git cannot read the merge parents.
The gate prints LEDGER-ADOPT-FROM for a null byte in `from`, as for another invalid adopt source.

## Pass 5 words

### Pass 6 words

| Word | File and function, or object |
|---|---|
| gate | scripts/spec/gates.mjs: runGates |
| ratchet command | runGates: command ratchet |
| adopt command | runGates: command adopt |
| ci command | runGates: command ci |
| init command | runGates: command init |
| report command | runGates: command report |
| snapshot check | gates.mjs: documentMeasurement |
| base | Git commit for the comparison |
| base manifest | ownership.json at the base |
| current manifest | ownership.json in the current tree |
| manifest | openspec/ownership.json |
| class | ownership.mjs: classify; owned or upstream |
| adopt record | ledger.mjs: adoptsOf |
| adopt source | Commit in the from field of an adopt record |
| history | openspec/trace/history.jsonl |
| history prefix | History text at the base |
| QA register | qa-register.mjs: readQaRegister |
| synthetic header | Header object that readQaRegister creates |
| QA advisory | qa-register.mjs: qaAdvice synthetic header lines |
| QA candidate lists | measured.qaScripts files and QA-HEADER error files; gates.mjs: adopt |
| ledger entry | gaps.json: coverage or untracedTests entry |
| gap | Code below full coverage or a test without a scenario ID |
| owned gap lines | gapReport output for the owned class |
| measurement | gates.mjs: measure |
| measurement phase | Phase time that the gate prints under the name measure |
| merge parent | Parent other than the first parent of a merge after the base |
| valid adopt record | Record that passes adoptsOf for this change and names a merge parent with its full lowercase hash |
| source check | ownership.mjs: isAdoptSource |
| history check | ownership.mjs: validAdoptSources |
| JSON parse error in the history | JSON.parse fault in validAdoptSources |
| diff process | ownership.mjs: changedLines |
| agent | Person or AI agent that reads the process text |
| process text | AGENTS.md and openspec/config.yaml |
| report | Output of the report command |
| line check | ownership.mjs: coverageFaults |
| LCOV record | One SF block with coverage data in LCOV |
| file | Path and its current content |
| waiver | History record that waives a gap |
| test instance | One run of a test name |
| scenario | Spec clause with a stable ID |
| owner | Person who sets the process rules |
| lead | Person who runs the image checks and review |
| person | Human who writes or merges code |
| caller | Code that calls runGates |
| child environment | Environment that measure passes to the child process |
| allocation file list | allocationFiles argument of measure |
| clock | clock argument of runGates |
| phase time line | phase output of runGates |
| change | Named OpenSpec folder that the gate selects |
| change documents | Proposal, design, tasks, evidence and delta specs |
| base file | readFileAt result for a file at the base |
| current file | readFileSync result for a file in the current tree |
| header block | First block that parseQaHeader reads, with a QA tag |
| QA tag | purpose, covers, run or needs in the first comment block |
| code inventory | inventory.mjs: codeInventory result |
| line data | Covered DA line numbers from LCOV |
| changed line | New-side line number in the diff against the base |
| test run | All test processes that the gate starts |
| assertion | node:assert call counted by the test guard |
| source option | from option that the adopt command resolves |
| source hash | Full hash of 40 lowercase hexadecimal digits |
| hash pattern | The JavaScript pattern /^[0-9a-f]{40}$/ in isAdoptSource |
| history record | JSON object in history.jsonl |
| measurement snapshot | measurement.mjs: writeMeasurement output |
| ledger | openspec/trace/gaps.json |
| manifest reader | ownership.mjs: readOwnership |
| hash resolver | git.mjs: resolveCommit |
| merge parent reader | git.mjs: mergeParents |
| merged file set | git.mjs: changedByCommit result |
| QA adopt helper | qa-register.mjs: adoptableQaScript |
| adopt check | ledger.mjs: checkAdopts |
| owned coverage check | ownership.mjs: coverageFaults owned file loop |
| gap report function | ownership.mjs: gapReport |

### Pass 7 words

| Word | Meaning |
|---|---|
| valid waiver | A waiver record with a positive whole-number count for the same file, the same file hash and the same metric. |

### Pass 8 words

| Word | Meaning |
|---|---|
| check command | runGates: command check |
| reached adopt record | Adopt record with the field reached and the value true (gap-ledger-106) |
| DA record | One DA line of an LCOV record. |

## Pass 5 decisions

D7: The source check accepts only a full hash of 40 lowercase hexadecimal digits and a merge parent after the base.
The adopt command resolves the `--from` option before the source check and writes the full hash.

D8: The base QA tag blocks the synthetic header even when a valid adopt record names the file.
The function adoptableQaScript checks the class, current tag and base tag.
The adopt command takes QA candidates from the QA register scripts and QA-HEADER errors.
The adopt command also checks that the adopt source changed the file.
The adopt command writes the zero-count record and removes only that file's QA-HEADER error.

D9: The Order note states the real test order. Requirements for ownership-045 through ownership-049 have Origin: backfill.

D10: The scenario ownership-038 names the error code and the stable prefix of the message. The init scenario states its early stop.
The known limits name the source check cost and the absence of a real sync run.

### Purpose after archive

With a base, a path is owned when the base manifest or the current manifest lists it.
Without a base, the gate uses only the current manifest.
Each owned code file that a change adds or edits, and each owned code file without a ledger entry, needs full coverage.
Each changed line needs coverage, except a line that equals the file in the adopt source in a sync.
The report command lists all ledger gaps of both classes.
