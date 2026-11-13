# Review: up42-quote-panel

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-13
Gates: make gates CHANGE=up42-quote-panel passed
Rounds: 3
Scope: diff 8b680ae5
Reviewed-Tree: 0000000000000000000000000000000000000000000000000000000000000000

Resolved files: none

## Findings

Round 1 had the scope full, at the commit 4c4b97de. Both reviewers gave FAIL. Round 2 had the scope diff 4c4b97de, at the commit 8b680ae5. The spec reviewer gave FAIL and the STE reviewer gave PASS. Round 3 had the scope diff 8b680ae5, at the commit 402dfc4e. Both reviewers gave PASS. The reports of each round are in `review/round-<n>/`. The files in `review/` are the reports of round 3.

Four ratchet runs came after the first proposal. The first run stopped on two task lines that named a range of scenario IDs. The lead restored the coverage entries of two unrelated files to the values of main after each run, because their branch totals changed with no edit in this change.

### Round 1 (commit 4c4b97de)

- [x] FINDING critical (spec adversary) The destroy case of scenario 006 had no test. Fixed: a new test destroys the layer during a quote and checks the abort and the late result.
- [x] FINDING critical (spec adversary) The test of the size limit used invalid JSON. Fixed: the test now reads a valid body of 262144 bytes and refuses a valid body of 262145 bytes.
- [x] FINDING critical (spec adversary) The test of scenario 002 dropped every check except one. Fixed: the test now compares the complete results object.
- [x] FINDING critical (spec adversary) The signal test also passed with the signal of the caller. Fixed: the tests check that the two signals differ.
- [x] FINDING major (spec adversary) After a failed search, the message of the search hid the confirm text. Fixed: the quote message has priority in the info text. A new test covers the sequence.
- [x] FINDING critical (spec adversary) The spec said that each chip is disabled during a quote, but only the quote chip is. Fixed: the spec now says the quote chip. The search chip must stay active, because a press of it ends the quote.
- [x] FINDING critical (spec adversary) Scenario 007 said "the last part" of the info text. Fixed: the spec now says the quote text ends with the budget part, and the layer test checks the start of the info text.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING major (STE adversary) The spec, the design, the proposal and the tasks disagreed with the code in six places (chip state, flow states, area message, message table, test files and one test file that this change does not touch). Fixed in all four files.
- [x] FINDING major (STE adversary) Three tasks gave two instructions each. Fixed: each task gives one instruction.
- [x] FINDING minor (STE adversary) Passive voice, -ing words, verbs as nouns and a phrasal verb in the prose and in three test names. Fixed, except the two accepted findings below.
- [x] FINDING minor (STE adversary) The on-screen texts "Asking for a quote…", "No order was made" and "This quote is kept from before" use an -ing form or the passive voice. Accepted by name: the suggested texts read worse for a person who uses the panel.

### Round 2 (commit 8b680ae5)

- [x] FINDING major (spec adversary) A search press with no box left the old quote text in the info text and hid the reason. Fixed: a press of the search chip resets the quote flow before it forms the box. A new test covers the sequence, and a removal of the reset makes two tests fail.
- [x] FINDING major (spec adversary) No spec named the limit of 262144 bytes. Fixed: scenario 002 names the limit and the result for 262145 bytes in both copies of the spec.
- [x] FINDING minor (spec adversary) The gate log ended with `REVIEW-MISSING`. Fixed: this file records the review.
- [x] FINDING minor (STE adversary) A test title used the passive voice. Fixed.

### Round 3 (commit 402dfc4e)

No findings from either reviewer.

## Known limits

The page has not run against the real UP42 quote routes, and no real-browser check ran for this change. The panel offers the first six products only and sends no parameters. The routes stay off until `UP42_QUOTES=true` is set in `.env`.
