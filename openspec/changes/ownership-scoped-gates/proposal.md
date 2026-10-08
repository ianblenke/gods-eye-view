## Why

The owner accepts a boundary for strict checks for the fork.

Changed owned files and owned files without a ledger entry need full coverage. Each changed line needs coverage in every code file.

Upstream code keeps its ledger gap after the merge and the adopt command.

## What Changes

- Add an ownership manifest and path classes.

- Add whole-file checks for changed owned code and owned code without a ledger entry. Check each code diff line.

- Use a synthetic QA header only within the base script or valid adopt exception.

- Add a gap report by class.

- Check only the lines that differ from both the base and the adopt source for a sync.

- Update the process text and sync review scope.

## Capabilities

### New Capabilities

- `ownership`: Define the manifest, coverage boundary, QA exception and gap report.

## Impact

The change adds no intended coverage gap and closes no old gap.

The image measurement must show the actual ledger effect.

The change edits gate code, gate tests, AGENTS.md and openspec/config.yaml.

The ledger comparisons, test name checks, STE lint and two-agent review still apply.

## Known limits

Host coverage cannot replace the image measurement on the Node version in .node-version.

The manifest uses exact paths and directory prefixes. It has no glob syntax.

The manifest accepts ASCII letters, digits, underscores, dots, hyphens and slashes in paths.

The diff check uses the current path and line numbers. If a person moves a file, the check counts all lines at the new path as new lines.

A line waiver must match the file hash and line number.

The list of files that a person resolved by hand is a review rule. Git cannot show all such files.

The first review round still uses Scope: full. Later rounds can use Scope: diff with a commit hash.

QA scripts with valid register headers remain outside the code inventory, as before.

Upstream QA scripts within the base script or valid adopt exception also stay outside the code inventory.

The owner must review new code outside the manifest and the reason for its class.

Line coverage follows the V8 line result. It does not show each branch of an upstream line.

The mutation test tool tests only the mutants on the changed lines. It does not test every old gate statement.

The base ledger lists one branch gap in scripts/spec/lib/test-guard.mjs and one in src/layers/osh/index.js.

Two owned files keep one recorded branch gap each. A later change closes them. The report lists them.

HTML and shell files have no true line data in the current Node measurement.
Their changed lines fail the diff check.

For a sync, a changed line needs no coverage when it equals the adopted upstream source.
Author edits and lines that a person resolved by hand need coverage if they differ from both the base and the source.

The final code keeps phase-one kills for source spans that did not change.
The full second phase uses the final code.

The pass 2 focused mutation set had limits for old commands, phase time names and measurement options.
It also had limits for trace links and repeated QA covers items.
Evidence lists each such survivor.

Four old gate tests fail with the host adapter. They concern worker coverage, child coverage, parent process arguments and forced exit records.
The image must check them.

The default mutation generator omits error message text.

Pass 4 tests an invalid source with a failed diff and with invalid base ledger JSON.
The source fault stops before both later checks.


Pass 4 reads commit bf174f99d5eb799c0f3fd17648b5b6042dab1402.

A real merge of an own branch followed by adopt is still accepted. Rule 21 needs a manual check of the upstream remote.

An owned path leaves the owned set only through a later change that changes this rule.
This is a process rule for the owner review of each manifest diff.
The union protects the current comparison. The owner rejects path removals that would remove this protection at the next base.

Manifest entries that match no file are not checked. This includes a typo or a directory without its final slash.
The owner reviews each manifest diff.

The follow-up change html-shell-line-data must treat zero-script HTML as code with no code lines.
It must add a waiver path for files without line data. A person tells the lead when a change needs it, per rule 18.

The old gate plural style, such as 1 code files, stays.

Pass 4 adds the ci and init cases for survivor class L4. Both cases use a recorded owned gap.
