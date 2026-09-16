## 1. The tolerance rule

- [x] 1.1 Write the test for `gap-ledger-069`.
- [x] 1.2 Write the test for `gap-ledger-070`.
- [x] 1.3 Write the test for `gap-ledger-071`.
- [x] 1.4 Write the test for `gap-ledger-072`.
- [x] 1.5 Write the test for `gap-ledger-073`.
- [x] 1.6 Write the test for `gap-ledger-074`.
- [x] 1.7 Write the test for `gap-ledger-075`.
- [x] 1.8 Write the test for `gap-ledger-076`.
- [x] 1.9 Write the tolerance rule in `scripts/spec/lib/ledger.mjs` until the tests pass.

## 2. The requirements that this change edits

- [x] 2.1 Write the tests for `gap-ledger-003`, `gap-ledger-004` and `gap-ledger-005`.
- [x] 2.2 Write the tests for `gap-ledger-006`, `gap-ledger-007` and `gap-ledger-008`.
- [x] 2.3 Write the tests for `gap-ledger-009`, `gap-ledger-017` and `gap-ledger-018`.
- [x] 2.4 Write the tests for `gap-ledger-019`, `gap-ledger-020` and `gap-ledger-031`.
- [x] 2.5 Write the tests for `gap-ledger-053`, `gap-ledger-054` and `gap-ledger-055`.
- [x] 2.6 Write the tests for `ci-gates-006`, `ci-gates-007` and `ci-gates-008`.
- [x] 2.7 Write the tests for `gap-ledger-010`, `gap-ledger-011` and `gap-ledger-012`.
- [x] 2.8 Write the tests for `gap-ledger-013`, `gap-ledger-014`, `gap-ledger-027` and `gap-ledger-077`.
- [x] 2.9 Write the tests for `gap-ledger-028`, `gap-ledger-029` and `gap-ledger-057`.
- [x] 2.10 Write the tests for `gap-ledger-021`, `gap-ledger-022` and `gap-ledger-023`.
- [x] 2.11 Write the tests for `gap-ledger-024`, `gap-ledger-025` and `gap-ledger-026`.
- [x] 2.12 Write the tests for `gap-ledger-030`, `gap-ledger-032` and `gap-ledger-040`.
- [x] 2.13 Write the tests for `gap-ledger-041`, `gap-ledger-046`, `gap-ledger-048` and `gap-ledger-056`.
- [x] 2.14 Write the tests for `gap-ledger-001`, `gap-ledger-002` and `gap-ledger-015`.
- [x] 2.15 Write the tests for `gap-ledger-016` and `gap-ledger-047`.

## 3. The removals

- [x] 3.1 Remove the ranges, the band, the stability command and the kept samples from `scripts/spec/lib/ledger.mjs`.
- [x] 3.2 Remove the stability command from `scripts/spec/gates.mjs` and from the `Makefile`.
- [x] 3.3 Remove the tests of the removed scenarios from `src/tooling/spec/ledger.test.mjs`.
- [x] 3.4 Write the 25 retired IDs in `openspec/trace/retired-ids.json`, after the archive command removes the two requirements.
- [x] 3.5 Remove the rules of the ranges and the band from `.claude/agents/spec-adversary.md`.

## 4. The ledger file

- [x] 4.1 Write the ledger again with the version 4, the total line counts and no field `low`.

## 5. Removal of a requirement

- [x] 5.1 Write the test for `spec-trace-054`.
- [x] 5.2 Give `loadSpecs` the scenarios that an active change removes.
- [x] 5.3 Use those scenarios in the trace gate.

## 6. Gates and review

- [x] 6.1 Run `make gates CHANGE=simplify-ledger` until all gates pass.
- [x] 6.2 Run `/opsx:review simplify-ledger`.
