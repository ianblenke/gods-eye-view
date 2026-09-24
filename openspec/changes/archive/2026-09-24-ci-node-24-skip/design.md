## Context

The function `missingTestContext()` in `scripts/spec/lib/test-guard.mjs` returns a message when `node:test` has no function `getTestContext`. The file `src/tooling/spec/gates.test.mjs` builds the option `GUARDED_RUN` from that message. A test that has the option skips on a Node version without the function.

The two tests of this change start with `passes(root, ['init'])`. On Node 24.14.0 the gates report `COVERAGE-NO-TEST-CONTEXT`, and `init` stops with status 1, so the tests fail. In the same file, the test `[coverage-gate-049]` that starts a real child process already has the option.

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

Each other test of the file that calls `passes(root, ['init'])` has `GUARDED_RUN`. The two tests get the same option. The file already uses a skip for a Node version without the function. A change of the workflow matrix or of the guard is a larger change with its own risk.

### D2 Keep the two lists of guarded tests true

The test `[coverage-gate-046]` in `src/tooling/spec/testGuard.test.mjs` checks two lists of tests that have `GUARDED_RUN`: one for `testGuard.test.mjs` and one for `gates.test.mjs`. It checks the scenario `coverage-gate-046`: each test that needs the guard to count assertions has a skip reason, and the other tests have none. The two tests need the guard to count assertions. Each test calls `passes(root, ['init'])`, and the gate stops with `COVERAGE-NO-TEST-CONTEXT` when the guard cannot count them. So the list for `gates.test.mjs` gets their two names, in the order of the file. The text of the scenario does not change.

## How the gates measure this change

Coverage: no code file changes. Trace: no test name changes, and the ratchet has nothing to record. The test `[coverage-gate-046]` fails without the two new names in its list, and it passes with them.

The job "Node 24.14.0" of the CI workflow is the acceptance test. It must pass on the push of this change.

## Risks / Trade-offs

- **The gate report of a live timer has no test on Node 24.14.0.** Accepted. The job "Node 26.x" runs the same tests on Node 26, and the job "Spec gates" runs them on Node 24.21.0.

## Migration Plan

None. The change is in two test files.

## Open Questions

None.
