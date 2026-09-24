## Context

The function `missingTestContext()` in `scripts/spec/lib/test-guard.mjs` returns a message when `node:test` has no `getTestContext`. The test file `src/tooling/spec/gates.test.mjs` builds the option `GUARDED_RUN` from that message. A test with the option skips on a Node version without the function.

The two tests of this change run the gates on a fixture. On Node 24.14.0 the run reports `COVERAGE-NO-TEST-CONTEXT`, and the tests fail. The test that has the same tag `[coverage-gate-049]` and starts a real child process already has the option.

## Goals / Non-Goals

**Goals:**
- Make the job "Node 24.14.0" pass.
- Keep every test name and every assertion.

**Non-Goals:**
- Change a code file, the guard or the workflow.
- Change the minimum Node version.
- Add a scenario. The requirement of `coverage-gate` already covers the leak check.

## Decisions

### D1 Use the option that the file already has

Each other test of the file that needs the guard uses `GUARDED_RUN`. The two tests get the same option. A skip is the existing way to handle a Node version without the function. A change of the workflow matrix or of the guard is a larger change with its own risk.

## How the gates measure this change

Coverage: no code file changes. Trace: no test name changes, and the ratchet has nothing to record. The job "Node 24.14.0" of the CI workflow is the acceptance test. It must pass on the push of this change.

## Risks / Trade-offs

- **The leak check has no test on Node 24.14.0.** Accepted. The same checks run on Node 24.21.0 and Node 26 in the same workflow, and the job "Spec gates" runs the gate itself.

## Migration Plan

None. The change is in a test file.

## Open Questions

None.
