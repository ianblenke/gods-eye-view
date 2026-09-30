## 1. The merge

- [x] 1.1 Merge `e7707d9` into the fork with one merge commit.
- [x] 1.2 Keep both sides of the three conflicts.
- [x] 1.3 Add the row `["osh-systems", "3"]` to the token ledger.
- [x] 1.4 Change the token fixtures to the next free digit `4`.
- [x] 1.5 Add a QA header to each of the 13 new upstream QA scripts.

## 2. The tests

For each test below, run the named mutation. Report the test that fails in `review.md`.

- [ ] 2.1 Count 29 rows in the token ledger tests.
  - Mutation: remove the row `osh-systems` from the token ledger. A test must fail.
- [ ] 2.2 Count 83 QA scripts in `qa-scripts-023`.
  - Mutation: remove the header of `scripts/qa-terrain-429.mjs`. The test must fail.
- [ ] 2.3 Stop the timer leak in the test of the flight hooks.
  - Mutation: remove the mock of `setTimeout`. The gates must report a live timer.
- [ ] 2.4 Stop the timer leak in `militaryInstallations.test.mjs`.
  - Mutation: remove the wait after the last test. The gates must report a live timer.
- [ ] 2.5 Assert after the loop in the test of the surface keys.
  - Mutation: make `trafficSurfaceKey` give a new key for each call. The test must fail.

- [ ] 2.6 Raise the time ceiling of the slow boundary lookup test to 10 seconds.
  - Mutation: make the lookup wait for the slow source. The test must fail.

## 3. Gates and review

- [ ] 3.1 Run the command `make adopt` for this change, from the merged commit.
- [ ] 3.2 Run `make ratchet CHANGE=upstream-sync-2`.
- [ ] 3.3 Run `make gates CHANGE=upstream-sync-2`.
- [ ] 3.4 Run `/opsx:review upstream-sync-2`.
- [ ] 3.5 Write `review.md` with the tree hash.
