## Why

The owner accepts whole-file coverage checks for owned code only. Each changed line in upstream code still needs coverage.

Changed owned files and owned files without a ledger entry need full coverage. Each changed line needs coverage in every code file.

Upstream code keeps its ledger gap after the merge and the adopt command.

## What Changes

- Add an ownership manifest and path classes.

- Add whole-file checks for changed owned code and owned code without a ledger entry. Check each code diff line.

- Use a synthetic QA header for an upstream script with no current or base QA tag. For a new script, the QA register needs a valid adopt record.

- Make the adopt command write zero-count records for merged upstream QA scripts that meet the QA exception (`ownership-054`).

- Add a gap report by class.

- Check only the lines that differ from both the base file and the file in the adopt source for a sync.

- Update the process text and sync review scope.

## Capabilities

### New Capabilities

- `ownership`: Define the manifest, coverage boundary, QA exception and gap report.

## Impact

The change adds no intended coverage gap and closes no old gap.

The image measurement must show the actual ledger effect.

The change edits gate code, gate tests, AGENTS.md and openspec/config.yaml.

The ledger comparisons, test name checks, STE lint and two-agent review still apply.

## Known limits and later changes

Host coverage cannot replace the image measurement on the Node version in .node-version.

The manifest uses exact paths and directory prefixes. The manifest has no glob syntax.

The manifest accepts ASCII letters, digits, underscores, dots, hyphens and slashes in paths.

The diff check uses the current path and line numbers. If a person moves a file, the check counts all lines at the new path as new lines.

A line waiver must match the file hash and line number.

The list of files that a person resolved by hand is a review rule. Git cannot show all such files.

The first review round still uses Scope: full. Later rounds can use Scope: diff with a commit hash.

QA scripts with valid register headers remain outside the code inventory, as before.

Upstream QA scripts with a synthetic header also stay outside the code inventory.
Before this change, header-less upstream QA scripts were in the code inventory.
A script with a synthetic header gets no coverage check, COVERAGE-IGNORE check, test-import check or coverage-flag check.
It also gets no line check, even for lines that a person wrote or resolved by hand.

The owner must review new code outside the manifest and the reason for its class.

Line coverage follows the V8 line result. The line result does not show each branch of an upstream line.

The automatic mutation tool tests only the mutants on the changed lines. The automatic mutation tool does not test every old gate statement.

The base ledger lists one branch gap in scripts/spec/lib/test-guard.mjs and one in src/layers/osh/index.js.

Two owned files keep one recorded branch gap each. A later change closes them. The report lists them.

HTML and shell files have no true line data in the current Node measurement.
Their changed lines fail the diff check.

For a sync, a changed line needs no coverage when it equals the file in the adopt source.
Author edits and lines that a person resolved by hand need coverage.
This rule applies when the lines differ from the base file and the file in the adopt source.

The final code keeps phase-one kills for source spans that did not change.
The full second phase uses the final code.

The pass 2 focused mutation set had limits for old commands, phase time names and measurement options.
Pass 2 also had limits for trace links and repeated QA covers items.
Evidence lists each such survivor.

Four old gate tests fail with the host adapter. They concern worker coverage, child coverage, parent process arguments and forced exit records.
The image must check them.

The default mutation generator omits error message text.

Pass 4 tests an invalid source with a failed diff and with invalid base ledger JSON.
The source fault stops before both later checks.


Pass 4 has base commit bf174f99d5eb799c0f3fd17648b5b6042dab1402 and code commit 799372f0.

The gate still accepts a real merge of a branch that a person wrote in this project, followed by the adopt command.
Rule 21 in AGENTS.md says that a person checks the upstream remote.

A change that removes a path from openspec/ownership.json keeps the path owned for that change, because the base manifest lists it.
The path is upstream for the next change. The owner reads each manifest diff that removes an owned path.

The gate does not check manifest entries that match no file. For example, an entry can have a typo or lack its final slash.
The owner reviews each manifest diff.

The follow-up change html-shell-line-data must count HTML with no script as code with no code lines.
The follow-up change must also add a way to waive a file with no line data.
Tell the lead when a change needs this way, as AGENTS.md rule 18 says.

The new messages use the plural form for a count of 1, as the old messages do, for example 1 files.

Pass 4 adds the ci and init cases for the known limit L4 of evidence.md. Both cases use a recorded owned gap.

A full check run calls mergeParents three times for each valid adopt record. A sync with many adopt records can be slow.

No real sync, and no change that moves a path to the upstream class, ran through the new gates. The first sync will be the first real use.

The repository-state test qa-scripts-023 calls readQaRegister with no manifest and pins 83 scripts.
A sync that brings a header-less upstream QA script must update that test and its count in the same change.

The literal "merged upstream commit" stays in the output message that the sync tests pin (S109).
