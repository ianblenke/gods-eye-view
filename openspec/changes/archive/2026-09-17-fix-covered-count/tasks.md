## 1. The specs

- [x] 1.1 Write the delta spec with the two modified requirements, `gap-ledger-054`, `gap-ledger-070`, `gap-ledger-072` and `gap-ledger-078`.
- [x] 1.2 Write proposal.md with the measured counts, the Impact and the known limits.
- [x] 1.3 Write design.md with the loss rule, the rejected options and the changed files.

## 2. The tests

- [x] 2.1 Write the test for `gap-ledger-078`.
- [x] 2.2 Change the test for `gap-ledger-072`.
- [x] 2.3 Change the test for `gap-ledger-054`.
- [x] 2.4 Change the test for `gap-ledger-070`.
- [x] 2.5 Add the measured ratchet case to the test for `gap-ledger-073`.
- [x] 2.6 Add a case to the test for `gap-ledger-069` for a moved total at the edge of the tolerance.
- [x] 2.7 Add the measured case with no tolerance conditions to the test for `gap-ledger-074`.

## 3. The code

- [x] 3.1 Write `lossOf` and the loss comparison in `scripts/spec/lib/ledger.mjs` until the tests pass.
- [x] 3.2 Update the JSDoc of `compareLedger`.

## 4. The scenarios that keep their text

- [x] 4.1 Keep the tests for `gap-ledger-003`, `gap-ledger-004`, `gap-ledger-005`.
- [x] 4.2 Keep the tests for `gap-ledger-006`, `gap-ledger-007`, `gap-ledger-008`.
- [x] 4.3 Keep the tests for `gap-ledger-009`, `gap-ledger-017`, `gap-ledger-018`.
- [x] 4.4 Keep the tests for `gap-ledger-019`, `gap-ledger-020`, `gap-ledger-031`.
- [x] 4.5 Keep the tests for `gap-ledger-053`, `gap-ledger-055`.
- [x] 4.6 Keep the test for `gap-ledger-071`.

## 5. Gates and review

- [x] 5.1 Run `make lint`.
- [x] 5.2 Run `make ratchet CHANGE=fix-covered-count`.
- [x] 5.3 Run `make gates CHANGE=fix-covered-count` until all gates pass.
- [x] 5.4 Run `/opsx:review fix-covered-count`.
