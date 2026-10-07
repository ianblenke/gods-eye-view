## 1. Specs and tests

- [x] 1.1 Write the delta spec before the tests.
- [x] 1.2 Write the test for `recent-imagery-050`.
  Run the mutation that removes scroll position restoration. The test must fail.
- [x] 1.3 Write the test for `recent-imagery-053`.
  Run the mutation that changes `entry.status === 'unknown'` to `false`. The test must fail.
- [x] 1.4 Write the test for `recent-imagery-054`.
  Run the mutation that changes `Object.hasOwn(PRODUCTS, key)` to `true`. The test must fail.
- [x] 1.5 Write the test for `recent-imagery-055`.
  Run the mutation that changes `detailsOpen` to `false`. The test must fail.
- [x] 1.6 Write the test for `recent-imagery-056`.
  Run the mutation that changes `finite(point[1])` to `true`. The test must fail.
- [x] 1.7 Change the old AbortError, product, footprint, and DETAILS tests to use the new scenarios.

## 2. Code and evidence

- [x] 2.1 Correct the thumbnail loader.
- [x] 2.2 Correct the product lookups.
- [x] 2.3 Correct the DETAILS position.
- [x] 2.4 Correct footprint validation.
- [x] 2.5 Measure host coverage before and after the code changes.
- [x] 2.6 Run each recent imagery test file separately.
- [x] 2.7 Run the lint command.
- [x] 2.8 Run the format command.
- [x] 2.9 Run `/home/ianblenke/docker/gev-tools/predispatch/predispatch.py` for this change.
- [x] 2.10 Remove the unreachable default of the divisor in `pointInPolygon`.

  Finite endpoints on different sides need a nonzero divisor.
  No mutation is necessary because no default code remains.

## 3. Gates and review

- [ ] 3.1 Run `make ratchet CHANGE=fix-recent-imagery-defects`.
- [ ] 3.2 Run `make gates CHANGE=fix-recent-imagery-defects`.
- [ ] 3.3 Run the review agents.
- [ ] 3.4 Write `review.md`.
