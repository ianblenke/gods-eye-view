# Review: skywatch-source

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-21
Gates: make gates CHANGE=skywatch-source passed
Rounds: 4
Scope: diff 76fe039a
Reviewed-Tree: c4d9e5a382c40835942f4a9f166b1b069d7632fca4b6fde74fbf3f17dc18a32e

## Findings

Two plan reviews came first (both FAIL at a66c9319 and at 16358b9f). The lead corrected their findings in the plan before the first test. Their reports are outside the repository.

Round 1 had the scope full, at the commit c762e08b. Both reviewers gave FAIL. The corrections changed the code, the tests and the spec, so the lead moved the change back from the archive (c7bb6d54), restored `openspec/specs` from d49a0212, ran the faults, the host tests and the ratchet again, and archived the change again (2a4dc0b6). Round 2 had the scope diff c762e08b. The STE adversary gave PASS, and the spec adversary gave FAIL with one major finding in `evidence/faults.txt`. Rounds 3 and 4 were narrow confirmation rounds for that file. Round 4 gave PASS from both reviewers.

The reports of each round are in `review/round-<n>/`, and the reports of round 4 are also in `review/`. Each file holds the report word for word.

The first ratchet stopped with TRACE-TOO-MANY-TAGS (a test tag with four scenario IDs). The commit 06998ac3 gives that test the one tag `skywatch-source-018`. The second and the third ratchet gave only REVIEW-MISSING.

### Round 1 (commit c762e08b)

- [x] FINDING major (spec adversary) No test checked that the plugin clears the timer only after it reads the body. Fixed: the test "clears the timer only after it reads the body" and the fault "timer cleared right after the headers".
- [x] FINDING major (spec adversary) No test failed when the rate limit moved before the local check, or when the key step moved after the store. Fixed: two tests of `skywatch-source-018` and two faults.
- [x] FINDING major (spec adversary) Five tests had no named fault, and an assertion inside the fake fetch could not fail. Fixed: 11 new faults (125 of 125 killed), the redirect option asserted outside the fake fetch, and a test time limit for the time-limit test.
- [x] FINDING major (spec adversary) The header of `evidence/faults.txt` named an older run than its result. Fixed: a new record of the last run that names each earlier run.
- [x] FINDING major (spec adversary and STE adversary) `CHANGELOG.md` said "at most 20 searches". Fixed: the default and the setting `SKYWATCH_DAILY_SEARCHES`.
- [x] FINDING major (STE adversary) Task 1.6 named `skywatch-source-013`, and its tests are in the proxy test file. Fixed: task 1.2 names it.
- [x] FINDING major (STE adversary) The requirement "Upstream failures" also covered an answer 202. Fixed: a second sentence says that an answer 202 to one of the first nine result requests is not a failure.
- [x] FINDING major (STE adversary) The WHEN of `skywatch-source-013` had two meanings. Fixed: it names the status route, a good search and each failure kind of 012 and 019, and the test has answers for each kind.
- [x] FINDING minor (spec adversary) No test sample had a position with a text as its third value. Fixed: the sample [10, 60, "x"] and a fault.
- [x] FINDING minor (spec adversary) No Known limit named the rule of the id. Fixed: the Known limit `id-rule`.
- [x] FINDING minor (spec adversary) The 013 test had no flow for each failure kind. Fixed with the STE major finding above.
- [x] FINDING minor (spec adversary) The status route checked the same site before its path. Fixed in `server/providers/skywatch.js`, with a line in 001, a test and a fault.
- [x] FINDING minor (spec adversary) The title of one 014 test did not match its body. Fixed: "counts a failed search against the daily limit".
- [x] FINDING minor (STE adversary) Line 1 of `evidence/faults.txt` named an older run. Fixed with the spec major finding above.
- [x] FINDING minor (STE adversary) "the body read" used a verb as a noun. Fixed: "the body step".
- [x] FINDING minor (STE adversary) Three test titles used voice or words of STE faults. Fixed: "while readBodyText reads it", "when the test gives no options" and "a body without a date".
- [x] FINDING minor (STE adversary) "would answer" and "fires". Fixed: "can answer" and "when the time limit ends".
- [x] FINDING minor (STE adversary) "in each flow", "the polls" and "closed positions" in test titles. Fixed: "for each answer of the fake fetch", "the number of result requests" and "one closed ring of 4 to 2000 positions".

### Round 2 (commit 2a4dc0b6)

- [x] FINDING major (spec adversary) `evidence/faults.txt` said that the commit 358a1140 adds tests for all 11 new faults. Fixed: the record says which six faults have a new test, assertion, sample or test time limit, and which five faults the tests of c762e08b kill.
- [x] FINDING minor (spec adversary and STE adversary) The record did not name the second run of the faults, which stopped at the time limit of the runner. Fixed in rounds 3 and 4.
- [x] FINDING minor (STE adversary) Fault names in the record used a verb as a noun or had no verb. Fixed.
- [x] FINDING minor (STE adversary) The test title "a body without a date" has two meanings, and both are true of the test. Kept: a new title needs another ratchet of 30 minutes, and the test checks a body without `start` and a body without `end`.
- [x] FINDING minor (STE adversary) The Known limit `id-rule` gave the rule with no noun. Fixed.
- [x] FINDING minor (STE adversary) The title "refuses a request of another machine before the rate limit" uses "of" where the spec uses "from". Kept: the meaning is the same, and a new title needs another ratchet.

### Round 3 (commit 76fe039a, narrow)

- [x] FINDING major (STE adversary) "it gave no result" for the second run had a false meaning: that run gave the result of 61 faults. Fixed: "It gave a result for only the first 61 faults, and it gave no total."
- [x] FINDING minor (spec adversary) The record did not say that a test of c762e08b also kills the fault of the timer cleared after the headers. Fixed.
- [x] FINDING minor (spec adversary) The record did not name the survivor of the third run. Fixed: "rate limit after the store", moved and named "rate limit after the body check".
- [x] FINDING minor (spec adversary and STE adversary) "which has no effect", "came" and "already". Fixed.

### Round 4 (commit 901bda0c, narrow)

Both reviewers gave PASS. The lead corrected the three minor findings in `evidence/faults.txt`, and the proposal records them as the review minor `faults-wording`.

- [x] FINDING minor (spec adversary) A sentence about the second run had 30 words. Fixed: two sentences.
- [x] FINDING minor (spec adversary) The record did not say that the survivor of the third run had the same text in the first run. Fixed.
- [x] FINDING minor (STE adversary) The sentence about the fake upstream was not clear about which request waited. Fixed: "The test released its fake upstream only after the second scenes request ended, and that request waited for the upstream."
