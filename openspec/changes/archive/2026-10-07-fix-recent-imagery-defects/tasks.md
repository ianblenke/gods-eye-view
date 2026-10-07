## 1. Specs and tests

- [x] 1.1 Write the delta spec before the tests.
- [x] 1.2 Write the test for `recent-imagery-050`.
  - [x] 1.2a Run the mutation that removes scroll position restoration.
    The test must fail.
- [x] 1.3 Write the test for `recent-imagery-053`.
  - [x] 1.3a Run the mutation that changes `entry.status === 'unknown'` to `false`.
    The test must fail.
- [x] 1.4 Write the test for `recent-imagery-054`.
  - [x] 1.4a Run the mutation that changes `Object.hasOwn(PRODUCTS, key)` to `true`.
    The test must fail.
- [x] 1.5 Write the test for `recent-imagery-055`.
  - [x] 1.5a Run the mutation that changes `detailsOpen` to `false`.
    The test must fail.
- [x] 1.6 Write the test for `recent-imagery-056`.
  - [x] 1.6a Run the mutation that changes `finite(point[1])` to `true`.
    The test must fail.
- [x] 1.7 Change the old AbortError, product, footprint, and DETAILS tests to use the new scenarios.

## 2. Code and evidence

- [x] 2.1 Delete the unknown entry after an external AbortError.
- [x] 2.2 Use own product keys in each model lookup.
- [x] 2.3 Move the scroll request after the content update.
- [x] 2.4 Exclude footprint points with coordinates that are not finite.
- [x] 2.5 Measure host coverage before and after the code changes.
- [x] 2.6 Run each recent imagery test file separately.
- [x] 2.7 Run the lint command.
- [x] 2.8 Run the format command.
- [x] 2.9 Run `/home/ianblenke/docker/gev-tools/predispatch/predispatch.py` for this change.
- [x] 2.10 Remove the unreachable default of the divisor in `pointInPolygon`.

  Finite endpoints on different sides give a divisor that is not zero.
  No mutation is necessary because no default code remains.

## 3. Gates and review

- [ ] 3.1 Run `make ratchet CHANGE=fix-recent-imagery-defects`.
- [ ] 3.2 Run `make gates CHANGE=fix-recent-imagery-defects`.
- [ ] 3.3 Run the review agents.
- [ ] 3.4 Write `review.md`.

## 4. Corrections of review round 1

- [x] 4.1 Correct the test tags for `recent-imagery-050`.
- [x] 4.2 Set the card height from its open state for `recent-imagery-055`.
  - [x] 4.2a Move the scroll request before render in a mutation.
    The test must fail.
- [x] 4.3 Tag the absent card rectangle test with `recent-imagery-055`.
  - [x] 4.3a Remove the card rectangle guard in a mutation.
    The test must fail.
- [x] 4.4 Keep the absent viewport height test for `recent-imagery-055`.
  - [x] 4.4a Remove the viewport height guard in a mutation.
    The test must fail.
- [x] 4.5 Write the sparse ring test for `recent-imagery-056`.
  - [x] 4.5a Change Array.from(ring).every to ring.every in a mutation.
    The test must fail.
- [x] 4.6 Assert the signal state after settle for `recent-imagery-053`.
  - [x] 4.6a Cancel the controller before fetch in a mutation.
    The test must fail.
- [x] 4.7 Correct the terms and known limits in the documents.
- [x] 4.8 Test every mutation row.
- [x] 4.9 Measure coverage and test totals.
- [x] 4.10 Run the lint command.
- [x] 4.11 Run the predispatch command.
- [x] 4.12 Run the format commands.
