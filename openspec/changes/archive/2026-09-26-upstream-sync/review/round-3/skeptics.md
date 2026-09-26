# How the lead handled the findings of round 3

Round 3 gave FAIL from both agents. The spec adversary gave F1 (major) and F2 to F6 (minor). The STE adversary gave S1 (major) and S2 to S15 (minor).

## Spec adversary

- F1 major: correct. No test asserted the rounding of the coordinate. A new test of `credential-boundary-014` uses two coordinates that round to the same four decimals (one fetch) and one that differs at the fourth decimal (a new fetch). Mutations R7 (six decimals) and R8 (two decimals) fail it. The scenario says that the provider rounds the coordinate.
- F2 minor: named as the known limit `sync-remembered-statuses`. The owner decides if a status such as `REQUEST_DENIED` must not be remembered.
- F3 minor: corrected. The Impact says 8 files, and names the two files with a count that changes between runs.
- F4 minor: corrected. The known limits `sync-counts-change-between-runs` and `sync-hand-written-adopt-lines` say: the cause is probable, four example files, the three error codes, the pull request runs, the lines 1424 and 1425 of the history, the hand edit of an entry in `gaps.json`, and the source of the counts of the Impact.
- F5 minor: corrected in task 4.6, which names the three codes and asks for each such error and its file in `review.md`.
- F6 minor: corrected in the proposal (the first use of `createGoogleGeocoder` in `src/search/defaults.js`).

## STE adversary

- S1 major: corrected in the known limit `sync-dropped-reverse-cache-test` and in D3 of the design. The code of the cache is still in `src/voice/gevActions.js`, and no test covers it.
- S2 to S15 minor: corrected in the proposal, the design, the tasks and the specs. The corrections include the roles (the owner, the person who accepts this change on `main`, and the author), the source of the rule about test names, "requests" for the network and "calls" for functions, the WHEN of `osh-096`, and the new test name of `osh-096`.
