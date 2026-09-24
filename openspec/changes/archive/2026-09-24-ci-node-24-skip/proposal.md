## Why

Two tests of `src/tooling/spec/gates.test.mjs` fail in the CI job "Node 24.14.0". One test has the tag `[coverage-gate-049]` and no option `GUARDED_RUN`, and the other has the tag `[coverage-gate-050]`. Both test the gate report of a live timer. The other jobs of the workflow pass after the change `ci-leak-cleanup`.

Node 24.14.0 has no function `getTestContext` in `node:test`. Without that function the test guard cannot count assertions, and the gate reports `COVERAGE-NO-TEST-CONTEXT`. The file `package.json` accepts Node 24.14.0 and later Node 24 versions, and Node 26. The CI matrix runs Node 24.14.0.

Each other test of this file that calls `passes(root, ['init'])` has the option `GUARDED_RUN`. The option skips the test when `node:test` has no function `getTestContext`. These two tests do not have the option. Each of them starts with `passes(root, ['init'])`, and `init` stops with status 1 on Node 24.14.0.

The CI runs of 2026-09-22 and 2026-09-23 (UTC) show the error `COVERAGE-NO-TEST-CONTEXT`. In the runs of 2026-09-24 (UTC) before the change `ci-leak-cleanup`, `npm run format:check` stopped the job before the step `npm test`. The first run after that change shows the error again.

## What Changes

- Add `GUARDED_RUN` to the two tests as the options argument.
- Add the names of the two tests to the list for `gates.test.mjs` in the test `[coverage-gate-046]`. The list names each test of that file that has the option `GUARDED_RUN`.
- No test name changes. No assertion changes except the list in the test `[coverage-gate-046]`. No code file changes. No spec delta.

## Impact

- Changed test files: `src/tooling/spec/gates.test.mjs` and `src/tooling/spec/testGuard.test.mjs`.
- On Node 24.14.0, the two tests skip. On Node 24.21.0 and Node 26, they run as before.
- Gaps that this change opens or closes: none.

## Known limits and later changes

- `guard-needs-newer-node`: on Node 24.14.0 the guard cannot count assertions, so the tests of the gates that need the guard skip there. The job "Spec gates" runs the gates on the pinned Node, 24.21.0. A later change can raise the minimum Node version or make the guard work without `getTestContext`.
- `local-gates-cannot-prove-it`: `make gates` runs on Node 24.21.0, where both tests run before and after this change. Only the CI job "Node 24.14.0" runs the skip path. The CI run after the push is the proof.
- `later-steps-not-yet-run-on-24-14`: when the parallel phase fails, `scripts/run-unit-tests.mjs` stops. The allocation probes and the build step of the job "Node 24.14.0" did not run in the failed CI runs. The first CI run in which the parallel phase passes is the first run that reaches the allocation probes. The build step comes after the probes. The probes and the build step can fail for another reason.
- `coverage-gate-030-no-option`: the test `[coverage-gate-030]` runs the gates on a fixture, and the test does not have the option `GUARDED_RUN`. On Node 24.14.0 the test passes, because none of its assertions depends on the error `COVERAGE-NO-TEST-CONTEXT`. This change does not add the option to this test.
