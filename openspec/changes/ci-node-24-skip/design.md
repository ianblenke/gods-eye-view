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

### D2 Keep the list of skipped tests true

The test `[coverage-gate-046]` in `src/tooling/spec/testGuard.test.mjs` pins the exact list of tests that carry `GUARDED_RUN`. It checks the scenario `coverage-gate-046`: each test that needs the guard has a skip reason, and the other tests have none. The two tests need the guard, because they run the gates on a fixture. So the pinned list gets their two names, in the order of the file. The text of the scenario does not change.

## How the gates measure this change

Coverage: no code file changes. Trace: no test name changes, and the ratchet has nothing to record. The test `[coverage-gate-046]` fails without the two new names in its list, and it passes with them. The job "Node 24.14.0" of the CI workflow is the acceptance test. It must pass on the push of this change.

## Risks / Trade-offs

- **The leak check has no test on Node 24.14.0.** Accepted. The same checks run on Node 24.21.0 and Node 26 in the same workflow, and the job "Spec gates" runs the gate itself.

## Migration Plan

None. The change is in a test file.

## Open Questions

None.
