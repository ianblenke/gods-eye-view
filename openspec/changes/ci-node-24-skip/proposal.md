## Why

The CI job "Node 24.14.0" fails two tests of `src/tooling/spec/gates.test.mjs`. One test has the tag `[coverage-gate-049]`, and the other has the tag `[coverage-gate-050]`. Both check that the gate reports a live timer. The other jobs of the workflow pass since the change `ci-leak-cleanup`.

Node 24.14.0 has no function `getTestContext` in `node:test`. The test guard cannot count assertions without it, so the gate reports `COVERAGE-NO-TEST-CONTEXT`. The file `package.json` accepts Node 24.14.0 or later, and the CI matrix runs 24.14.0.

Each other test of this file that runs the gates has the option `GUARDED_RUN`. The option skips the test when `getTestContext` is missing. These two tests do not have it. The same errors show in the CI runs of 2026-09-22 to 2026-09-24. Earlier faults hid them.

## What Changes

- Add `GUARDED_RUN` to the two tests as the options argument.
- No test name changes. No assertion changes. No code file changes. No spec delta.

## Impact

- Changed test file: `src/tooling/spec/gates.test.mjs`.
- On Node 24.14.0, the two tests skip. On Node 24.21.0 and Node 26, they run as before.
- Gaps that this change opens or closes: none.

## Known limits and later changes

- `guard-needs-newer-node`: on Node 24.14.0 the guard cannot count assertions, so the tests of the gates that need it skip there. The job "Spec gates" runs the gates on the pinned Node, 24.21.0. A later change can raise the minimum Node version or make the guard work without `getTestContext`.
