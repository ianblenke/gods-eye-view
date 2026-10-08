## Why

The owner accepts a rigor boundary for the fork.

Owned files need full coverage. Each changed line needs coverage in every code file.

Upstream code keeps its ledger gap after the merge and the adopt command.

## What Changes

- Add an ownership manifest and path classes.

- Add whole-file coverage checks for owned code and line coverage checks for each code diff.

- Use a synthetic QA header for upstream scripts with no header.

- Add a gap report by class.

- Update the process text and sync review scope.

## Capabilities

### New Capabilities

- `ownership`: Define the manifest, coverage boundary, QA exception and gap report.

## Impact

The change adds no intended coverage gap and closes no old gap.

The image measurement must establish the actual ledger effect.

The change edits gate code, gate tests, AGENTS.md and openspec/config.yaml.

The ledger comparisons, test name checks, STE lint and two-agent review stay in force.

## Known limits

Host coverage cannot replace the image measurement on the pinned Node version.

The manifest uses exact paths and directory prefixes. It has no glob syntax.

The manifest accepts ASCII letters, digits, underscores, dots, hyphens and slashes in paths.

The diff check uses the current path and line numbers. A move can add all lines at the new path.

A line waiver must match the file hash and line number.

The sync file list is a review rule. The gate cannot prove which files a person resolved by hand.

The first review round still uses Scope: full. Later rounds can use Scope: diff with a commit hash.

QA scripts with valid register headers remain outside the code inventory, as before.

Upstream QA scripts with no header get the same inventory exception.

The owner must review new code outside the manifest and the reason for its class.

Line coverage follows the V8 line result. It does not prove each branch of an upstream line.

The automatic mutation campaign covers mutants that overlap the code diff. It does not test every old gate statement.

The base ledger lists one branch gap in scripts/spec/lib/test-guard.mjs and one in src/layers/osh/index.js.

Both paths are owned. The lead must measure them in the image and resolve any true gap before merge.

HTML and shell files have no true line data in the current Node measurement.
Their changed lines fail the diff check.

A sync base diff includes the upstream import lines.
The diff check applies to them too, even after adopt, unless the owner changes that scope.

The final source keeps phase-one kills for source spans that did not change.
The full second phase uses the final source.

The focused mutation set has limits for old commands, profile labels, measurement options, trace links and repeated QA covers items.
Evidence lists each such survivor.

Four old gate tests fail with the host adapter. They concern worker coverage, child coverage, parent process arguments and forced exit records.
The image must check them.

The default mutation generator omits error message text.
