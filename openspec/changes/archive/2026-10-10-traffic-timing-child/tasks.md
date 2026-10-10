## 1. Write the test

- [x] 1.1 Change the test in `src/data/trafficTiming.test.mjs` for `coverage-gate-101`.

## 2. Check on the host

- [x] 2.1 Run the test file `src/data/trafficTiming.test.mjs` on the host.
- [x] 2.2 Name one fault of the test for each part of `coverage-gate-101`.
- [x] 2.3 Run the named fault of each part.
- [x] 2.4 Write `evidence/mutations.txt` with the result of each fault.
- [x] 2.5 Run the four checks of `make precheck` on the host.
- [x] 2.6 Run the STE lint on the host.
- [x] 2.7 Run `openspec validate traffic-timing-child` on the host.

## 3. Lead work before and in Docker

- [x] 3.1 Run `make ratchet CHANGE=traffic-timing-child`.
- [x] 3.2 Check that the last gate run has no violation COVERAGE-FAKE.
- [ ] 3.3 Run the two review agents.
- [ ] 3.4 Write review.md.
- [ ] 3.5 Run `make gates CHANGE=traffic-timing-child` on the final tree.
