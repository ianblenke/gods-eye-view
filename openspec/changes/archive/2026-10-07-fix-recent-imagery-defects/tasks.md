## 1. Specs and tests

- [x] 1.1 Write the delta spec before the tests.
- [x] 1.2 Write the test for `recent-imagery-050`.
  - [x] 1.2a Run the mutation that removes the call that restores the body scroll position.
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

- [x] 2.1 Remove the stale entry after an external AbortError.
- [x] 2.2 Use only keys on the product table itself.
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
- [x] 4.2 Give the test card a height that depends on the open state for `recent-imagery-055`.
  - [x] 4.2a Run the mutation that moves the scroll request before `render()`.
    The test must fail.
- [x] 4.3 Tag the test of a card without a getBoundingClientRect method with `recent-imagery-055`.
  - [x] 4.3a Run the mutation that removes the card method guard.
    The test must fail.
- [x] 4.4 Keep the viewport height of zero test for `recent-imagery-055`.
  - [x] 4.4a Run the mutation that removes the viewport height guard.
    The test must fail.
- [x] 4.5 Write the test of a footprint with an absent point for `recent-imagery-056`.
  - [x] 4.5a Run the mutation that changes `Array.from(ring).every` to `ring.every`.
    The test must fail.
- [x] 4.6 Assert the signal state after `settle()` for `recent-imagery-053`.
  - [x] 4.6a Run the mutation that cancels the controller before the fetch.
    The test must fail.
- [x] 4.7 Name the scroll request, loader cancellation, and product reader limits in the documents.
- [x] 4.8 Test every mutation row.
- [x] 4.9 Measure coverage and test totals.
- [x] 4.10 Run the lint command.
- [x] 4.11 Run the predispatch command.
- [x] 4.12 Run the format commands.

## 5. Corrections of review round 2

- [x] 5.1 Tag the open-state card test with `recent-imagery-050`.
  - [x] 5.1a Run the mutation that moves the scroll request before `render()`.
    The test must fail.
- [x] 5.2 Name the zero-height and card-method cases for `recent-imagery-055`.
  - [x] 5.2a Run the mutations that remove each guard.
    Each test must fail.
- [x] 5.3 Write the undefined-height test for `recent-imagery-055`.
  - [x] 5.3a Run the mutation that changes the height guard to `height === 0`.
    The test must fail.
- [x] 5.4 Write the card-inside-view test for `recent-imagery-055`.
  - [x] 5.4a Run the mutation that removes `Math.max(0, ...)`.
    The test must fail.
  - [x] 5.4b Run the mutation that changes `if (delta)` to `if (true)`.
    The scroll spy must detect the extra write.
- [x] 5.5 Test the content-update path of `recent-imagery-055`.
  - [x] 5.5a Run the mutation that moves the scroll request into `render()`.
    The test must fail.
- [x] 5.6 Name the old full and partial NaN results.
- [x] 5.7 Copy the round 1 logs into the evidence folder.
- [x] 5.8 Name the browser QA limit.
- [x] 5.9 Change the terms in both thumbnail test titles.
- [x] 5.10 Test all mutation rows.
- [x] 5.11 Measure coverage and test totals.
- [x] 5.12 Run the lint command.
- [x] 5.13 Run the predispatch command.
- [x] 5.14 Run the format commands.
