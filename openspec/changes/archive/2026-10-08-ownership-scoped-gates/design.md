## Context

Tree read: e2437f945215860c42b5d8bba6834c85f93a90ce.

The owner needs whole-file coverage for changed owned code and owned code without a ledger entry. Each changed line needs coverage.

## TERMS

- owned: A path that either the base manifest or the current manifest lists, or that starts with a listed directory prefix.

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

A line waiver also names the uncovered changed line. A waiver cannot cover an untrue file.

The QA register accepts a base upstream script with no QA header, or a script that a valid adopt record names. An invalid QA block still gives QA-HEADER.

A first comment block with no QA tags has no QA header. Within the QA exception, the gate uses the synthetic header for that script.

Print a QA advisory for each synthetic header, even without a change name.

The scenarios qa-scripts-002 and qa-scripts-003 do not apply within the QA exception.

The old header checks apply to owned scripts and to the register function when it has no manifest argument.

The scenario qa-scripts-019 does not apply to a synthetic header. The gate prints the synthetic header advisory when no change name is given.

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

Each file uses its last own record. A file without a record uses the last source in the change.

Use isAdoptSource for the adopt command, checkAdopts and syncChangedLines. It checks mergeParents(root, base).has(resolveCommit(root, from)).

Stop with LEDGER-ADOPT-FROM for an absent string file or a source that no merge after the base brought.
Other records that adoptsOf does not accept give no source.

A is the set of new-side line numbers in the base diff. B is the set of those in the adopt source diff.

Only the intersection of A and B needs coverage. A file absent from the source uses all its current lines for B.

The gate compares the current tree so that checks before a commit also check author edits.

For a committed tree, these sets come from git diff -U0 base HEAD and git diff -U0 from HEAD -- file.

The merge commit itself follows the sync line rule. Later author edits to upstream code differ from its source and need coverage.

Use the current code inventory. Deleted paths have no new lines. The check does not read non-code paths.

Use no rename detection. A new path absent from its source needs coverage for each base diff line.

Binary code files use the text diff rule. Binary non-code files do not enter the code inventory.

A fully covered upstream file can lack an adopt record. It uses the last source of the change.

Without adopt records, keep the base diff rule. The owned coverage scope and ledger comparisons still apply.

Print COVERAGE-DIFF: N changed lines, M brought by the merged upstream commit, K need coverage.

## Pass 3 owned gaps

Tree read: 88894512ef934f160fbeebea551d6cd2607c9c43.

Check whole-file coverage for owned code that differs from its base content, or has no ledger entry.

An unchanged owned file with a recorded gap passes this check. The ledger comparison still rejects larger gaps.

The report and the owned gap advice list all owned gaps. The target is zero.

Use base content, not the sync line set, to select changed files for whole-file coverage.

Tests use temporary Git repositories with fixed identity, main branch, locale and config paths.

Pass 3 code commit: 3a72f0f21b160c6c2a9cdabede2df2dda7ec2c23.

Print owned gap advice after valid history and before the changed line check.

Check sync sources before the base ledger JSON.


## Pass 4

Tree read: bf174f99d5eb799c0f3fd17648b5b6042dab1402.

For a run with a base, the owned class is the union of paths from the base manifest and the current manifest.
The report command has no base and reads only the current manifest.
An absent base manifest is empty. An invalid base manifest gives OWNERSHIP-MANIFEST.

A synthetic QA header needs a base script with no QA tag in its first comment block, or a valid adopt record.
A new unlisted script and a script whose base header had a QA tag keep QA-HEADER.

Git diff uses a 256 MiB output buffer.


The host mutation copy has no Git index. Its QA run omits qa-scripts-023, the project inventory test.
That test runs in the source clone. The host adapter uses file output to avoid the host pipe error.
It reads that output during each test and stops on the first failed test, as the automatic tool does.

CI selects the change before the gate reads its adopt list.
The gate checks history JSON before advice even when it has no change name.

Both measurement modes use the selected active change for its scenario checks.
The host measurement keeps the caller environment, allocation list and measure phase name.
The source check reads each record in the accepted suffix, not only the first record.

The shared source predicate returns false for a source name that Git cannot read.
A null byte in from gives the same LEDGER-ADOPT-FROM error as another invalid source.
