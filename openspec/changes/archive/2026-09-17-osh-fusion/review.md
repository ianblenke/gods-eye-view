# Review: osh-fusion

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-17
Gates: make gates CHANGE=osh-fusion passed
Rounds: 4
Scope: full
Reviewed-Tree: ea012fa722fdf4d478965b552d7e940a1b10ed84341beac68be93da551872ecd

The output of each round is in `review/round-<n>/`. The output in `review/` is the spec adversary of round 3, which gave PASS with no open major, and the STE adversary of round 4, which gave PASS with no finding.

The number of findings decreased in each round: 35 in round 1, 22 in round 2, 13 in round 3 and 1 in round 4. Round 4 was a narrow round for one known limit.

This is the largest change of the project: 35 scenarios, 12 new source files, 13 test files and three synthetic fixtures. A planning agent wrote the plan, an implementing agent wrote the code and the tests, and the two review agents read the result. The plan is in the scratchpad of the session, not in the repository.

## What the review found

The two safety properties of this change are that the provider sends only GET requests, and that a datastream id from the browser cannot change the upstream URL. The account for the OSH server can create and delete streams, so both matter more than the layer itself.

Both properties held in the design from round 1. What the review found was that the **proof** of each was weaker than the design:
- The test that proves one upstream call site read a fixed list of five files, matched a method name in upper case only, and never asserted that the one file holds exactly one call.
- The URL builder and its safety check were injectable options, so a caller could replace the id boundary.
- Two tests carried a scenario tag and asserted nothing that the scenario named.

The code changed for all of these. One real defect also came out of round 1: the page walk discarded the HTTP status, so an upstream 401 or 500 became an empty list that the five-minute cache then stored over a good snapshot.

## Findings

### Round 1: spec-adversary

- [x] F1 critical The test of `osh-029` never read the entity list, so a failed fetch could remove every entity and the test would pass. It now asserts the count.
- [x] F2 critical No test asserted `getStats().stale`. A source that returns `stale: true` now proves it.
- [x] F3 major `oshPages()` discarded the page status, so a 401, 403, 404 or 500 became an empty list, answered as 200 with count 0, and the list cache stored it for five minutes. It now throws outside 200 to 299, as the observation fetch does.
- [x] F4 major The one-call-site proof read a fixed list of five files and missed each imported module. It now discovers the provider folder and reads the OSH adapters.
- [x] F5 major The same proof matched a method name in upper case only, matched `body:` as a literal, and never asserted one call in `get.js`. All three are corrected.
- [x] F6 major No test asserted the 200 body of the observations route.
- [x] F7 major The repository hygiene scan missed the test files under `src/layers/osh/`.
- [x] F8 minor The address match needed a scheme. See the known limit `osh-hygiene-scope-limited`.
- [x] F9 minor The URL builder and the safety check were injectable, so a caller could defeat the id boundary. Both are now module-private, and the design records that the guard branch cannot run for an accepted id.
- [x] F10 minor The Impact said the change closes no gap, but it closes the gap of `src/data/localLayers.js`.
- [x] F11 minor The ledger recorded a branch count that moves for a file this change does not touch. See the Impact and `banked-branch-count`.
- [x] F12 minor `writeOshDetail()` was exported but never called, so it reached 100% coverage only through its own test. The layer now calls it.
- [x] F13 minor The cache cap test asserted only the size, so a cache that dropped the newest id would pass.
- [x] F14 minor The oversized-body test asserted only the rejection, not that the body stayed unread.

### Round 1: ste-adversary

- [x] S1 to S21 All 21 findings corrected. Nine were disagreements between a scenario and the code, and in each the code was right: `disable()` hides while `destroy()` removes, the id pattern refuses more than the character class, `flattenOshResult()` marks only an object or an array, and the keyless path answers 503 rather than 404. The rest were wording.

### Round 2: spec-adversary (Verdict: PASS)

- [x] F1 to F7 The page-status throw gained a scenario line, the scanned-file guard gained a count, the no-seam test became structural, `osh-034` matched its test, and the Impact named the closed gap. Two items stayed open into round 3.

### Round 2: ste-adversary

- [x] S1 to S17 All corrected. Five were majors created by the round-1 code fixes: the `DELETE` sentence was false because `observations.js` holds `cache.delete()`, `osh.js` imports `oshPages` rather than `oshGet`, the scan reads more files than the spec said, `osh-014` had no line for the page status, and `osh-034` said `osh*` when the test matches the path.

### Round 3: spec-adversary (Verdict: PASS)

- [x] F1 to F6 The `osh-005` WHEN now describes discovery, the no-seam test gained a text assertion, the `osh-014` WHEN covers any page walk, and the hygiene match no longer depends on a list of top-level domains. The scanned-set gap is recorded as `osh-get-test-is-text`.

### Round 3: ste-adversary

- [x] S1 major The Impact said the `labelArbiter.js` entry equals its base value. It did not at that moment. The text now states the behaviour: each run gives 50 or 52 not-covered branches, the covered count stays 355, and the entry holds the count of the last run.
- [x] S2 major The Impact said two files stay fully covered. Both have an open gap. The Impact now gives each.
- [x] S3 major "the three OSH adapters" was four files, one of which is not an adapter.
- [x] S4 major The design said a value past depth four gets a marker. The code marks at depth four, and only an object or an array.
- [x] S5 to S7 Wording.

### Round 4: spec-adversary (Verdict: PASS)

- [x] No finding. Round 3 gave PASS with no open major, so this output is the round-3 output.

### Round 4: ste-adversary (Verdict: PASS)

- [x] S1 major The known limit `osh-hygiene-scope-limited` said `osh-034` refuses a URL whose host is not `*.example`. The check also accepts `localhost`, which `server/providers/osh.js` uses. The spec stated it correctly; only the limit overstated it. Corrected and confirmed.
