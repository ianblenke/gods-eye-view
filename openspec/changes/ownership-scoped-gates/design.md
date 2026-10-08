## Context

Tree read: e2437f945215860c42b5d8bba6834c85f93a90ce.

The owner accepts whole-file coverage for owned code and coverage for each changed line.

## TERMS

- owned: A path that the manifest lists or that starts with a listed directory prefix.

- upstream: A path that is not owned.

- manifest: openspec/ownership.json, with version 1 and an owned path array.

- changed line: A line in an added range of git diff -U0 against the gate base.

- class: The value owned or upstream for a path.

## Decisions

Use exact paths and prefixes with a final slash. Reject empty paths, absolute paths, dot segments and backslashes.

Reject duplicate paths, unknown keys and any version other than 1.

An absent or invalid manifest stops the gate with OWNERSHIP-MANIFEST.

Use the fork-only file list from upstream/main and origin/main, plus the required prefixes and OSH paths.

Print each changed path class and Ownership: N owned, M upstream in check and ratchet.

Apply both coverage checks after the measurement and before ratchet writes.

Apply them in check and ci too. Keep adopt available to record upstream gaps before a check.

Use COVERAGE-OWNED for an owned file gap and COVERAGE-DIFF for uncovered changed lines.

Read DA records from the merged LCOV report. Intersect covered lines across duplicate source records.

Store those lines in the trusted measurement snapshot for document mode.

Treat absent line data and untrue or absent file measurements as uncovered.

Use git diff --text --no-renames with one path per command. Add all lines of a new file.

Disable external diff tools and text conversion. Use the `--` argument before the path.

Count only current inventory files. Deleted files have no new lines.

A waiver uses the same file hash, metric and count rules as the ledger.

A line waiver also names the uncovered changed line. A waiver cannot cover an untrue file.

The QA register accepts an upstream script with no QA header. An invalid QA block still fails.

A first comment block with no QA tags has no QA header. The gate uses the synthetic header for that script.

Print a QA advisory for each synthetic header, even without a change name.

The ownership exception sets the scope of qa-scripts-002, qa-scripts-003 and qa-scripts-019.

The old header checks apply to owned scripts and to calls with no manifest.

The old no-advice scenario applies to scripts with no synthetic header.

The report command reads the ledger without a test run and lists code and test gaps by class.

Keep the ledger format at version 4.

## Sync review rule

AGENTS.md needs review.md to list the files resolved by hand under Resolved files:, or state none.

For a sync, Scope: full covers those files and the change documents. Scope: diff with a commit hash stays valid after round one.

Use a documented rule because Git cannot reconstruct every manual resolution from a merge commit.

The lead runs the two review agents. This work creates no review.md.

## Files and checks

Add scripts/spec/lib/ownership.mjs and openspec/ownership.json.

Change gates.mjs, qa-register.mjs and measurement.mjs. Add tests under src/tooling/spec/.

Write each scenario test before its code. Use node:assert methods and literal expected values.

Run each test file in its own process. Measure each changed script separately on the host.

Use the automatic mutation tool and record each survivor with a test, an equivalent probe or a known limit.

The lead runs ratchet, final image gates and review.
